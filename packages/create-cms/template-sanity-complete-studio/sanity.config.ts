import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import schemaTypes from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: '@noaignite/create-noaignite',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
