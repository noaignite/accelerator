import * as React from 'react'
import { describeConformance, getClasses, render } from 'test/utils'
import MediaReveal from './MediaReveal'

describe('<MediaReveal />', () => {
  let classes

  const defaultProps = {
    children: <div />,
  }

  beforeEach(() => {
    classes = getClasses(<MediaReveal {...defaultProps} />)
  })

  describeConformance(<MediaReveal {...defaultProps} />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: [
      // https://github.com/facebook/react/issues/11565
      'reactTestRenderer',
    ],
  }))

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
