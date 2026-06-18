import {defineField, defineType} from 'sanity'

/**
 * Feature list — сітка фічей з іконками.
 * Кожна фіча: іконка + заголовок + опис.
 * Icon — це строка: або ім'я з набору фронту (shield, truck, zap, tools,
 * chart, cpu, headset, box), або емодзі.
 */
export const featureList = defineType({
  name: 'featureList',
  title: 'Список фічей',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'subheading', type: 'text', rows: 2}),
    defineField({
      name: 'columns',
      type: 'number',
      options: {list: [2, 3, 4]},
      initialValue: 3,
    }),
    defineField({
      name: 'features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              type: 'string',
              description:
                "Ім'я з набору: shield, truck, zap, tools, chart, cpu, headset, box. Або емодзі.",
              validation: (r) => r.required(),
            }),
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'text',
              type: 'text',
              rows: 2,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text', icon: 'icon'},
            prepare: ({title, subtitle, icon}) => ({
              title: `${icon} ${title}`,
              subtitle,
            }),
          },
        },
      ],
      validation: (r) => r.required().min(2).max(8),
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', features: 'features'},
    prepare: ({title, features}) => ({
      title: title || 'Features',
      subtitle: `${(features as unknown[] | undefined)?.length || 0} фіч`,
    }),
  },
})
