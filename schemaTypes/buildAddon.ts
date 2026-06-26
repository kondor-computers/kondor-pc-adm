import {defineField, defineType} from 'sanity'

/**
 * Build addon — reusable catalog entry for PC configurator extras
 * (WiFi module, Bluetooth, PSU upgrade, etc.).
 */
export const buildAddon = defineType({
  name: 'buildAddon',
  title: 'Додаткова опція',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'ID (ключ)',
      type: 'string',
      description:
        'Стабільний ключ для фронтенду (wifi-module · bluetooth · psu-850w). ' +
        'Використовується в кошику та CRM.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/, {name: 'kebab-case-ascii'})
          .error('Тільки латиниця, цифри, дефіс (наприклад: wifi-module, psu-850w).'),
    }),
    defineField({
      name: 'title',
      title: 'Назва',
      type: 'string',
      description: 'Напр. «WiFi модуль», «Блок живлення 850W».',
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'text',
      rows: 2,
      description: 'Коротке пояснення для покупця в конфігураторі.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'priceUah',
      title: 'Базова ціна (₴)',
      type: 'number',
      description: 'Доплата за замовчуванням. На конкретній збірці можна перевизначити.',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Категорія',
      type: 'string',
      description: 'Групування в UI конфігуратора. Напр. «Мережа», «Живлення».',
      options: {
        list: [
          {title: 'Мережа', value: 'network'},
          {title: 'Живлення', value: 'power'},
          {title: 'Охолодження', value: 'cooling'},
          {title: 'ОС та софт', value: 'software'},
          {title: 'Аксесуари', value: 'accessories'},
          {title: 'Інше', value: 'other'},
        ],
      },
      initialValue: 'other',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'selectionMode',
      title: 'Тип вибору',
      type: 'string',
      description:
        'Додаткова — можна обрати кілька (WiFi + Bluetooth). ' +
        'Одна з групи — лише один варіант у категорії (різні БЖ).',
      options: {
        list: [
          {title: 'Додаткова (чекбокс)', value: 'additive'},
          {title: 'Одна з групи (радіо)', value: 'single'},
        ],
      },
      initialValue: 'additive',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Порядок сортування',
      type: 'number',
      description: 'Менше = вище у списку вибору та на сайті.',
    }),
    defineField({
      name: 'isActive',
      title: 'Активна',
      type: 'boolean',
      description: 'Вимкнена опція не зʼявляється у виборі для нових збірок.',
      initialValue: true,
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
    select: {
      title: 'title',
      key: 'key',
      priceUah: 'priceUah',
      category: 'category',
      isActive: 'isActive',
    },
    prepare({title, key, priceUah, category, isActive}) {
      const categoryLabels: Record<string, string> = {
        network: 'Мережа',
        power: 'Живлення',
        cooling: 'Охолодження',
        software: 'ОС та софт',
        accessories: 'Аксесуари',
        other: 'Інше',
      }
      const price =
        priceUah === 0 ? 'безкоштовно' : `+${priceUah?.toLocaleString('uk')} ₴`
      const status = isActive === false ? ' · вимкнено' : ''
      return {
        title: title ?? 'Без назви',
        subtitle: `${key} · ${categoryLabels[category] ?? category} · ${price}${status}`,
      }
    },
  },
})
