import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { describeConformance, render } from '../test-utils'
import MediaLoader from '../MediaLoader'
import MediaReveal from './MediaReveal'

describe('<MediaReveal />', () => {
  const mount = createMount()
  let classes

  const defaultProps = {
    children: <div />,
  }

  beforeAll(() => {
    classes = getClasses(<MediaReveal {...defaultProps} />)
  })

  describeConformance(<MediaReveal {...defaultProps} />, () => ({
    classes,
    inheritComponent: MediaLoader,
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
    skip: [
      // https://github.com/facebook/react/issues/11565
      'reactTestRenderer',
    ],
  }))
  mount.cleanUp()

  describe('should render with', () => {
    it('content of nested children', () => {
      const { getByTestId } = render(
        <MediaReveal>
          <img src="foo.jpg" alt="" data-testid="img" />
        </MediaReveal>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
