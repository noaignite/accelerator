import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Hero',
  name: 'hero',
  type: 'object',
  fields: [
    defineField({
      title: 'Media',
      name: 'entries',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [{ type: 'responsiveMedia' }],
    }),
    defineField({
      title: 'CTAs',
      name: 'ctas',
      type: 'array',
      validation: (Rule) => Rule.required().min(0).max(2),
      of: [{ type: 'menuItem' }],
    }),
  ],
})
