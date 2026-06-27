import {defineField, defineType} from 'sanity'

const imageAltField = defineField({
  name: 'alt',
  title: 'Альтернативний текст',
  type: 'string',
  description: 'Важливо для SEO та доступності',
})

const configOption = {
  type: 'object',
  title: 'Варіант',
  fields: [
    defineField({
      name: 'id',
      title: 'ID (slug)',
      type: 'string',
      description: 'Стабільний ключ, напр. ssd-1tb, warranty-2y',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'label',
      title: 'Назва варіанту',
      type: 'string',
      description: 'Напр. «1 TB NVMe», «2 роки гарантії»',
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

const catalogConfigPreview = (
  title: string | undefined,
  priceUah: number | undefined,
  isDefault: boolean | undefined,
  subtitleExtra?: string,
) => {
  const price = isDefault
    ? 'включено (за замовч.)'
    : priceUah === 0
      ? 'включено'
      : `+${priceUah?.toLocaleString('uk')} ₴`
  return {
    title: title ?? 'Без назви',
    subtitle: subtitleExtra ? `${subtitleExtra} · ${price}` : price,
  }
}

const cpuConfigOption = {
  type: 'object',
  title: 'Варіант CPU',
  fields: [
    defineField({
      name: 'cpu',
      title: 'Процесор',
      type: 'reference',
      to: [{type: 'cpu'}],
      description: 'Назва та доплата беруться з картки процесора.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'id',
      title: 'ID (slug)',
      type: 'string',
      description: 'Стабільний ключ, напр. ryzen-7-7700',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'string',
    }),
    defineField({
      name: 'isDefault',
      title: 'Обрано за замовчуванням',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      isDefault: 'isDefault',
      brand: 'cpu.brand',
      model: 'cpu.model',
      priceUah: 'cpu.priceUah',
    },
    prepare({brand, model, priceUah, isDefault}: Record<string, any>) {
      const title = brand && model ? `${brand} ${model}` : undefined
      return catalogConfigPreview(title, priceUah, isDefault)
    },
  },
}

const ramConfigOption = {
  type: 'object',
  title: 'Варіант RAM',
  fields: [
    defineField({
      name: 'ram',
      title: "Оперативна пам'ять",
      type: 'reference',
      to: [{type: 'ram'}],
      description: 'Назва та доплата беруться з картки RAM.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'id',
      title: 'ID (slug)',
      type: 'string',
      description: 'Стабільний ключ, напр. ram-32-ddr5',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'string',
    }),
    defineField({
      name: 'isDefault',
      title: 'Обрано за замовчуванням',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      isDefault: 'isDefault',
      title: 'ram.title',
      memoryType: 'ram.memoryType',
      priceUah: 'ram.priceUah',
    },
    prepare({title, memoryType, priceUah, isDefault}: Record<string, any>) {
      const type = memoryType ? String(memoryType).toUpperCase() : undefined
      return catalogConfigPreview(title, priceUah, isDefault, type)
    },
  },
}

const gpuConfigOption = {
  type: 'object',
  title: 'Варіант GPU',
  fields: [
    defineField({
      name: 'gpu',
      title: 'Відеокарта',
      type: 'reference',
      to: [{type: 'gpu'}],
      description: 'Назва, FPS та доплата беруться з картки відеокарти.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'id',
      title: 'ID (slug)',
      type: 'string',
      description: 'Стабільний ключ, напр. rtx-5070, rtx-5080',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'string',
    }),
    defineField({
      name: 'isDefault',
      title: 'Обрано за замовчуванням',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'fpsCoefficient',
      title: 'Коефіцієнт FPS',
      type: 'number',
      description:
        'Множник для FPS відеокарти. 1.0 = без змін. 0.9 = -10% (слабший CPU). 1.05 = +5% (OC).',
      initialValue: 1.0,
      validation: (R) => R.required().min(0.1).max(2.0),
    }),
  ],
  preview: {
    select: {
      isDefault: 'isDefault',
      brand: 'gpu.brand',
      model: 'gpu.model',
      vram: 'gpu.vram',
      priceUah: 'gpu.priceUah',
    },
    prepare({brand, model, vram, priceUah, isDefault}: Record<string, any>) {
      const price = isDefault
        ? 'включено (за замовч.)'
        : priceUah === 0
          ? 'включено'
          : `+${priceUah?.toLocaleString('uk')} ₴`
      const title = brand && model ? `${brand} ${model}` : 'Без назви'
      return {
        title,
        subtitle: vram ? `${vram} · ${price}` : price,
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
      description: 'Ціна без доплат за конфігуратор (CPU, GPU, RAM, SSD, гарантія).',
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
      name: 'cpuOptions',
      title: 'Варіанти процесора',
      type: 'array',
      group: 'options',
      description:
        'Оберіть процесори з довідника. Доплата — у картці CPU. Один варіант має isDefault = true.',
      of: [cpuConfigOption],
    }),
    defineField({
      name: 'gpuOptions',
      title: 'Варіанти відеокарти',
      type: 'array',
      group: 'options',
      description:
        'Оберіть відеокарти з довідника. Доплата — у картці GPU. Один варіант має isDefault = true.',
      of: [gpuConfigOption],
    }),
    defineField({
      name: 'ramOptions',
      title: "Варіанти оперативної пам'яті",
      type: 'array',
      group: 'options',
      description:
        'Оберіть комплекти RAM з довідника. Доплата — у картці RAM. Один варіант має isDefault = true.',
      of: [ramConfigOption],
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
    defineField({
      name: 'availableAddons',
      title: 'Додаткові опції',
      type: 'array',
      group: 'options',
      description:
        'Оберіть опції з довідника «➕ Додаткові опції». ' +
        'Ціна та опис — у картці опції; тут можна перевизначити ціну або позначити як включену.',
      of: [
        {
          type: 'object',
          title: 'Опція на збірці',
          fields: [
            defineField({
              name: 'addon',
              title: 'Опція',
              type: 'reference',
              to: [{type: 'buildAddon'}],
              options: {
                filter: 'isActive != false',
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'priceOverride',
              title: 'Ціна для цієї збірки (₴)',
              type: 'number',
              description:
                'Якщо порожньо — береться базова ціна з довідника. 0 — без доплати.',
              validation: (R) => R.min(0),
            }),
            defineField({
              name: 'isIncluded',
              title: 'Включено в базову комплектацію',
              type: 'boolean',
              description: 'Опція вже є в збірці — доплата 0 ₴, показується як включена.',
              initialValue: false,
            }),
            defineField({
              name: 'sortOrder',
              title: 'Порядок на цій збірці',
              type: 'number',
              description: 'Менше = вище. Якщо порожньо — порядок з довідника.',
            }),
          ],
          preview: {
            select: {
              title: 'addon.title',
              sku: 'addon.sku.current',
              priceUah: 'addon.priceUah',
              priceOverride: 'priceOverride',
              isIncluded: 'isIncluded',
            },
            prepare({
              title,
              sku,
              priceUah,
              priceOverride,
              isIncluded,
            }: Record<string, any>) {
              const price = isIncluded
                ? 'включено'
                : priceOverride != null
                  ? priceOverride === 0
                    ? 'безкоштовно'
                    : `+${priceOverride.toLocaleString('uk')} ₴`
                  : priceUah === 0
                    ? 'безкоштовно'
                    : `+${priceUah?.toLocaleString('uk')} ₴`
              return {
                title: title ?? 'Без назви',
                subtitle: sku ? `${sku} · ${price}` : price,
              }
            },
          },
        },
      ],
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
      fields: [imageAltField],
    }),
    defineField({
      name: 'gallery',
      title: 'Галерея',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}, fields: [imageAltField]}],
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
      fields: [imageAltField],
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
      fields: [imageAltField],
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
              fields: [imageAltField],
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
