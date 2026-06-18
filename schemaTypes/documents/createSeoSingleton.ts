import {defineType} from 'sanity'

export type SeoSingletonConfig = {
  name: string
  title: string
  subtitle: string
}

export function createSeoSingleton({name, title, subtitle}: SeoSingletonConfig) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      {
        name: 'seo',
        type: 'seoSettings',
        title: 'SEO блок',
      },
    ],
    preview: {
      prepare() {
        return {title, subtitle}
      },
    },
  })
}
