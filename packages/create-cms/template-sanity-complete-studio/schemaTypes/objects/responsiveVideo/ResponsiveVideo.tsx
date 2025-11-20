import { ObjectInputProps } from 'sanity'
import { MemberField } from '../../components'

type BreakpointKeys = 'mobile' | 'tablet' | 'desktop'

type Breakpoints = {
  [B in BreakpointKeys]: string
}

interface ResponsiveVideoProps {
  title?: string
  auto?: boolean
  breakpoint?: BreakpointKeys
  breakpoints?: Breakpoints
}

function ResponsiveVideo(props: ObjectInputProps<ResponsiveVideoProps>) {
  const { value } = props

  return (
    <div>
      <MemberField name="breakpoint" {...props} />
      {value?.breakpoint && <MemberField name={value.breakpoint} {...props} />}
    </div>
  )
}

export default ResponsiveVideo
