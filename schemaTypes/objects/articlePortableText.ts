/**
 * Portable Text для статей блогу та SEO-блоків.
 * Єдине джерело правди — зміни тут застосовуються в обох місцях.
 */
export const articlePortableTextOf = [
  {
    type: 'block',
    styles: [
      {title: 'Заголовок H2', value: 'h2'},
      {title: 'Заголовок H3', value: 'h3'},
      {title: 'Заголовок H4', value: 'h4'},
      {title: 'Звичайний текст', value: 'normal'},
    ],
    lists: [
      {title: 'Ненумерований список', value: 'bullet'},
      {title: 'Нумерований список', value: 'number'},
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
          title: 'Посилання',
          fields: [
            {
              name: 'href',
              type: 'string',
              title: 'URL',
              validation: (rule) => rule.required(),
            },
            {
              name: 'blank',
              type: 'boolean',
              title: 'Відкривати в новій вкладці',
              initialValue: false,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'image',
    title: 'Зображення',
    options: {
      hotspot: true,
    },
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Альтернативний текст',
        description: 'Важливо для SEO та доступності',
      },
    ],
  },
  {
    type: 'table',
    title: 'Таблиця',
  },
  {
    type: 'gallerySection',
    title: 'Галерея',
  },
  {type: 'faqAnswerButton'},
]
