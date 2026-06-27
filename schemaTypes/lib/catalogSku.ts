import {defineField} from 'sanity'

export function catalogSkuSlugify(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

type CatalogSkuSource = string | ((doc: Record<string, unknown>) => string | undefined)

export function catalogSkuField(options: {
  source: CatalogSkuSource
  description?: string
}) {
  return defineField({
    name: 'sku',
    title: 'SKU (артикул)',
    type: 'slug',
    description:
      options.description ??
      'Унікальний артикул для CRM та інвентаризації. Натисніть Generate, щоб згенерувати з назви.',
    options: {
      source: options.source,
      maxLength: 48,
      slugify: catalogSkuSlugify,
    },
    validation: (rule) =>
      rule.required().custom((slug) => {
        const value =
          slug && typeof slug === 'object' && 'current' in slug
            ? (slug as {current?: string}).current
            : typeof slug === 'string'
              ? slug
              : undefined
        if (!value) return 'Обовʼязкове поле'
        if (!/^[A-Z0-9-]+$/.test(value)) {
          return 'Тільки великі латинські літери, цифри та дефіс (наприклад: KPC-RTX-5070).'
        }
        return true
      }),
  })
}
