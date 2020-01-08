/* eslint-disable no-console */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import Zoom from '@material-ui/core/Zoom'
import Media from '@oakwood/oui/Media'
import MediaLoader from '@oakwood/oui/MediaLoader'

const stories = storiesOf('Components/MediaLoader', module)

const sources = {
  responsive: {
    xs: '//source.unsplash.com/960x540',
    sm: '//source.unsplash.com/1920x1080',
  },
  heavy: '//images3.alphacoders.com/975/975999.png',
  video: '//www.w3schools.com/tags/movie.mp4',
}

export const Default = () => (
  <MediaLoader>
    <Media component="img" src={sources.heavy} />
  </MediaLoader>
)

export const MultipleSources = () => (
  <MediaLoader>
    <Media component="picture" breakpoints={sources.responsive} />
  </MediaLoader>
)

export const VideoWithPoster = () => (
  <MediaLoader>
    <Media component="video" poster={sources.heavy} src={sources.video} controls />
  </MediaLoader>
)

export const CustomAspectRatio = () => (
  <MediaLoader width={number('width', 10)} height={number('height', 5)}>
    <Media component="img" src={sources.heavy} />
  </MediaLoader>
)

export const CustomPlaceholder = () => (
  <MediaLoader placeholder={<Media component="img" src={sources.responsive.xs} />}>
    <Media component="img" src={sources.responsive.sm} />
  </MediaLoader>
)

export const CustomTransition = () => (
  <MediaLoader TransitionComponent={Zoom}>
    <Media component="img" src={sources.heavy} />
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
      <Media component="img" src={sources.heavy} />
    </MediaLoader>
  </div>
)

stories.add('Default', Default)
stories.add('Multiple Sources', MultipleSources)
stories.add('Video With Poster', VideoWithPoster)
stories.add('Custom Aspect Ratio', CustomAspectRatio)
stories.add('Custom Placeholder', CustomPlaceholder)
stories.add('Custom Transition', CustomTransition)
stories.add('Lazy Load & Reveal', LazyLoadAndReveal)

export default MediaLoader
