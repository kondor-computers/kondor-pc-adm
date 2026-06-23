import {defineField, defineType} from 'sanity'

/**
 * Table section — таблиця з @sanity/table.
 * Той самий редактор і структура даних, що й блок «Таблиця» у portable text статті блогу.
 */
export const tableSection = defineType({
  name: 'tableSection',
  title: 'Таблиця',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Заголовок над таблицею', type: 'string'}),
    defineField({
      name: 'table',
      title: 'Таблиця',
      type: 'table',
      validation: (r) => r.required(),
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', rows: 'table.rows'},
    prepare: ({title, rows}) => ({
      title: title || 'Таблиця',
      subtitle: `${(rows as unknown[] | undefined)?.length || 0} рядків`,
    }),
  },
})
