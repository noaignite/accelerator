/* eslint-disable no-console */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import Zoom from '@material-ui/core/Zoom'
import Media from '@oakwood/oui/Media'
import MediaLoader from '@oakwood/oui/MediaLoader'

const stories = storiesOf('Components/MediaLoader', module)

export const Default = () => (
  <MediaLoader>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const CustomAspectRatio = () => (
  <MediaLoader width={number('width', 10)} height={number('height', 5)}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const CustomPlaceholder = () => (
  <MediaLoader placeholder={<Media component="img" src="//placekitten.com/500/299" />}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const CustomTransition = () => (
  <MediaLoader TransitionComponent={Zoom}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const LazyLoadAndReveal = () => (
  <div>
    <div style={{ height: 3000, margin: 20, background: '#eee' }} />

    <MediaLoader
      // `lazy` will "delay" the rendering of children. Exposes `onRender` callback.
      onRender={() => console.log('onRender')}
      lazy
      // `rootMargin` will "delay" fading of children. Exposes `onReveal` callback.
      onReveal={() => console.log('onReveal')}
      rootMargin="0% 0% -25%"
      // Fades in children and triggers `onLoad` callback if previous criteria met.
      onLoad={() => console.log('onLoad')}
    >
      <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
    </MediaLoader>
  </div>
)

stories.add('Default', Default)
stories.add('Custom Aspect Ratio', CustomAspectRatio)
stories.add('Custom Placeholder', CustomPlaceholder)
stories.add('Custom Transition', CustomTransition)
stories.add('Lazy Load & Reveal', LazyLoadAndReveal)

export default MediaLoader
