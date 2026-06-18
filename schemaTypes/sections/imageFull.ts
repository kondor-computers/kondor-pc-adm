import {defineField, defineType} from 'sanity'

/**
 * Image full — широке зображення на повну ширину контейнера.
 * З опціональним caption і вибором aspect ratio.
 */
export const imageFull = defineType({
  name: 'imageFull',
  title: 'Зображення на ширину',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', validation: (r) => r.required()}),
      ],
      validation: (r) => r.required(),
    }),
    defineField({name: 'caption', type: 'string'}),
    defineField({
      name: 'aspectRatio',
      type: 'string',
      options: {list: ['16/9', '21/9', '4/3', '1/1']},
      initialValue: '16/9',
    }),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {media: 'image', caption: 'caption', ratio: 'aspectRatio'},
    prepare: ({media, caption, ratio}) => ({
      title: caption || `Image ${ratio}`,
      subtitle: 'Image · ' + ratio,
      media,
    }),
  },
})
