import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text, select, object } from '@storybook/addon-knobs'
import Media from '@oakwood/oui/Media'

const stories = storiesOf('Components/Media', module)

const sources = {
  jpg: {
    xs: '//source.unsplash.com/960x540',
    sm: '//source.unsplash.com/1920x1080',
  },
  webp: {
    xs: '//www.gstatic.com/webp/gallery/1.sm.webp',
    sm: '//www.gstatic.com/webp/gallery/2.sm.webp',
  },
  mp3: {
    xs: '//www.w3schools.com/html/horse.mp3',
    sm: '//www.w3schools.com/html/horse.mp3',
  },
  mp4: {
    xs: '//www.w3schools.com/html/mov_bbb.mp4',
    sm: '//www.w3schools.com/tags/movie.mp4',
  },
}

stories.add('Default', () => {
  const comp = select('component', ['div', 'video', 'audio', 'picture', 'iframe', 'img'], 'div')

  const componentProps = {}
  if (['img', 'picture'].includes(comp)) {
    componentProps.alt = text('alt', 'Just another image description')
  }
  if (['audio', 'video'].includes(comp)) {
    componentProps.autoPlay = boolean('autoPlay', true)
    componentProps.controls = boolean('controls', true)
    componentProps.loop = boolean('loop', false)
  }
  if (['video'].includes(comp)) {
    componentProps.muted = boolean('muted', false)
    componentProps.playsInline = boolean('playsInline', false)
  }

  return (
    <Media
      component={comp}
      src={select('src', [sources.jpg.xs, sources.mp3.xs, sources.mp4.xs], sources.jpg.xs)}
      style={{ minHeight: '100px' }}
      {...componentProps}
    />
  )
})

stories.add('Picture', () => (
  <Media
    component={select('component', ['picture'], 'picture')}
    breakpoints={object('breakpoints', sources.jpg)}
    src={text('src', sources.jpg.xs)}
    alt={text('alt', 'Just another image description')}
  />
))

stories.add('Picture w/ WebP', () => (
  <Media
    component={select('component', ['picture'], 'picture')}
    breakpoints={object('breakpoints', {
      xs: [{ src: sources.webp.xs, type: 'image/webp' }, { src: sources.jpg.xs }],
      sm: [{ src: sources.webp.sm, type: 'image/webp' }, { src: sources.jpg.sm }],
    })}
    src={sources.jpg.xs}
    alt={text('alt', 'Just another image description')}
  />
))

stories.add('Video', () => (
  <Media
    component={select('component', ['video'], 'video')}
    breakpoints={object('breakpoints', sources.mp4)}
    autoPlay
    controls
    muted
    loop
  />
))

stories.add('Custom', () => (
  <Media
    breakpoints={object('breakpoints', {
      xs: {
        component: 'img',
        src: sources.jpg.xs,
        alt: 'Just another image description',
      },
      sm: {
        component: 'video',
        src: sources.mp4.xs,
        autoPlay: true,
        muted: true,
      },
    })}
  />
))
