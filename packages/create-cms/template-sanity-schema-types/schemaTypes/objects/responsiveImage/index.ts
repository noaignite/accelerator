import { defineField, defineType } from 'sanity'
import { breakpoints } from '../../../utils'
import { UnstyledField } from '../../components'
import ResponsiveImage from './ResponsiveImage'

export default defineType({
  title: 'Responsive Image',
  name: 'responsiveImage',
  type: 'object',
  components: {
    input: ResponsiveImage,
    field: UnstyledField,
  },
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      hidden: true,
      initialValue: 'Image',
    }),
    defineField({
      title: 'Automatic Responsivness',
      name: 'auto',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Alt text',
      name: 'alt',
      type: 'string',
    }),
    defineField({
      title: 'Breakpoint',
      name: 'breakpoint',
      type: 'string',
      initialValue: breakpoints[0],
      options: {
        list: breakpoints,
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    ...breakpoints.map((breakpoint) =>
      defineField({
        name: breakpoint,
        type: 'image',
        options: {
          hotspot: true,
        },
      }),
    ),
  ],
})
