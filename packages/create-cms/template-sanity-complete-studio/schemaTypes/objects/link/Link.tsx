import { Autocomplete } from '@sanity/ui'
import * as React from 'react'
import { ObjectInputProps, ObjectSchemaType, set, useFormValue } from 'sanity'
import { defaultLocale, getSanityClient } from '../../../utils'

export interface LinkProps {
  url?: string
  reference?: {
    _ref: string
  }
}

interface ReferenceObjectSchemaType extends ObjectSchemaType {
  to: { name: string }[]
}

function Link(props: ObjectInputProps<LinkProps>) {
  const { id, level, schemaType, value, onChange } = props

  const documentId = useFormValue(['_id'])

  const [options, setOptions] = React.useState<LinkProps[]>([])
  const query = React.useRef(value?.url || '')

  const referenceFieldTypes = React.useMemo(() => {
    const referenceField = schemaType?.fields?.find((f) => f.name === 'reference')
    return (referenceField?.type as ReferenceObjectSchemaType)?.to?.map((t) => t.name) || []
  }, [schemaType])

  const updateValue = React.useCallback(
    (slug: string) => {
      const nextValue = options.find((o) => o.url === slug)
      onChange(set(nextValue || { url: slug, reference: null }))
    },
    [options, onChange],
  )

  const handleQueryChange = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    query.current = (event as unknown as React.ChangeEvent<HTMLInputElement>).target.value || ''
  }, [])

  const handleBlur = React.useCallback(() => {
    updateValue(query.current)
  }, [updateValue])

  const handleSelect = React.useCallback(
    (slug: string) => {
      query.current = slug
      updateValue(slug)
    },
    [updateValue],
  )

  React.useEffect(() => {
    if (options?.length) {
      return
    }

    const q = `*[ _lang == $lang && _type in $documents ] { 'url': slug.current, 'reference': { '_ref': _id  } } | order(slug.current asc)`
    const sanityClient = getSanityClient()

    sanityClient
      .fetch(q, { lang: defaultLocale.lang, documents: referenceFieldTypes })
      .then((result: LinkProps[]) => {
        setOptions(result?.filter((option) => option.url))
      })
  }, [options?.length, referenceFieldTypes])

  const autocompleteOptions = React.useMemo(
    () => options?.map((o) => ({ value: o.url || '' })) || [],
    [options],
  )

  // TODO: Better way to sync value if reference slug changes
  // React.useEffect(() => {
  //   const refId = value?.reference?._ref

  //   if (refId) {
  //     const sanityClient = getSanityClient()
  //     const q = `*[ _id == $refId ][0] { 'slug': slug.current }['slug']`

  //     sanityClient.fetch(q, { refId }).then((slug) => {
  //       if (value?.value !== slug) {
  //         query.current = slug
  //       }
  //     })
  //   }
  // }, [value?.reference, value?.value, onChange])

  return (
    <Autocomplete
      id={`${documentId}-${id}-${level}`}
      value={value?.url || ''}
      onKeyUp={handleQueryChange}
      onSelect={handleSelect}
      onBlur={handleBlur}
      options={autocompleteOptions}
    />
  )
}

export default Link
