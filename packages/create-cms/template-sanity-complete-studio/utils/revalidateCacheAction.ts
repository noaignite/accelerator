import { DocumentsIcon } from '@sanity/icons'
import { DocumentActionProps } from 'sanity'

function revalidateCacheAction(props: DocumentActionProps) {
  const slugField = props.published?.slug as Record<string, unknown>
  const slug = slugField?.current as string

  const searchParams = new URLSearchParams({
    secret: process.env.SANITY_STUDIO_NEXT_SECRET as string,
    slug,
  })

  return {
    label: 'Revalidate cache',
    icon: DocumentsIcon,
    onHandle: () => {
      fetch(`/api/revalidate?${searchParams}`)
    },
  }
}

export default revalidateCacheAction
