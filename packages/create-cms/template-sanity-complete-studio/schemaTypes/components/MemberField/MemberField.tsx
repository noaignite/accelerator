import { FieldMember, ObjectInputProps, MemberField as SanityMemberField } from 'sanity'

interface MemberFieldProps extends ObjectInputProps<unknown> {
  name: string
}

function MemberField(props: MemberFieldProps) {
  const { name, members, ...other } = props

  const member = members?.find((m): m is FieldMember => m.kind === 'field' && m.name === name)

  if (!member) {
    return null
  }

  return <SanityMemberField member={member} {...other} />
}

export default MemberField
