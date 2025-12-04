import { defineField, defineType } from 'sanity'
import { breakpoints } from '../../utils'
import { UnstyledField } from '../components'

export default defineType({
  title: 'Responsive External Video',
  name: 'responsiveExternalVideo',
  type: 'object',
  components: {
    field: UnstyledField,
  },
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      hidden: true,
      initialValue: 'Video',
    }),
    defineField({
      title: 'Autoplay',
      name: 'autoPlay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Controls',
      name: 'controls',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Breakpoint',
      name: 'breakpoint',
      description: 'Only mobile breakpoint is required',
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
        type: 'url',
        hidden: ({ parent }) => {
          return parent?.breakpoint !== breakpoint
        },
      }),
    ),
  ],
})
