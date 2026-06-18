import {defineField, defineType} from 'sanity'

/**
 * FAQ accordion — вбудований список питань-відповідей.
 * Кожна сторінка формує власний FAQ вручну (без вибору із загального довідника).
 */
export const faqAccordion = defineType({
  name: 'faqAccordion',
  title: 'FAQ-аккордеон',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      initialValue: 'Часті питання',
    }),
    defineField({
      name: 'items',
      title: 'Питання та відповіді',
      description: 'Додайте питання вручну — кожне з власною відповіддю',
      type: 'array',
      of: [{type: 'faqQuestion'}],
      validation: (r) => r.required().min(1).max(20),
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare: ({title, items}) => ({
      title: title || 'FAQ',
      subtitle: `${(items as unknown[] | undefined)?.length || 0} питань`,
    }),
  },
})
