import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'kondor-pc-admin',

  projectId: 'if6dzz62',
  dataset: 'production',

  plugins: [table(), structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
