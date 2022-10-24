import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Fade from '@mui/material/Fade'
import Zoom from '@mui/material/Zoom'
import { Media, MediaReveal } from '@noaignite/oui'

export default {
  title: 'Oui/MediaReveal',
  component: MediaReveal,
} as ComponentMeta<typeof MediaReveal>

const Template: ComponentStory<typeof MediaReveal> = (args) => (
  <MediaReveal {...args}>
    <Media src="//source.unsplash.com/1920x1080" />
  </MediaReveal>
)

export const Default = Template.bind({})
Default.args = {}

export const WithRatio = Template.bind({})
WithRatio.args = {
  ratio: 16 / 9,
}

export const CustomTransition = Template.bind({})
CustomTransition.args = {
  ratio: 16 / 9,
  TransitionComponent: Zoom,
}

export const RootMargin = Template.bind({})
RootMargin.args = {
  ratio: 16 / 9,
  rootMargin: '0% 0% -50%',
  style: { margin: '150vh 0' },
}

const Template2: ComponentStory<typeof MediaReveal> = (args) => (
  <MediaReveal {...args}>
    <Media
      component="video"
      poster="//source.unsplash.com/1920x1080"
      src="//www.w3schools.com/html/mov_bbb.mp4"
      autoPlay
      controls
      loop
      muted
      playsInline
    />
  </MediaReveal>
)

export const WithVideo = Template2.bind({})
WithVideo.args = {
  ratio: 16 / 9,
}

const Template3: ComponentStory<typeof MediaReveal> = (args) => (
  <MediaReveal {...args}>
    {({ reveal }) => (
      <React.Fragment>
        <Media src="//images3.alphacoders.com/975/975999.png" />

        <Fade in={!reveal} appear={false} timeout={750} unmountOnExit>
          <Media src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMiA3OS4xNjQzNjAsIDIwMjAvMDIvMTMtMDE6MDc6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTVkZjI2N2EtYjg3MS00ZDA0LTgzNzQtOGE5YzUxNWE5ZDFiIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE0MEU2RkZBOUVEMzExRUFBRjdCQjREM0Y5MzQ4NjBCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE0MEU2RkY5OUVEMzExRUFBRjdCQjREM0Y5MzQ4NjBCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDYzNWYzNTMtY2E2OS00OGY0LTk4YzgtM2FhYzQxYzkyYmQzIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDVkYjUwMjEtMGViMy0xMTdjLTgzMWEtZGFjODFjOWU1YzA0Ii8+IDwv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" />
        </Fade>
      </React.Fragment>
    )}
  </MediaReveal>
)

export const Placeholder = Template3.bind({})
Placeholder.args = {
  ratio: 16 / 9,
}

const Template4: ComponentStory<typeof MediaReveal> = (args) => (
  <React.Fragment>
    {Array.from(new Array(200), (_, idx) => (
      <MediaReveal key={idx} {...args}>
        <Media src="//source.unsplash.com/1920x1080" />
      </MediaReveal>
    ))}
  </React.Fragment>
)

export const DefaultLoadTest = Template4.bind({})
DefaultLoadTest.args = {
  ratio: 16 / 9,
}

export const RootMarginLoadTest = Template4.bind({})
RootMarginLoadTest.args = {
  ratio: 16 / 9,
  rootMargin: '0px',
}
