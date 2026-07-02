#!/usr/bin/env node
/**
 * Надсилає в Telegram-канал підсумок запуску синхронізації цін
 * (PRICE_SYNC → Sanity → KeyCRM). Викликається з GitHub Actions
 * окремим кроком: один раз при успіху (SYNC_STATUS=success),
 * один раз при падінні (SYNC_STATUS=failure).
 *
 * Потрібні змінні середовища: TELEGRAM_BOT_ID, TELEGRAM_CHAT_ID, SYNC_STATUS, RUN_URL
 * Для success додатково: SANITY_APPLIED, SANITY_SKIPPED, KEYCRM_APPLIED, KEYCRM_SKIPPED
 */
import {sendTelegramMessage} from './lib/telegram.mjs'

function buildSuccessMessage() {
  const sanityApplied = process.env.SANITY_APPLIED ?? '?'
  const sanitySkipped = process.env.SANITY_SKIPPED ?? '?'
  const keycrmApplied = process.env.KEYCRM_APPLIED ?? '?'
  const keycrmSkipped = process.env.KEYCRM_SKIPPED ?? '?'
  const runUrl = process.env.RUN_URL ?? ''

  return [
    '✅ <b>Синхронізація цін виконана успішно</b>',
    '',
    `Sanity: оновлено ${sanityApplied}, пропущено ${sanitySkipped}`,
    `KeyCRM: оновлено ${keycrmApplied}, пропущено ${keycrmSkipped}`,
    '',
    runUrl,
  ].join('\n')
}

function buildFailureMessage() {
  const runUrl = process.env.RUN_URL ?? ''
  return ['🔴 <b>Помилка синхронізації цін</b>', '', 'Лог запуску:', runUrl].join('\n')
}

async function main() {
  const status = process.env.SYNC_STATUS
  if (status !== 'success' && status !== 'failure') {
    throw new Error(`SYNC_STATUS має бути "success" або "failure", отримано: "${status}"`)
  }

  const text = status === 'success' ? buildSuccessMessage() : buildFailureMessage()
  await sendTelegramMessage(text)
  console.log('Telegram-сповіщення надіслано')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
