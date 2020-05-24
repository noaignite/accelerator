/* eslint-disable no-console */

import * as React from 'react'
import { storiesOf } from '@storybook/react'
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

stories.add('Default', () => (
  <MediaLoader>
    <Media component="img" src={sources.heavy} />
  </MediaLoader>
))

stories.add('Multiple Sources', () => (
  <MediaLoader>
    <Media component="picture" breakpoints={sources.responsive} />
  </MediaLoader>
))

stories.add('Video With Poster', () => (
  <MediaLoader>
    <Media component="video" poster={sources.heavy} src={sources.video} controls />
  </MediaLoader>
))

stories.add('Custom Placeholder', () => (
  <MediaLoader placeholder={<Media component="img" src={sources.responsive.xs} />}>
    <Media component="img" src={sources.heavy} />
  </MediaLoader>
))

stories.add('Custom Transition', () => (
  <MediaLoader TransitionComponent={Zoom}>
    <Media component="img" src={sources.heavy} />
  </MediaLoader>
))

stories.add('Lazy Load & Reveal', () => (
  <div>
    <div style={{ height: '150vh', margin: 20, background: '#eee' }} />

    <MediaLoader
      width={10}
      height={5}
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
))
