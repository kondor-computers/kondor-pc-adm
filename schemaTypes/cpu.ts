import {defineField, defineType} from 'sanity'
import {catalogSkuField} from './lib/catalogSku'

export const cpu = defineType({
  name: 'cpu',
  title: 'Процесор',
  type: 'document',
  fields: [
    defineField({
      name: 'brand',
      title: 'Бренд',
      type: 'string',
      options: {
        list: [
          {title: 'AMD', value: 'AMD'},
          {title: 'Intel', value: 'Intel'},
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'model',
      title: 'Модель',
      type: 'string',
      description: 'Напр. Ryzen 7 7700, Core i5-14600KF',
      validation: (R) => R.required(),
    }),
    catalogSkuField({
      source: (doc) => [doc.brand, doc.model].filter(Boolean).join(' '),
      description: 'Напр. AMD-RYZEN-7-7700. Generate — з бренду та моделі.',
    }),
    defineField({
      name: 'priceUah',
      title: 'Доплата в конфігураторі (₴)',
      type: 'number',
      description:
        'Доплата при виборі цього процесора. 0 — базовий рівень. ' +
        'На збірці ціна не дублюється — оновлюється тільки тут.',
      initialValue: 0,
      validation: (R) => R.required().min(0),
    }),
  ],
  preview: {
    select: {brand: 'brand', model: 'model', sku: 'sku.current', priceUah: 'priceUah'},
    prepare({brand, model, sku, priceUah}) {
      const price =
        priceUah === 0 ? 'включено' : `+${priceUah?.toLocaleString('uk')} ₴`
      return {
        title: brand && model ? `${brand} ${model}` : 'Без назви',
        subtitle: sku ? `${sku} · ${price}` : price,
      }
    },
  },
})
