import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text, select, object } from '@storybook/addon-knobs'
import Media from '@oakwood/oui/Media'

const stories = storiesOf('Components/Media', module)

const sources = {
  jpg: {
    xs: 'https://placekitten.com/600/600',
    sm: 'https://placekitten.com/960/960',
  },
  webp: {
    xs: 'https://fjr-blog.owcda.io/wp-content/uploads/2019/04/enander_o_101674_bild-300x200.webp',
    sm: 'https://fjr-blog.owcda.io/wp-content/uploads/2019/04/enander_o_101674_bild-768x512.webp',
  },
  mp3: {
    xs: 'https://www.w3schools.com/html/horse.mp3',
    sm: 'https://www.w3schools.com/html/horse.mp3',
  },
  mp4: {
    xs: 'https://www.w3schools.com/html/mov_bbb.mp4',
    sm: 'https://www.w3schools.com/tags/movie.mp4',
  },
}

export const Default = () => {
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
}

export const Picture = () => (
  <Media
    component={select('component', ['picture'], 'picture')}
    breakpoints={object('breakpoints', sources.jpg)}
    src={text('src', sources.jpg.xs)}
    alt={text('alt', 'Just another image description')}
  />
)

export const PictureWithWebP = () => (
  <Media
    component={select('component', ['picture'], 'picture')}
    breakpoints={object('breakpoints', {
      xs: [{ src: sources.webp.xs, type: 'image/webp' }, { src: sources.jpg.xs }],
      sm: [{ src: sources.webp.sm, type: 'image/webp' }, { src: sources.jpg.sm }],
    })}
    src={sources.jpg.xs}
    alt={text('alt', 'Just another image description')}
  />
)

export const Video = () => (
  <Media
    component={select('component', ['video'], 'video')}
    breakpoints={object('breakpoints', sources.mp4)}
    autoPlay
    controls
    muted
    loop
  />
)

export const Custom = () => (
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
)

stories.add('Default', Default)
stories.add('Picture', Picture)
stories.add('Picture w/ WebP', PictureWithWebP)
stories.add('Video', Video)
stories.add('Custom', Custom)
