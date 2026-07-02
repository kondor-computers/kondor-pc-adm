#!/usr/bin/env node
/**
 * Синхронізує ціни з вкладки PRICE_SYNC (джерело правди) → KeyCRM.
 *
 * На відміну від Sanity, у KeyCRM немає вкладених опцій — кожна позиція
 * (збірка, SSD/RAM/гарантія-допа тощо) це окремий плаский товар зі своїм
 * `sku` і `price`. Тож звірка проста: SKU з PRICE_SYNC шукається серед
 * усіх товарів KeyCRM напряму, без розбору по entity_type.
 *
 * За замовчуванням працює в режимі dry-run: рахує, що саме зміниться, і виводить
 * план у консоль, НІЧОГО не пишучи в KeyCRM.
 *
 * Запуск:
 *   source .env.local && npm run sync:price-sync-keycrm              # dry-run (звіт)
 *   source .env.local && npm run sync:price-sync-keycrm -- --apply   # реальний запис
 *                                                                     # (потрібен KEY_CRM_API_KEY)
 */
import {getGoogleAccessToken} from './lib/google-sheets.mjs'

const KEYCRM_API_URL = 'https://openapi.keycrm.app/v1'
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1Br42_sUkqER9o7WrMJ5yM6bejThwsnbAaDaRQfg9MdY'

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
    })
  }
  return rows
}

async function keycrmFetch(path, options = {}) {
  const key = process.env.KEY_CRM_API_KEY
  if (!key) throw new Error('KEY_CRM_API_KEY не задано (source .env.local)')
  const res = await fetch(`${KEYCRM_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `KeyCRM API ${path} → ${res.status}`)
  return json
}

async function fetchAllProducts() {
  let page = 1
  let all = []
  let lastPage = 1
  do {
    const json = await keycrmFetch(`/products?limit=50&page=${page}`)
    all = all.concat(json.data)
    lastPage = json.last_page
    page++
  } while (page <= lastPage)
  return all
}

function indexBySku(products) {
  const map = new Map()
  for (const p of products) {
    const sku = String(p.sku ?? '').trim().toUpperCase()
    if (!sku) continue
    map.set(sku, p)
  }
  return map
}

function buildMutationPlan(rows, productsBySku) {
  const plan = []
  const skipped = []

  for (const row of rows) {
    if (row.price_uah == null) {
      skipped.push({...row, reason: 'порожня ціна в PRICE_SYNC'})
      continue
    }
    const product = productsBySku.get(row.sku)
    if (!product) {
      skipped.push({...row, reason: 'немає такого товару в KeyCRM'})
      continue
    }
    if (product.price !== row.price_uah) {
      plan.push({
        sku: row.sku,
        entity_type: row.entity_type,
        targetLabel: product.name,
        oldValue: product.price,
        newValue: row.price_uah,
        targetId: product.id,
      })
    }
  }
  return {plan, skipped}
}

async function applyMutations(plan) {
  let applied = 0
  for (const p of plan) {
    await keycrmFetch(`/products/${p.targetId}`, {
      method: 'PUT',
      body: JSON.stringify({price: p.newValue}),
    })
    applied++
  }
  return applied
}

async function main() {
  const apply = process.argv.includes('--apply')
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!credsJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON не задано (source .env.local)')
  const creds = JSON.parse(credsJson)

  const token = await getGoogleAccessToken(creds, 'https://www.googleapis.com/auth/spreadsheets.readonly')
  const [rows, products] = await Promise.all([fetchPriceSyncRows(token), fetchAllProducts()])
  const productsBySku = indexBySku(products)

  const {plan, skipped} = buildMutationPlan(rows, productsBySku)

  console.log(`Джерело: вкладка PRICE_SYNC · рядків: ${rows.length}`)
  console.log(`Товарів у KeyCRM: ${products.length}`)
  console.log(`До оновлення в KeyCRM: ${plan.length}`)
  console.log(`Пропущено: ${skipped.length}`)
  console.log('')

  if (plan.length) {
    console.log('=== ПЛАН ЗМІН ===')
    for (const p of plan) {
      console.log(
        `  ${p.entity_type.padEnd(9)} ${p.sku.padEnd(30)} [${p.targetLabel}] ${p.oldValue} → ${p.newValue}`,
      )
    }
    console.log('')
  }

  if (skipped.length) {
    console.log('=== ПРОПУЩЕНО ===')
    for (const s of skipped) {
      console.log(`  ${(s.entity_type || '?').padEnd(9)} ${s.sku.padEnd(30)} ${s.reason}`)
    }
    console.log('')
  }

  if (!apply) {
    console.log('Це dry-run: жодна ціна в KeyCRM НЕ була змінена.')
    console.log('Щоб застосувати реально: source .env.local && npm run sync:price-sync-keycrm -- --apply')
    return
  }

  if (!plan.length) {
    console.log('Немає змін для запису — KeyCRM вже відповідає PRICE_SYNC.')
    return
  }

  const applied = await applyMutations(plan)
  console.log(`Застосовано оновлень: ${applied}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
