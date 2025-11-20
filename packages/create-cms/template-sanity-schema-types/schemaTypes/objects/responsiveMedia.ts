import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { UnstyledField } from '../components'

export default defineType({
  title: 'Responsive Media',
  name: 'responsiveMedia',
  type: 'object',
  preview: {
    prepare: () => ({ title: 'Responsive media', icon: ImageIcon }),
  },
  components: {
    field: UnstyledField,
  },
  fields: [
    defineField({
      title: 'Type',
      name: 'mediaType',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'External Video', value: 'externalVideo' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      title: 'Responsive Image',
      name: 'responsiveImage',
      type: 'responsiveImage',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      title: 'Responsive Video',
      name: 'responsiveVideo',
      type: 'responsiveVideo',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Responsive External Video',
      name: 'responsiveExternalVideo',
      type: 'responsiveExternalVideo',
      hidden: ({ parent }) => parent?.mediaType !== 'externalVideo',
    }),
  ],
})
