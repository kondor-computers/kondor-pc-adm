import {defineField, defineType} from 'sanity'

export const blogAuthor = defineType({
  name: 'blogAuthor',
  title: 'Автор блогу',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: "Ім'я",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Фото',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативний текст',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'profileUrl',
      title: 'Посилання на профіль',
      description: 'URL сторінки автора (внутрішній або зовнішній)',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'photo'},
    prepare({title, media}) {
      return {
        title: title || "Без імені",
        media,
      }
    },
  },
})
