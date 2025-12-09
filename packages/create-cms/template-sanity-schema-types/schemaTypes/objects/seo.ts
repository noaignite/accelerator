import { defineField, defineType } from 'sanity'
import { UnstyledField } from '../components'

export default defineType({
  title: 'SEO',
  name: 'seo',
  type: 'object',
  components: {
    field: UnstyledField,
  },
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'string',
      validation: (Rule) => Rule.max(155),
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      title: 'Indexable',
      name: 'isIndexable',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'FAQ entries',
      description: 'Displayed in search results',
      name: 'faqEntries',
      type: 'array',
      of: [
        defineField({
          title: 'Entry',
          name: 'entry',
          type: 'object',
          fields: [
            defineField({
              title: 'Question',
              name: 'question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              title: 'Answer',
              name: 'answer',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})
