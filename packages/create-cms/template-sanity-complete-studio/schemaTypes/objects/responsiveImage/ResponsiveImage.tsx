import * as React from 'react'
import { ObjectInputProps } from 'sanity'
import { breakpoints } from '../../../utils'
import { MemberField } from '../../components'

type BreakpointKeys = 'mobile' | 'tablet' | 'desktop'

type Breakpoints = {
  [B in BreakpointKeys]: string
}

interface ResponsiveImageProps {
  alt?: string
  auto?: boolean
  breakpoint?: BreakpointKeys
  breakpoints?: Breakpoints
  title?: string
}

const ResponsiveImage: React.ComponentType<ObjectInputProps<ResponsiveImageProps>> = (
  props: ObjectInputProps<ResponsiveImageProps>,
) => {
  const { value } = props

  return (
    <React.Fragment>
      <MemberField name="alt" {...props} />
      <MemberField name="auto" {...props} />

      {value?.auto && <MemberField name={breakpoints[0]} {...props} />}

      {!value?.auto && (
        <React.Fragment>
          <MemberField name="breakpoint" {...props} />
          {value?.breakpoint && <MemberField name={value.breakpoint} {...props} />}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ResponsiveImage
