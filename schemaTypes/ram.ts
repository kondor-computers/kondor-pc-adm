import {defineField, defineType} from 'sanity'
import {catalogSkuField} from './lib/catalogSku'

export const ram = defineType({
  name: 'ram',
  title: "Оперативна пам'ять",
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва',
      type: 'string',
      description: 'Повна назва для UI. Напр. «32 GB (2×16 GB) DDR5 6000 MHz»',
      validation: (R) => R.required().min(3).max(120),
    }),
    catalogSkuField({
      source: 'title',
      description: 'Напр. 32GB-DDR5-6000. Generate — з назви.',
    }),
    defineField({
      name: 'capacityGb',
      title: "Об'єм (GB)",
      type: 'number',
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'memoryType',
      title: 'Тип',
      type: 'string',
      options: {
        list: [
          {title: 'DDR4', value: 'ddr4'},
          {title: 'DDR5', value: 'ddr5'},
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'speedMhz',
      title: 'Швидкість (МГц)',
      type: 'number',
      description: 'Напр. 6000',
    }),
    defineField({
      name: 'kitLayout',
      title: 'Комплектація',
      type: 'string',
      description: 'Напр. 2×16 GB, 1×16 GB',
    }),
    defineField({
      name: 'priceUah',
      title: 'Доплата в конфігураторі (₴)',
      type: 'number',
      description:
        'Доплата при виборі цього комплекту RAM. 0 — базовий рівень. ' +
        'На збірці ціна не дублюється — оновлюється тільки тут.',
      initialValue: 0,
      validation: (R) => R.required().min(0),
    }),
  ],
  preview: {
    select: {title: 'title', sku: 'sku.current', memoryType: 'memoryType', priceUah: 'priceUah'},
    prepare({title, sku, memoryType, priceUah}) {
      const price =
        priceUah === 0 ? 'включено' : `+${priceUah?.toLocaleString('uk')} ₴`
      const type = memoryType ? String(memoryType).toUpperCase() : ''
      const meta = [sku, type].filter(Boolean).join(' · ')
      return {
        title: title ?? 'Без назви',
        subtitle: meta ? `${meta} · ${price}` : price,
      }
    },
  },
})
