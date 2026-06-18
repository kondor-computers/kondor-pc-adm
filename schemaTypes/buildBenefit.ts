import {defineField, defineType} from 'sanity'

/**
 * Build benefit — reusable reference document.
 * One benefit is created once and referenced from every PC build.
 */
export const buildBenefit = defineType({
  name: 'buildBenefit',
  title: 'Перевага збірки',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Ключ',
      type: 'string',
      description:
        'Стабільний ключ для фронтенду (assembly · stress-test · windows). ' +
        'Використовується для іконок та логіки на сторінці ПК.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/, {name: 'kebab-case-ascii'})
          .error('Тільки латиниця, цифри, дефіс (наприклад: assembly, stress-test).'),
    }),
    defineField({
      name: 'title',
      title: 'Перевага',
      type: 'string',
      description: 'Заголовок картки переваги (наприклад: «Стрес-тестування системи»).',
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'string',
      description: 'Підзаголовок під назвою на картці переваги.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Порядок сортування',
      type: 'number',
      description: 'Менше = вище у списку вибору та на сайті.',
    }),
  ],
  orderings: [
    {
      title: 'За порядком, потім за назвою',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', description: 'description', key: 'key'},
    prepare({title, description, key}) {
      return {
        title: title ?? 'Без назви',
        subtitle: description ?? key,
      }
    },
  },
})
