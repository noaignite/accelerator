import { FieldProps } from 'sanity'

// This components exists solely to override Sanity's default indentation

function UnstyledField(props: FieldProps) {
  const { renderDefault } = props
  return <div style={{ paddingLeft: 0, borderLeft: 0 }}>{renderDefault(props)}</div>
}

export default UnstyledField
