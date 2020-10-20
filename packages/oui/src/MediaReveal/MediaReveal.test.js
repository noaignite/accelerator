import * as React from 'react'
import { createRender, describeConformance, getClasses } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaReveal from './MediaReveal'

describe('<MediaReveal />', () => {
  const render = createRender({ wrapper: TestProvider })
  let classes

  const defaultProps = {
    children: <div />,
  }

  beforeEach(() => {
    classes = getClasses(<MediaReveal {...defaultProps} />, render)
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
