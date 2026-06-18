import {defineArrayMember, defineField, defineType} from 'sanity'

function nonEmptyString(value: unknown): true | string {
  return typeof value === 'string' && value.trim().length > 0 ? true : 'Обовʼязкове поле'
}

export const homePcTasksSection = defineType({
  name: 'homePcTasksSection',
  title: 'Головна: для яких задач збираємо ПК',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Картки',
      type: 'array',
      description: 'Назва, ігри (для посилань на сторінки) та іконка для кожної картки.',
      validation: (R) => R.required().min(1),
      of: [
        {
          type: 'object',
          name: 'pcTaskCard',
          title: 'Задача',
          fields: [
            defineField({
              name: 'name',
              title: 'Назва',
              type: 'string',
              description: 'Текст на картці на головній (може відрізнятися від назви гри).',
              validation: (R) => R.required().custom(nonEmptyString).min(2),
            }),
            defineField({
              name: 'games',
              title: 'Ігри',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'reference',
                  to: [{type: 'game'}],
                  options: {
                    filter: 'enabled != false',
                  },
                }),
              ],
              description:
                'Можна обрати кілька ігор. На фронті посилання за slug (напр. /game-pc/{slug}) для кожної.',
              validation: (R) => R.required().min(1),
            }),
            defineField({
              name: 'icon',
              title: 'Іконка',
              type: 'image',
              options: {hotspot: true},
              description: 'SVG або PNG. Рекомендовано квадратне зображення.',
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: {
              name: 'name',
              games: 'games',
              media: 'icon',
            },
            prepare({name, games, media}: {name?: string; games?: {_ref?: string}[]; media?: unknown}) {
              const count = Array.isArray(games) ? games.length : 0
              return {
                title: name ?? 'Без назви',
                subtitle: count > 0 ? `${count} ${count === 1 ? 'гра' : 'ігор'}` : undefined,
                media: media as any,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: 'Для яких задач збираємо ПК',
        subtitle: `${count} карток`,
      }
    },
  },
})
