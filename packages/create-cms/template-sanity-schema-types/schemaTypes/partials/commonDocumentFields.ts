import { defineField } from 'sanity'
// import { getSanityClient } from '~/sanity/utils'
import { defaultLocale } from '../../utils'

const commonDocumentFields = [
  defineField({
    title: 'Title',
    name: 'title',
    type: 'string',
    description: 'Document name displayed in the studio',
    group: 'content',
  }),
  defineField({
    title: 'Slug',
    name: 'slug',
    type: 'slug',
    group: 'content',
    hidden: ({ parent }) => parent?._lang && parent._lang !== defaultLocale.lang,
    validation: (Rule) => Rule.required(),
    options: {
      source: 'title',
      isUnique: () => true,
    },
    // options: {
    //   source: 'title',
    //   isUnique: async (slug, ctx) => {
    //     if (ctx.document?._lang === defaultLocale.lang) {
    //       const query = `*[slug.current == $slug && !(_id match $documentId + '*')][0]`
    //       const client = getSanityClient({ useCdn: false })

    //       const documentId = ctx.document?._id?.replace(/^drafts./, '')
    //       const result = await client.fetch(query, { slug, documentId })

    //       return !result
    //     }

    //     return true
    //   },
    // },
  }),
  defineField({
    title: 'Highlight',
    name: 'highlight',
    type: 'highlight',
    group: 'highlight',
  }),
  defineField({
    title: 'SEO',
    name: 'seo',
    type: 'seo',
    group: 'seo',
  }),
]

export default commonDocumentFields
