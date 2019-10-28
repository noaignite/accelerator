import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, number } from '@storybook/addon-knobs'
import Slide from '@material-ui/core/Slide'
import Media from '@oakwood/oui/Media'
import MediaLoader from '@oakwood/oui/MediaLoader'

const stories = storiesOf('Components/MediaLoader', module)

export const MediaLoaderStory = () => (
  <MediaLoader disablePlaceholder={boolean('disablePlaceholder', false)}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderLazyStory = () => (
  <div>
    <div style={{ height: 500, margin: 20, background: '#eee' }} />

    <MediaLoader aspectRatio={{ width: 1, height: 1 }} rootMargin="-200px 0px" lazy>
      <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
    </MediaLoader>
  </div>
)

export const MediaLoaderAspectRatioStory = () => (
  <MediaLoader aspectRatio={{ width: number('width', 10), height: number('height', 5) }}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderPlaceholderStory = () => (
  <MediaLoader placeholder={<Media component="img" src="//placekitten.com/500/299" />}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </MediaLoader>
)

export const MediaLoaderTransitionStory = () => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />
  })

  return (
    <MediaLoader TransitionComponent={Transition}>
      <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
    </MediaLoader>
  )
}

stories.add('Default', MediaLoaderStory)
stories.add('Lazy Load', MediaLoaderLazyStory)
stories.add('Custom Aspect Ratio', MediaLoaderAspectRatioStory)
stories.add('Custom Placeholder', MediaLoaderPlaceholderStory)
stories.add('Custom Transition', MediaLoaderTransitionStory)

export default MediaLoader
