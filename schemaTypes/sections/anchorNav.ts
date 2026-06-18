import {defineField, defineType} from 'sanity'

/**
 * Anchor navigation — sticky-меню з якорями, що ведуть до секцій нижче.
 * Кожен пункт = label + anchor (має співпадати з полем `anchor` секції).
 */
export const anchorNav = defineType({
  name: 'anchorNav',
  title: 'Якорна навігація',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'anchor', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {
            select: {label: 'label', anchor: 'anchor'},
            prepare: ({label, anchor}) => ({title: label, subtitle: `#${anchor}`}),
          },
        },
      ],
      validation: (r) => r.required().min(2).max(8),
    }),
    defineField({name: 'sticky', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}) => ({
      title: 'AnchorNav',
      subtitle: (items as Array<{label: string}> | undefined)
        ?.map((i) => i.label)
        .join(' · '),
    }),
  },
})
