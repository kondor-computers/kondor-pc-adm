import {defineField, defineType} from 'sanity'
import {articlePortableTextOf} from '../objects/articlePortableText'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Стаття блогу',
  type: 'document',
  fields: [
    // Hero секція
    defineField({
      name: 'heroTitle',
      type: 'string',
      title: 'Заголовок (Hero секція)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      type: 'text',
      title: 'Опис (Hero секція)',
      description: 'Опис для Hero секції (можна додати перенос рядків)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroDesktopImage',
      type: 'image',
      title: 'Зображення для десктопа (Hero секція)',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroMobileImage',
      type: 'image',
      title: 'Зображення для мобільних (Hero секція)',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Адреса (slug)',
      description: 'Автоматично генерується з заголовка, але можна змінити вручну',
      validation: (rule) => rule.required(),
      options: {
        source: 'heroTitle',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9а-яіїєґ/\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
    }),
    defineField({
      name: 'author',
      title: 'Автор',
      type: 'reference',
      to: [{type: 'blogAuthor'}],
      validation: (rule) => rule.required(),
    }),
    // Основний контент
    defineField({
      name: 'content',
      type: 'array',
      title: 'Основний контент',
      description:
        'Додайте контент статті: заголовки, параграфи, списки, зображення, таблиці, кнопки',
      of: articlePortableTextOf,
    }),
    defineField({
      name: 'customFaq',
      title: 'FAQ для цієї статті',
      type: 'array',
      description: 'Введіть питання та відповіді вручну — кожна стаття формує власний FAQ.',
      of: [{type: 'faqQuestion'}],
    }),
    // SEO блок
    defineField({
      name: 'seo',
      type: 'seoSettings',
      title: 'SEO блок',
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
      slug: 'slug.current',
      image: 'heroMobileImage',
      authorName: 'author.name',
    },
    prepare(selection) {
      const {title, slug, image, authorName} = selection
      const slugPart = slug ? `/${slug}` : 'Slug не налаштований'
      return {
        title: title || 'Без назви',
        subtitle: authorName ? `${slugPart} · ${authorName}` : slugPart,
        media: image,
      }
    },
  },
})
