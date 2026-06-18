import {defineField, defineType} from 'sanity'

/**
 * Hero (простий) — універсальний верхній блок сторінки.
 * Без посилань на build/game. H1 + підзаголовок + опціональний CTA + фон.
 *
 * Продуктовий hero з reference на build (heroWithBuild) — окрема секція,
 * додамо в наступному спринті.
 */
export const heroSimple = defineType({
  name: 'heroSimple',
  title: 'Hero (простий)',
  type: 'object',
  fields: [
    defineField({name: 'h1', type: 'string', validation: (r) => r.required().max(80)}),
    defineField({name: 'subtitle', type: 'text', rows: 2}),
    defineField({
      name: 'cta',
      title: 'Кнопка',
      type: 'object',
      fields: [
        defineField({name: 'text', type: 'string'}),
        defineField({
          name: 'href',
          type: 'string',
          description: 'Внутрішній шлях, напр. /pidbir',
        }),
      ],
    }),
    defineField({
      name: 'bgImage',
      title: 'Фонове зображення',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'h1', subtitle: 'subtitle'},
    prepare: ({title, subtitle}) => ({
      title: title || '(без H1)',
      subtitle: 'Hero · ' + ((subtitle as string | undefined)?.slice(0, 50) || ''),
    }),
  },
})
