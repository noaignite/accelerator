import * as React from 'react'
import BackgroundMedia from '@oakwood/oui/BackgroundMedia'
import Media from '@oakwood/oui/Media'
import MediaReveal from '@oakwood/oui/MediaReveal'

export default {
  title: 'Components/BackgroundMedia',
  component: BackgroundMedia,
}

const Template = () => (
  <>
    <section style={{ position: 'relative' }}>
      <Media component="img" src="//source.unsplash.com/800x400" style={{ opacity: 0 }} />

      <BackgroundMedia attachment="sticky">
        <MediaReveal>
          <Media component="img" src="//source.unsplash.com/800x400" />
        </MediaReveal>
      </BackgroundMedia>

      <div style={{ position: 'absolute', top: 0, padding: 20, background: '#fff' }}>
        Attachment: sticky
      </div>
    </section>

    <section style={{ position: 'relative', height: 650 }}>
      <BackgroundMedia attachment="static">
        <MediaReveal>
          <Media component="img" src="//source.unsplash.com/800x410" />
        </MediaReveal>
      </BackgroundMedia>

      <div style={{ position: 'absolute', top: 0, padding: 20, background: '#fff' }}>
        Attachment: static
      </div>
    </section>

    <section style={{ position: 'relative' }}>
      <Media component="img" src="//source.unsplash.com/800x420" style={{ opacity: 0 }} />

      <BackgroundMedia attachment="fixed">
        <Media component="img" src="//source.unsplash.com/800x420" />
      </BackgroundMedia>

      <div style={{ position: 'absolute', top: 0, padding: 20, background: '#fff' }}>
        Attachment: fixed
      </div>
    </section>

    <section style={{ position: 'relative', height: 650 }}>
      <BackgroundMedia attachment="sticky">
        <Media component="img" src="//source.unsplash.com/800x430" />
      </BackgroundMedia>

      <div style={{ position: 'absolute', top: 0, padding: 20, background: '#fff' }}>
        Attachment: sticky
      </div>
    </section>

    <section style={{ position: 'relative' }}>
      <Media component="img" src="//source.unsplash.com/800x440" style={{ opacity: 0 }} />

      <BackgroundMedia attachment="fixed">
        <Media component="img" src="//source.unsplash.com/800x440" />
      </BackgroundMedia>

      <div style={{ position: 'absolute', top: 0, padding: 20, background: '#fff' }}>
        Attachment: fixed
      </div>
    </section>

    <section style={{ position: 'relative', height: 650 }}>
      <BackgroundMedia attachment="static">
        <Media component="img" src="//source.unsplash.com/800x450" />
      </BackgroundMedia>

      <div style={{ position: 'absolute', top: 0, padding: 20, background: '#fff' }}>
        Attachment: static
      </div>
    </section>
  </>
)

export const Default = Template.bind({})
Default.args = {}
