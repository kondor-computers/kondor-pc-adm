#!/usr/bin/env node
/**
 * Синхронізує ціни з вкладки PRICE_SYNC (джерело правди, редагується людиною вручну) → Sanity.
 *
 * За замовчуванням працює в режимі dry-run: рахує, що саме зміниться, і виводить
 * план у консоль, НІЧОГО не пишучи в Sanity.
 *
 * Запуск:
 *   source .env.local && npm run sync:price-sync              # dry-run (звіт)
 *   source .env.local && npm run sync:price-sync -- --apply   # реальний запис
 *                                                              # (потрібен SANITY_API_TOKEN з правом write)
 */
import {getGoogleAccessToken} from './lib/google-sheets.mjs'

const PROJECT_ID = 'if6dzz62'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1Br42_sUkqER9o7WrMJ5yM6bejThwsnbAaDaRQfg9MdY'

const SANITY_GROQ = `{
  "builds": *[_type == "build"]{
    _id, sku, name, priceUah,
    ssdOptions[]{_key, id, sku, label, priceDelta},
    warrantyOptions[]{_key, id, sku, label, priceDelta}
  },
  "cpus": *[_type == "cpu"]{_id, "sku": sku.current, brand, model, priceUah},
  "gpus": *[_type == "gpu"]{_id, "sku": sku.current, brand, model, priceUah},
  "rams": *[_type == "ram"]{_id, "sku": sku.current, title, priceUah},
  "addons": *[_type == "buildAddon"]{_id, "sku": sku.current, title, priceUah}
}`

function parseSheetPrice(raw) {
  if (raw == null || raw === '') return null
  const n = Number(String(raw).replace(/\u00a0/g, '').replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

async function fetchPriceSyncRows(token) {
  const range = encodeURIComponent("'PRICE_SYNC'!A2:G1000")
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`,
    {headers: {Authorization: `Bearer ${token}`}},
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `Sheets API ${res.status}`)

  const rows = []
  for (const row of data.values ?? []) {
    const sku = row[0]?.trim()
    if (!sku) continue
    rows.push({
      sku: sku.toUpperCase(),
      entity_type: row[1]?.trim() ?? '',
      price_uah: parseSheetPrice(row[2]),
      price_kind: row[3]?.trim() ?? '',
      notes: row[4]?.trim() ?? '',
      source_cell: row[5]?.trim() ?? '',
      discover_source: row[6]?.trim() ?? '',
    })
  }
  return rows
}

async function fetchSanityData() {
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(SANITY_GROQ)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  return (await res.json()).result
}

function indexBySku(list) {
  return new Map(list.map((x) => [String(x.sku ?? '').toUpperCase(), x]))
}

function planSimpleEntity(row, bySku, label, plan, skipped) {
  const doc = bySku.get(row.sku)
  if (!doc) {
    skipped.push({...row, reason: `немає такого ${label} в Sanity`})
    return
  }
  if (doc.priceUah !== row.price_uah) {
    plan.push({
      sku: row.sku,
      entity_type: row.entity_type,
      targetLabel: doc.brand || doc.title || doc.model ? `${doc.brand ?? ''} ${doc.model ?? doc.title ?? ''}`.trim() : undefined,
      field: 'priceUah',
      oldValue: doc.priceUah,
      newValue: row.price_uah,
      targetId: doc._id,
      patchPath: 'priceUah',
    })
  }
}

function planDeltaEntity(row, builds, field, plan, skipped) {
  let matched = 0
  for (const build of builds) {
    const opt = (build[field] || []).find((o) => String(o.sku ?? '').toUpperCase() === row.sku)
    if (!opt) continue
    matched++
    if (opt.priceDelta !== row.price_uah) {
      plan.push({
        sku: row.sku,
        entity_type: row.entity_type,
        targetLabel: `${build.name} (${build.sku})`,
        field: `${field}[sku=="${row.sku}"].priceDelta`,
        oldValue: opt.priceDelta,
        newValue: row.price_uah,
        targetId: build._id,
        patchPath: `${field}[sku=="${row.sku}"].priceDelta`,
      })
    }
  }
  if (matched === 0) {
    skipped.push({...row, reason: `SKU не знайдено в жодного ${field} на збірках`})
  }
}

function buildMutationPlan(rows, data) {
  const plan = []
  const skipped = []
  const buildBySku = indexBySku(data.builds)
  const cpuBySku = indexBySku(data.cpus)
  const gpuBySku = indexBySku(data.gpus)
  const ramBySku = indexBySku(data.rams)
  const addonBySku = indexBySku(data.addons)

  for (const row of rows) {
    if (row.price_uah == null) {
      skipped.push({...row, reason: 'порожня ціна в PRICE_SYNC'})
      continue
    }
    switch (row.entity_type) {
      case 'build':
        planSimpleEntity(row, buildBySku, 'збірку', plan, skipped)
        break
      case 'cpu':
        planSimpleEntity(row, cpuBySku, 'CPU', plan, skipped)
        break
      case 'gpu':
        planSimpleEntity(row, gpuBySku, 'GPU', plan, skipped)
        break
      case 'ram':
        planSimpleEntity(row, ramBySku, 'RAM', plan, skipped)
        break
      case 'addon':
        planSimpleEntity(row, addonBySku, 'buildAddon', plan, skipped)
        break
      case 'ssd':
        planDeltaEntity(row, data.builds, 'ssdOptions', plan, skipped)
        break
      case 'warranty':
        planDeltaEntity(row, data.builds, 'warrantyOptions', plan, skipped)
        break
      default:
        skipped.push({...row, reason: `невідомий entity_type "${row.entity_type}"`})
    }
  }
  return {plan, skipped}
}

async function applyMutations(plan, token) {
  const mutations = plan.map((p) => ({patch: {id: p.targetId, set: {[p.patchPath]: p.newValue}}}))
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations}),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.description || JSON.stringify(json))
  return json
}

async function main() {
  const apply = process.argv.includes('--apply')
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!credsJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON не задано (source .env.local)')
  const creds = JSON.parse(credsJson)

  const token = await getGoogleAccessToken(creds, 'https://www.googleapis.com/auth/spreadsheets.readonly')
  const [rows, data] = await Promise.all([fetchPriceSyncRows(token), fetchSanityData()])

  const {plan, skipped} = buildMutationPlan(rows, data)

  console.log(`Джерело: вкладка PRICE_SYNC · рядків: ${rows.length}`)
  console.log(`До оновлення в Sanity: ${plan.length}`)
  console.log(`Пропущено: ${skipped.length}`)
  console.log('')

  if (plan.length) {
    console.log('=== ПЛАН ЗМІН ===')
    for (const p of plan) {
      const target = p.targetLabel ? ` [${p.targetLabel}]` : ''
      console.log(
        `  ${p.entity_type.padEnd(9)} ${p.sku.padEnd(28)}${target} ${p.oldValue ?? '—'} → ${p.newValue}  (${p.field})`,
      )
    }
    console.log('')
  }

  if (skipped.length) {
    console.log('=== ПРОПУЩЕНО ===')
    for (const s of skipped) {
      console.log(`  ${(s.entity_type || '?').padEnd(9)} ${s.sku.padEnd(28)} ${s.reason}`)
    }
    console.log('')
  }

  if (!apply) {
    console.log('Це dry-run: жодна ціна в Sanity НЕ була змінена.')
    console.log('Щоб застосувати реально: source .env.local && SANITY_API_TOKEN=... npm run sync:price-sync -- --apply')
    return
  }

  const writeToken = process.env.SANITY_API_TOKEN
  if (!writeToken) throw new Error('SANITY_API_TOKEN не задано — потрібен токен Sanity з правом Editor/write')
  if (!plan.length) {
    console.log('Немає змін для запису — Sanity вже відповідає PRICE_SYNC.')
    return
  }

  const result = await applyMutations(plan, writeToken)
  console.log(`Застосовано мутацій: ${plan.length}. transactionId: ${result.transactionId}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
