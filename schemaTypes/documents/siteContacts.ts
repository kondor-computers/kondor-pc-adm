import {defineField, defineType} from 'sanity'

function nonEmptyString(value: unknown): true | string {
  return typeof value === 'string' && value.trim().length > 0 ? true : 'Обовʼязкове поле'
}

function withHttps(value: string): string {
  const v = value.trim()
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

function parseSocialUrl(value: unknown): URL | string {
  if (typeof value !== 'string' || value.trim().length === 0) return 'Обовʼязкове поле'
  try {
    return new URL(withHttps(value.trim()))
  } catch {
    return 'Невірний формат посилання'
  }
}

function validateYouTubeUrl(value: unknown): true | string {
  const parsed = parseSocialUrl(value)
  if (typeof parsed === 'string') return parsed

  const host = parsed.hostname.replace(/^www\./i, '').toLowerCase()
  const hasPath = parsed.pathname.length > 1

  if (host === 'youtu.be' && hasPath) return true
  if ((host === 'youtube.com' || host === 'm.youtube.com') && hasPath) return true

  return 'Посилання на YouTube: https://www.youtube.com/@канал або https://youtu.be/…'
}

function validateInstagramUrl(value: unknown): true | string {
  const parsed = parseSocialUrl(value)
  if (typeof parsed === 'string') return parsed

  const host = parsed.hostname.replace(/^www\./i, '').toLowerCase()
  const path = parsed.pathname.replace(/^\/+|\/+$/g, '')

  if (host === 'instagram.com' && path.length > 0 && !path.includes('/')) return true

  return 'Посилання на Instagram: https://www.instagram.com/username'
}

function requiredUrl(pattern: RegExp, hint: string) {
  return (value: unknown): true | string => {
    if (typeof value !== 'string' || value.trim().length === 0) return 'Обовʼязкове поле'
    const v = withHttps(value.trim())
    if (!pattern.test(v)) return hint
    return true
  }
}

export const siteContacts = defineType({
  name: 'siteContacts',
  title: 'Контакти',
  type: 'document',
  fieldsets: [
    {name: 'main', title: 'Контакти', options: {collapsible: false}},
    {name: 'social', title: 'Соцмережі', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      fieldset: 'main',
      validation: (R) => R.required().custom(nonEmptyString).email(),
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram',
      type: 'string',
      fieldset: 'main',
      description: 'Нік (@username) або посилання t.me/…',
      validation: (R) =>
        R.required()
          .custom(nonEmptyString)
          .custom((value) => {
            if (typeof value !== 'string') return 'Обовʼязкове поле'
            const v = value.trim()
            if (/^@[\w\d_]{4,32}$/i.test(v)) return true
            if (/^https?:\/\/(t\.me|telegram\.me)\/[\w\d_]{4,32}\/?$/i.test(v)) return true
            if (/^[\w\d_]{4,32}$/i.test(v)) return true
            return 'Вкажіть @username, username або посилання t.me/…'
          }),
    }),
    defineField({
      name: 'phone',
      title: 'Телефон',
      type: 'string',
      fieldset: 'main',
      description: 'Напр. +380501234567',
      validation: (R) =>
        R.required()
          .custom(nonEmptyString)
          .regex(/^\+380\d{9}$/)
          .error('Телефон у форматі +380 та 9 цифр після коду оператора.'),
    }),
    defineField({
      name: 'telegramChatUrl',
      title: 'Telegram-чат',
      type: 'url',
      fieldset: 'social',
      description: 'Посилання на чат або канал, напр. https://t.me/kondor_chat',
      validation: (R) =>
        R.required().custom(
          requiredUrl(
            /^https?:\/\/(t\.me|telegram\.me)\/.+/i,
            'Посилання на Telegram-чат (t.me/…)',
          ),
        ),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube',
      type: 'string',
      fieldset: 'social',
      description:
        'Повне посилання з https://, напр. https://www.youtube.com/@kondor або https://youtu.be/…',
      validation: (R) => R.required().custom(validateYouTubeUrl),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram',
      type: 'string',
      fieldset: 'social',
      description:
        'Повне посилання з https://, напр. https://www.instagram.com/kondor/ або instagram.com/kondor',
      validation: (R) => R.required().custom(validateInstagramUrl),
    }),
  ],
  preview: {
    select: {email: 'email', phone: 'phone'},
    prepare({email, phone}) {
      return {
        title: 'Контакти',
        subtitle: [email, phone].filter(Boolean).join(' · '),
      }
    },
  },
})
