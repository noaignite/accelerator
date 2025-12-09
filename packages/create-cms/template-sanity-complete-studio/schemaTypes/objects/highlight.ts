import { defineField, defineType } from 'sanity'
import { UnstyledField } from '../components'

export default defineType({
  title: 'Highlight',
  name: 'highlight',
  type: 'object',
  components: {
    field: UnstyledField,
  },
  fields: [
    defineField({
      title: 'Heading',
      name: 'heading',
      type: 'string',
    }),
    defineField({
      title: 'Text',
      name: 'text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      title: 'Media placement',
      name: 'mediaPlacement',
      type: 'string',
      initialValue: 'start',
      options: {
        list: ['start', 'end'],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      title: 'Media',
      name: 'responsiveMedia',
      type: 'responsiveMedia',
    }),
  ],
})
