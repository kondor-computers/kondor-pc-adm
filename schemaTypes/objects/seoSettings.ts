import {defineField, defineType} from 'sanity'
import {articlePortableTextOf} from './articlePortableText'

export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO налаштування',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      type: 'string',
      title: 'SEO title',
      description: 'Заголовок сторінки для пошукових систем (до 60 символів)',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      rows: 3,
      title: 'SEO description',
      description: 'Короткий опис сторінки (до 160 символів)',
      validation: (rule) => rule.max(260),
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'Ключові слова',
      description: 'Додайте ключові слова через список тегів',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'opengraphTitle',
      type: 'string',
      title: 'OG title',
      description: 'Заголовок для соціальних мереж (якщо порожньо — використовується SEO title)',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'opengraphDescription',
      type: 'text',
      rows: 3,
      title: 'OG description',
      description:
        'Опис для соціальних мереж (якщо порожньо — використовується SEO description)',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'opengraphImage',
      type: 'image',
      title: 'Open Graph зображення',
      description: 'Зображення для спільного доступу у соціальних мережах (1200×630 px)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Альтернативний текст',
          description: 'Важливо для SEO та доступності',
        },
      ],
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Контент',
      description:
        'Додайте контент: заголовки, параграфи, списки, зображення, таблиці, кнопки',
      of: articlePortableTextOf,
    }),
    defineField({
      name: 'schemaJson',
      type: 'file',
      title: 'schema.org JSON',
      description: 'Завантажте JSON файл зі структурованими даними',
      options: {
        accept: 'application/json',
        storeOriginalFilename: true,
      },
    }),
  ],
})
