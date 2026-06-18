import {defineField, defineType} from 'sanity'

/**
 * Text block — rich-text контент з Portable Text.
 * Підтримує H2/H3, цитати, списки, посилання, інлайн-зображення.
 * Поле maxWidth керує шириною контейнера на фронті (narrow ≈ 720px).
 */
export const textBlock = defineType({
  name: 'textBlock',
  title: 'Текстовий блок',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'subheading', type: 'text', rows: 2}),
    defineField({
      name: 'body',
      title: 'Контент',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Звичайний', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Цитата', value: 'blockquote'},
          ],
          lists: [
            {title: 'Маркований', value: 'bullet'},
            {title: 'Нумерований', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Жирний', value: 'strong'},
              {title: 'Курсив', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                fields: [
                  defineField({name: 'href', type: 'url'}),
                  defineField({name: 'newTab', type: 'boolean', initialValue: false}),
                ],
              },
            ],
          },
        },
        {type: 'image', options: {hotspot: true}},
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'maxWidth',
      type: 'string',
      options: {list: ['narrow', 'normal', 'wide']},
      initialValue: 'narrow',
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', body: 'body'},
    prepare: ({title, body}) => ({
      title: title || '(без заголовка)',
      subtitle: 'Текст · ' + ((body as unknown[] | undefined)?.length || 0) + ' блоків',
    }),
  },
})
