import {defineField, defineType} from 'sanity'

/**
 * Кнопка всередині Portable Text (FAQ, статті блогу).
 * На фронті рендериться окремим CTA-блоком, не як текстове посилання.
 */
export const faqAnswerButton = defineType({
  name: 'faqAnswerButton',
  title: 'Кнопка',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Назва',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'href',
      title: 'Посилання',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'newTab',
      title: 'Відкривати в окремому вікні',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {label: 'label', href: 'href'},
    prepare: ({label, href}) => ({
      title: label || 'Кнопка',
      subtitle: href,
    }),
  },
})
