import {defineField, defineType} from 'sanity'

/**
 * FAQ-питання — вбудований об'єкт (НЕ окремий документ).
 *
 * Використовується inline у блоці faqAccordion (лендинги), у полі customFaq
 * збірки (build) та статті блогу (blogPost). Кожна сторінка формує власний список питань
 * вручну — без вибору із загального довідника.
 * Відповідь — Portable Text: текст, списки, посилання та блок «Кнопка».
 */
export const faqQuestion = defineType({
  name: 'faqQuestion',
  title: 'FAQ — питання',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Питання',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Відповідь',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Посилання в тексті',
                fields: [
                  defineField({name: 'href', type: 'url'}),
                  defineField({name: 'newTab', type: 'boolean', initialValue: false}),
                ],
              },
            ],
          },
        },
        {type: 'faqAnswerButton'},
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'question'},
    prepare: ({title}) => ({
      title: title || 'Питання без заголовка',
      subtitle: 'FAQ',
    }),
  },
})
