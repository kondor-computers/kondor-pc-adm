import {defineField, defineType} from 'sanity'

function nonEmptyString(value: unknown): true | string {
  return typeof value === 'string' && value.trim().length > 0 ? true : 'Обовʼязкове поле'
}

export const paymentRequisites = defineType({
  name: 'paymentRequisites',
  title: 'Реквізити для оплати',
  type: 'document',
  fields: [
    defineField({
      name: 'seller',
      title: 'Продавець',
      type: 'string',
      validation: (R) => R.required().custom(nonEmptyString).min(2),
    }),
    defineField({
      name: 'edrpouOrRnokpp',
      title: 'ЄДРПОУ / РНОКПП',
      type: 'string',
      description: 'Код ЄДРПОУ для юрособи (8 цифр) або РНОКПП для ФОП (10 цифр).',
      validation: (R) =>
        R.required()
          .custom(nonEmptyString)
          .regex(/^\d{8,10}$/)
          .error('ЄДРПОУ / РНОКПП: лише цифри, 8 або 10 символів.'),
    }),
    defineField({
      name: 'iban',
      title: 'IBAN',
      type: 'string',
      description: 'Напр. UA123456789012345678901234567',
      validation: (R) =>
        R.required()
          .custom(nonEmptyString)
          .regex(/^UA\d{27}$/i)
          .error('IBAN має бути у форматі UA + 27 цифр (29 символів загалом).'),
    }),
  ],
  preview: {
    select: {seller: 'seller', iban: 'iban'},
    prepare({seller, iban}) {
      return {
        title: seller || 'Реквізити для оплати',
        subtitle: iban,
      }
    },
  },
})
