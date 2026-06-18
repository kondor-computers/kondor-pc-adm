import {defineField, defineType} from 'sanity'

/**
 * Game — reusable reference document.
 * A single Game is created once here and referenced from every GPU's FPS table
 * and from PC Build audience tags. Editors never retype the same game title.
 *
 * Kept lean on purpose — the frontend renders FPS rows and audience blocks
 * from the slug + localised name. Add richer marketing copy later only if
 * a page template actually consumes it.
 */
export const game = defineType({
  name: 'game',
  title: 'Гра',
  type: 'document',
  fieldsets: [
    {name: 'meta', title: 'Ідентифікація', options: {collapsible: false}},
    {name: 'display', title: 'Відображення', options: {collapsible: false}},
    {name: 'taxonomy', title: 'Таксономія', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description:
        'Стабільний ключ для фронтенду (cs2 · warzone · gta5 · cyberpunk). ' +
        'Використовується у FPS-таблиці GPU та в FPS-підписах на сторінці ПК.',
      fieldset: 'meta',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/, {name: 'kebab-case-ascii'})
          .error('Тільки латиниця, цифри, дефіс (наприклад: cs2, gta5, cyberpunk-2077).'),
    }),
    defineField({
      name: 'name',
      title: 'Оригінальна назва',
      type: 'string',
      description: 'Наприклад: Counter-Strike 2, Cyberpunk 2077.',
      fieldset: 'meta',
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: 'ukrName',
      title: 'Назва українською',
      type: 'string',
      description: 'Якщо гра зазвичай пишеться українською (Контр Страйк 2, Майнкрафт).',
      fieldset: 'meta',
    }),
    defineField({
      name: 'shortName',
      title: 'Коротка назва',
      type: 'string',
      description:
        'Використовується у компактних таблицях (CS2, GTA 5, CP 2077). Макс 10 символів.',
      fieldset: 'display',
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'text',
      rows: 3,
      description:
        'Короткий опис гри. Використовується у тултипах вибору гри та підказках на сторінці ПК.',
      fieldset: 'display',
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'coverImage',
      title: 'Обкладинка',
      type: 'image',
      description: 'Квадратне зображення для вибору у списку ігор та тайла.',
      options: {hotspot: true},
      fieldset: 'display',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-текст',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'genre',
      title: 'Жанр',
      type: 'string',
      options: {
        list: [
          {title: 'FPS / шутер', value: 'fps'},
          {title: 'MOBA', value: 'moba'},
          {title: 'Battle Royale', value: 'battle_royale'},
          {title: 'Sandbox', value: 'sandbox'},
          {title: 'MMORPG', value: 'mmorpg'},
          {title: 'Simulation', value: 'simulation'},
          {title: 'RPG', value: 'rpg'},
          {title: 'Strategy', value: 'strategy'},
          {title: 'Інше', value: 'other'},
        ],
      },
      fieldset: 'taxonomy',
    }),
    defineField({
      name: 'isPopular',
      title: 'Популярна',
      type: 'boolean',
      description: 'Відображається у підбірках "Топ ігор" та пропонується в UI підбору.',
      initialValue: true,
      fieldset: 'taxonomy',
    }),
    defineField({
      name: 'isSystemHeavy',
      title: 'Системовимоглива',
      type: 'boolean',
      description: 'Використовується фронтом для маркера "важка гра — рекомендуємо topовий ПК".',
      initialValue: false,
      fieldset: 'taxonomy',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Порядок сортування',
      type: 'number',
      description: 'Менше = вище. Залиш порожнім для дефолту.',
      fieldset: 'taxonomy',
    }),
    defineField({
      name: 'enabled',
      title: 'Активна',
      type: 'boolean',
      description:
        'Знімай галочку щоб приховати гру з усіх витягів у фронтенд, не видаляючи документ.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'За порядком, потім за назвою',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Популярні спершу',
      name: 'popularFirst',
      by: [
        {field: 'isPopular', direction: 'desc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'ukrName',
      media: 'coverImage',
      enabled: 'enabled',
    },
    prepare({title, subtitle, media, enabled}) {
      return {
        title: enabled ? title : `${title} · прихована`,
        subtitle,
        media,
      }
    },
  },
})
