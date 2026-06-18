import {defineField, defineType} from 'sanity'

/**
 * Media video — embed YouTube/Vimeo з опціональним poster для preload.
 */
export const mediaVideo = defineType({
  name: 'mediaVideo',
  title: 'Відео',
  type: 'object',
  fields: [
    defineField({
      name: 'videoUrl',
      type: 'url',
      description: 'YouTube або Vimeo URL',
      validation: (r) => r.required(),
    }),
    defineField({name: 'posterImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'caption', type: 'string'}),
    defineField({name: 'anchor', type: 'string'}),
  ],
  preview: {
    select: {title: 'caption', url: 'videoUrl', media: 'posterImage'},
    prepare: ({title, url, media}) => ({
      title: title || 'Video',
      subtitle: url,
      media,
    }),
  },
})
