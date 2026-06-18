import {defineField, defineType} from 'sanity'

const promoDiscount = {
  type: 'object',
  title: 'Знижка',
  fields: [
    defineField({
      name: 'kind',
      title: 'Тип',
      type: 'string',
      options: {
        list: [
          {title: 'Відсоток (%)', value: 'percent'},
          {title: 'Сума (₴)', value: 'fixed'},
        ],
        layout: 'radio',
      },
      initialValue: 'percent',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'value',
      title: 'Значення',
      type: 'number',
      validation: (r) => r.required().min(0.01),
    }),
  ],
  preview: {
    select: {kind: 'kind', value: 'value'},
    prepare({kind, value}: {kind?: string; value?: number}) {
      if (value == null) return {title: 'Знижка'}
      return {
        title: kind === 'fixed' ? `${value.toLocaleString('uk')} ₴` : `${value}%`,
      }
    },
  },
}

function formatDiscount(discount?: {kind?: string; value?: number}) {
  if (discount?.value == null) return null
  return discount.kind === 'fixed'
    ? `${discount.value.toLocaleString('uk')} ₴`
    : `${discount.value}%`
}

/**
 * Промокод — окремий документ з кодом, строком дії та знижками.
 *
 * Використовується через reference у блоці ctaPromoBanner на лендингах,
 * щоб один код можна було показувати на кількох сторінках без копіпасти.
 */
export const promoCode = defineType({
  name: 'promoCode',
  title: 'Промокод',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Код',
      type: 'string',
      description: 'Текст промокоду, який копіює користувач (напр. BLACKFRIDAY26).',
      validation: (r) => r.required().uppercase(),
    }),
    defineField({
      name: 'discountPc',
      title: 'Знижка на ПК',
      type: 'object',
      fields: promoDiscount.fields,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'discountAccessories',
      title: 'Знижка на аксесуари',
      type: 'object',
      fields: promoDiscount.fields,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'validFrom',
      title: 'Дійсний з',
      type: 'datetime',
      description: 'Необовʼязково. Якщо не вказано — код активний одразу після публікації.',
    }),
    defineField({
      name: 'validUntil',
      title: 'Дійсний до',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Внутрішні нотатки',
      type: 'text',
      rows: 2,
      description: 'Умови акції тощо — тільки для команди.',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((fields) => {
      const {validFrom, validUntil} = fields as {validFrom?: string; validUntil?: string}
      if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
        return '«Дійсний з» має бути раніше за «Дійсний до».'
      }
      return true
    }),
  preview: {
    select: {
      code: 'code',
      validUntil: 'validUntil',
      pcKind: 'discountPc.kind',
      pcValue: 'discountPc.value',
      accKind: 'discountAccessories.kind',
      accValue: 'discountAccessories.value',
    },
    prepare({code, validUntil, pcKind, pcValue, accKind, accValue}) {
      const until = validUntil
        ? new Date(validUntil).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'без терміну'
      const pc = formatDiscount({kind: pcKind, value: pcValue})
      const acc = formatDiscount({kind: accKind, value: accValue})
      const discounts = [pc && `ПК ${pc}`, acc && `акс. ${acc}`].filter(Boolean).join(' · ')
      return {
        title: code || 'Промокод',
        subtitle: [discounts, `до ${until}`].filter(Boolean).join(' · '),
      }
    },
  },
})
