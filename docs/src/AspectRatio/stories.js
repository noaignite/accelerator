import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import Media from '@oakwood/oui/Media'
import AspectRatio from '@oakwood/oui/AspectRatio'

const stories = storiesOf('Components/AspectRatio', module)

stories.add('Default', () => (
  <AspectRatio width={number('width', 10)} height={number('height', 5)}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </AspectRatio>
))
