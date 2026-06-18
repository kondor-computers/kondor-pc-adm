import {defineField, defineType} from 'sanity'

const configOption = {
  type: 'object',
  title: 'Варіант',
  fields: [
    defineField({
      name: 'id',
      title: 'ID (slug)',
      type: 'string',
      description: 'Стабільний ключ, напр. ram-32, ssd-1tb, warranty-2y',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'label',
      title: 'Назва варіанту',
      type: 'string',
      description: 'Напр. «32 GB DDR5», «1 TB NVMe»',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'string',
    }),
    defineField({
      name: 'priceDelta',
      title: 'Доплата (₴)',
      type: 'number',
      description: '0 — включено в базову ціну. Додатна сума — доплата.',
      initialValue: 0,
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'isDefault',
      title: 'Обрано за замовчуванням',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {label: 'label', priceDelta: 'priceDelta', isDefault: 'isDefault'},
    prepare({label, priceDelta, isDefault}: Record<string, any>) {
      return {
        title: label,
        subtitle:
          priceDelta === 0
            ? isDefault
              ? 'включено (за замовч.)'
              : 'включено'
            : `+${priceDelta.toLocaleString('uk')} ₴`,
      }
    },
  },
}

export const build = defineType({
  name: 'build',
  title: 'Ігровий ПК',
  type: 'document',
  groups: [
    {name: 'main', title: 'Основне', default: true},
    {name: 'spec', title: 'Характеристики'},
    {name: 'options', title: 'Конфігуратор'},
    {name: 'components', title: 'Комплектуючі'},
    {name: 'media', title: 'Медіа'},
    {name: 'content', title: 'Контент'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ─── MAIN ──────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Назва збірки',
      type: 'string',
      description: 'Напр. VEGA, NEBULA, PULSAR',
      group: 'main',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 40},
      group: 'main',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU (артикул)',
      type: 'string',
      description: 'Унікальний артикул для CRM та інвентаризації. Напр. KPC-VEGA',
      group: 'main',
      validation: (R) =>
        R.required().regex(/^[A-Z0-9-]+$/, {
          name: 'sku',
          invert: false,
        }),
    }),
    defineField({
      name: 'tier',
      title: 'Рівень',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'Starter', value: 'starter'},
          {title: 'Base', value: 'base'},
          {title: 'Prime', value: 'prime'},
          {title: 'Phantom', value: 'phantom'},
          {title: 'Pulsar', value: 'pulsar'},
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'В наявності', value: 'in_stock'},
          {title: 'Збирається під замовлення', value: 'assemble_on_order'},
          {title: 'Немає в наявності', value: 'out_of_stock'},
          {title: 'Архів', value: 'archived'},
        ],
      },
      initialValue: 'assemble_on_order',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'showInHomeTop3',
      title: 'Показувати на головній в топ-3',
      type: 'boolean',
      group: 'main',
      initialValue: false,
      description: 'Якщо увімкнено — збірка потрапляє в блок топ-3 на головній сторінці сайту.',
    }),
    defineField({
      name: 'shortTagline',
      title: 'Короткий слоган',
      type: 'string',
      description: 'Напр. «Оптимально для Full HD геймінгу»',
      group: 'main',
      validation: (R) => R.required().max(80),
    }),
    defineField({
      name: 'priceUah',
      title: 'Базова ціна (₴)',
      type: 'number',
      description: 'Ціна без доплат за конфігуратор (RAM, SSD, гарантія).',
      group: 'main',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'oldPriceUah',
      title: 'Стара ціна (₴)',
      type: 'number',
      description: 'Якщо є — показується закресленою.',
      group: 'main',
    }),
    defineField({
      name: 'assemblyDays',
      title: 'Термін збірки (днів)',
      type: 'number',
      group: 'main',
      initialValue: 3,
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'colorVariant',
      title: 'Колір корпусу',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'Чорний', value: 'black'},
          {title: 'Білий', value: 'white'},
        ],
      },
    }),

    // ─── SPEC ──────────────────────────────────────────────
    defineField({
      name: 'targetResolution',
      title: 'Цільова роздільна здатність',
      type: 'string',
      group: 'spec',
      options: {
        list: [
          {title: 'Full HD (1080p)', value: 'fullhd'},
          {title: '2K (1440p)', value: '2k'},
          {title: '4K (2160p)', value: '4k'},
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'cpu',
      title: 'Процесор',
      type: 'string',
      description: 'Напр. Ryzen 5 7400F',
      group: 'spec',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'gpu',
      title: 'Відеокарта',
      type: 'reference',
      to: [{type: 'gpu'}],
      group: 'spec',
      description: 'Обрати зі списку. FPS показники беруться з картки відеокарти.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'fpsCoefficient',
      title: 'Коефіцієнт FPS',
      type: 'number',
      group: 'spec',
      description:
        'Множник для FPS відеокарти. 1.0 = без змін. 0.9 = -10% (слабший CPU). 1.05 = +5% (OC).',
      initialValue: 1.0,
      validation: (R) => R.required().min(0.1).max(2.0),
    }),
    defineField({
      name: 'baseRam',
      title: "Оперативна пам'ять (базова)",
      type: 'string',
      description: 'Базова конфігурація, включена в ціну. Напр. «32 GB DDR5»',
      group: 'spec',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'ramSpeed',
      title: 'Швидкість RAM (МГц)',
      type: 'string',
      description: 'Напр. 6000',
      group: 'spec',
    }),
    defineField({
      name: 'baseStorage',
      title: 'Накопичувач (базовий)',
      type: 'string',
      description: 'Базова конфігурація, включена в ціну. Напр. «500 GB NVMe»',
      group: 'spec',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'powerConsumptionW',
      title: 'Споживання енергії (Вт)',
      type: 'number',
      group: 'spec',
    }),
    defineField({
      name: 'noiseLevelDb',
      title: 'Рівень шуму (дБ)',
      type: 'number',
      group: 'spec',
    }),
    defineField({
      name: 'upgradePathNotes',
      title: 'Нотатки про апгрейд',
      type: 'text',
      rows: 2,
      group: 'spec',
    }),

    // ─── CONFIGURABLE OPTIONS ──────────────────────────────
    defineField({
      name: 'ramOptions',
      title: "Варіанти оперативної пам'яті",
      type: 'array',
      group: 'options',
      description: 'Напр. 32 GB (базова) → 64 GB (+3 000 ₴). Один варіант має isDefault = true.',
      of: [configOption],
    }),
    defineField({
      name: 'ssdOptions',
      title: 'Варіанти накопичувача SSD',
      type: 'array',
      group: 'options',
      description: 'Напр. 500 GB (базова) → 1 TB (+1 800 ₴) → 2 TB (+4 500 ₴) → 4 TB (+9 500 ₴).',
      of: [configOption],
    }),
    defineField({
      name: 'warrantyOptions',
      title: 'Варіанти гарантії',
      type: 'array',
      group: 'options',
      description: 'Напр. 1 рік (базова) → 2 роки (+3 500 ₴) → 3 роки (+6 500 ₴).',
      of: [configOption],
    }),

    // ─── COMPONENTS ────────────────────────────────────────
    defineField({
      name: 'components',
      title: 'Комплектуючі',
      type: 'array',
      group: 'components',
      of: [
        {
          type: 'object',
          title: 'Компонент',
          fields: [
            defineField({
              name: 'category',
              title: 'Категорія',
              type: 'string',
              options: {
                list: [
                  {title: 'Процесор', value: 'cpu'},
                  {title: 'Відеокарта', value: 'gpu'},
                  {title: "Оперативна пам'ять", value: 'ram'},
                  {title: 'SSD', value: 'ssd'},
                  {title: 'HDD', value: 'hdd'},
                  {title: 'Материнська плата', value: 'motherboard'},
                  {title: 'Блок живлення', value: 'psu'},
                  {title: 'Корпус', value: 'case'},
                  {title: 'Охолодження', value: 'cooling'},
                  {title: 'ОС', value: 'os'},
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'brand',
              title: 'Бренд',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'model',
              title: 'Модель',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'displayName',
              title: 'Повна назва (для UI)',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'humanDescription',
              title: 'Пояснення для покупця',
              type: 'text',
              rows: 2,
              description: 'Простою мовою: що цей компонент робить і чому він тут.',
            }),
            defineField({
              name: 'warrantyMonths',
              title: 'Гарантія виробника (місяців)',
              type: 'number',
              validation: (R) => R.required().min(0),
            }),
          ],
          preview: {
            select: {category: 'category', brand: 'brand', model: 'model'},
            prepare({category, brand, model}: Record<string, any>) {
              return {title: `${brand} ${model}`, subtitle: category}
            },
          },
        },
      ],
    }),

    // ─── MEDIA ─────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Головне фото',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Галерея',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'assemblyVideoUrl',
      title: 'Відео збірки (URL)',
      type: 'url',
      group: 'media',
      description: 'MP4 або YouTube посилання.',
    }),
    defineField({
      name: 'assemblyVideoPoster',
      title: 'Постер відео збірки',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'assemblyVideoUploadDate',
      title: 'Дата публікації відео збірки',
      type: 'datetime',
      group: 'media',
      description:
        'ISO-дата для VideoObject (напр. 2026-06-01T00:00:00+03:00). Без дати та постера відео не потрапить у розмітку.',
    }),
    defineField({
      name: 'gameplayVideoUrl',
      title: 'Відео: реальний геймплей (URL)',
      type: 'url',
      group: 'media',
      description:
        'Секція «Реальний геймплей / РЕАЛЬНІ ТЕСТИ НАШИХ ПК» на сторінці збірки. MP4 або YouTube посилання.',
    }),
    defineField({
      name: 'gameplayVideoPoster',
      title: 'Постер: реальний геймплей',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      description: 'Превʼю для відео в секції реальних тестів.',
    }),
    defineField({
      name: 'gameplayVideoUploadDate',
      title: 'Дата публікації геймплей-відео',
      type: 'datetime',
      group: 'media',
      description:
        'ISO-дата для VideoObject (напр. 2026-06-01T00:00:00+03:00). Без дати та постера відео не потрапить у розмітку.',
    }),

    // ─── CONTENT ───────────────────────────────────────────
    defineField({
      name: 'includedBenefits',
      title: 'Включені переваги',
      type: 'array',
      group: 'content',
      of: [{type: 'reference', to: [{type: 'buildBenefit'}]}],
      description:
        'Оберіть переваги з довідника (розділ «✨ Переваги»). Заголовок і опис картки — у документі переваги.',
    }),
    defineField({
      name: 'customFaq',
      title: 'FAQ для цієї збірки',
      type: 'array',
      group: 'content',
      description: 'Введіть питання та відповіді вручну — кожна збірка формує власний FAQ.',
      of: [{type: 'faqQuestion'}],
    }),
    defineField({
      name: 'reviews',
      title: 'Відгуки клієнтів',
      type: 'array',
      group: 'content',
      description:
        'Відгуки саме про цю збірку (картка на сайті та блок на сторінці ПК). Фото необовʼязкове — тоді підставиться стандартне зображення.',
      of: [
        {
          type: 'object',
          title: 'Відгук',
          fields: [
            defineField({
              name: 'authorName',
              title: "Ім'я автора",
              type: 'string',
              description: 'Напр. «Олександр К.»',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'authorPhoto',
              title: 'Фото / скрін для картки',
              type: 'image',
              options: {hotspot: true},
              description: 'Показується у великій картці відгуку на головній та на сторінці ПК.',
            }),
            defineField({
              name: 'rating',
              title: 'Оцінка (зірки)',
              type: 'number',
              initialValue: 5,
              validation: (R) => R.required().integer().min(1).max(5),
            }),
            defineField({
              name: 'text',
              title: 'Текст відгуку',
              type: 'text',
              rows: 4,
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'sourcePlatform',
              title: 'Джерело',
              type: 'string',
              initialValue: 'google',
              options: {
                list: [
                  {title: 'Google Maps', value: 'google'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Telegram', value: 'telegram'},
                  {title: 'Прямий відгук', value: 'direct'},
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'externalUrl',
              title: 'Посилання на оригінал',
              type: 'url',
              description: 'Необовʼязково — на пост чи відгук у Google / Instagram.',
            }),
            defineField({
              name: 'isVerified',
              title: 'Позначка «перевірений відгук»',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {authorName: 'authorName', rating: 'rating', media: 'authorPhoto'},
            prepare({
              authorName,
              rating,
              media,
            }: {
              authorName?: string
              rating?: number
              media?: unknown
            }) {
              return {
                title: authorName ?? 'Без імені',
                subtitle: rating ? `${rating}★` : undefined,
                media: media as any,
              }
            },
          },
        },
      ],
    }),

    // ─── SEO ───────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO блок',
      type: 'seoSettings',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      name: 'name',
      sku: 'sku',
      tier: 'tier',
      status: 'status',
      price: 'priceUah',
      showInHomeTop3: 'showInHomeTop3',
      media: 'heroImage',
    },
    prepare({name, sku, tier, status, price, showInHomeTop3, media}: Record<string, any>) {
      const statusLabels: Record<string, string> = {
        in_stock: '✅ В наявності',
        assemble_on_order: '🔧 Під замовлення',
        out_of_stock: '❌ Немає',
        archived: '📦 Архів',
      }
      const top3 = showInHomeTop3 ? ' · 🏠 Топ-3' : ''
      const skuLabel = sku ? `${sku} · ` : ''
      return {
        title: name,
        subtitle: `${skuLabel}${tier?.toUpperCase()} · ${price?.toLocaleString('uk')} ₴ · ${statusLabels[status] ?? status}${top3}`,
        media,
      }
    },
  },
})
