import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { render } from 'test/utils'
import describeConformance from '../test-utils/describeConformance'
import MediaBase from './MediaBase'

describe('<MediaBase />', () => {
  const mount = createMount()
  let classes

  beforeAll(() => {
    classes = getClasses(<MediaBase src="/foo.jpg" />)
  })

  describeConformance(<MediaBase src="/foo.jpg" />, () => ({
    classes,
    inheritComponent: 'img',
    mount,
    refInstanceof: window.HTMLImageElement,
    testComponentPropWith: 'picture',
  }))
  mount.cleanUp()

  describe('should render with', () => {
    it('the `src` attribute specified', () => {
      const { getByTestId } = render(<MediaBase src="/foo.jpg" data-testid="root" />)
      expect(getByTestId('root')).toHaveAttribute('src', '/foo.jpg')
    })

    it('no `src` attribute when `lazy` is specified', () => {
      const { getByTestId } = render(<MediaBase src="/foo.jpg" lazy data-testid="root" />)
      expect(getByTestId('root')).not.toHaveAttribute('src', '/foo.jpg')
    })

    it('content of nested children', () => {
      const { getByTestId } = render(
        <MediaBase component="picture" data-testid="root">
          <img src="foo.jpg" alt="" data-testid="img" />
        </MediaBase>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
