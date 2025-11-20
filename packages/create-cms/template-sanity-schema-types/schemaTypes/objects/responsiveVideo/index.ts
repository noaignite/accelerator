import { defineField, defineType } from 'sanity'
import { breakpoints } from '../../../utils'
import { UnstyledField } from '../../components'
import ResponsiveVideo from './ResponsiveVideo'

export default defineType({
  title: 'Responsive Video',
  name: 'responsiveVideo',
  type: 'object',
  components: {
    input: ResponsiveVideo,
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
        type: 'file',
      }),
    ),
  ],
})
