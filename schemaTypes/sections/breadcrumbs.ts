import {defineField, defineType} from 'sanity'

/**
 * Breadcrumbs — авто-генерована навігація з контексту сторінки.
 * Сам блок налаштувань не має (крім опціонального anchor).
 */
export const breadcrumbs = defineType({
  name: 'breadcrumbs',
  title: 'Хлібні крихти',
  type: 'object',
  fields: [
    defineField({
      name: 'note',
      type: 'string',
      readOnly: true,
      initialValue: 'Авто з контексту сторінки. Налаштувань нема.',
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {prepare: () => ({title: 'Breadcrumbs (авто)'})},
})
