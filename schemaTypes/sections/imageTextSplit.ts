import {defineField, defineType} from 'sanity'

/**
 * Image + text (50/50) — двоколонкова секція з картинкою і текстом.
 * imagePosition керує тим, з якого боку картинка на desktop.
 * Body — Portable Text (з заголовками H3 та списками).
 */
export const imageTextSplit = defineType({
  name: 'imageTextSplit',
  title: 'Фото + текст (50/50)',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', validation: (r) => r.required()}),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      options: {
        list: [
          {title: 'Зліва', value: 'left'},
          {title: 'Справа', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        },
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'cta',
      title: 'Кнопка (опц.)',
      type: 'object',
      fields: [
        defineField({name: 'text', type: 'string'}),
        defineField({name: 'href', type: 'string'}),
      ],
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', media: 'image', position: 'imagePosition'},
    prepare: ({title, media, position}) => ({
      title: title || '(без заголовка)',
      subtitle: `Image+Text · img ${position}`,
      media,
    }),
  },
})
