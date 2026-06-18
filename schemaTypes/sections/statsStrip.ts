import {defineField, defineType} from 'sanity'

/**
 * Stats strip — стрічка з метриками (5 000+ збірок, 6 років, 64 тис, 500+).
 */
export const statsStrip = defineType({
  name: 'statsStrip',
  title: 'Стрічка статистики',
  type: 'object',
  fields: [
    defineField({
      name: 'stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'link', type: 'url'}),
          ],
          preview: {
            select: {value: 'value', label: 'label'},
            prepare: ({value, label}) => ({title: value, subtitle: label}),
          },
        },
      ],
      validation: (r) => r.required().min(3).max(5),
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {stats: 'stats'},
    prepare: ({stats}) => ({
      title: 'StatsStrip',
      subtitle: (stats as Array<{value: string}> | undefined)
        ?.map((s) => s.value)
        .join(' · '),
    }),
  },
})
