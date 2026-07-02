export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_ID
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('TELEGRAM_BOT_ID / TELEGRAM_CHAT_ID не задано')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.description || 'Telegram sendMessage: невідома помилка')
  return json
}
