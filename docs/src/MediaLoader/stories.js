/* eslint-disable no-console */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import Zoom from '@material-ui/core/Zoom'
import Media from '@oakwood/oui/Media'
import MediaLoader from '@oakwood/oui/MediaLoader'

const stories = storiesOf('Components/MediaLoader', module)

export const MediaLoaderStory = () => (
  <MediaLoader>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderAspectRatioStory = () => (
  <MediaLoader width={number('width', 10)} height={number('height', 5)}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderPlaceholderStory = () => (
  <MediaLoader placeholder={<Media component="img" src="//placekitten.com/500/299" />}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderTransitionStory = () => (
  <MediaLoader TransitionComponent={Zoom}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderLazyStory = () => (
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

stories.add('Default', MediaLoaderStory)
stories.add('Custom Aspect Ratio', MediaLoaderAspectRatioStory)
stories.add('Custom Placeholder', MediaLoaderPlaceholderStory)
stories.add('Custom Transition', MediaLoaderTransitionStory)
stories.add('Lazy Load', MediaLoaderLazyStory)

export default MediaLoader
