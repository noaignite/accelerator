import { defineType } from 'sanity'
import { UnstyledField } from '../../components'
import Link from './Link'

export default defineType({
  title: 'Link',
  name: 'link',
  type: 'object',
  components: {
    input: Link,
    field: UnstyledField,
  },
  fields: [
    { title: 'URL', name: 'url', type: 'string' },
    {
      title: 'Reference',
      name: 'reference',
      type: 'reference',
      to: [{ type: 'page' }],
    },
  ],
})
