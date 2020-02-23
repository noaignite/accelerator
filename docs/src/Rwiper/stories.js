import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Media from '@oakwood/oui/Media'
import Rwiper from '@oakwood/oui/Rwiper'
import { A11y, Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/js/swiper.esm'
import 'swiper/css/swiper.css'

const stories = storiesOf('Components/Rwiper', module)

stories.add('Default', () => {
  return (
    <Rwiper
      modules={[A11y, Keyboard, Navigation, Pagination, Scrollbar]}
      navigation={{
        prevEl: <div className="swiper-button-prev" />,
        nextEl: <div className="swiper-button-next" />,
      }}
      pagination={{
        el: <div className="swiper-pagination" />,
        clickable: true,
      }}
      scrollbar={{
        el: <div className="swiper-scrollbar" />,
        draggable: true,
      }}
      watchOverflow
      keyboard
      // For more settings visit http://idangero.us/swiper/api/
    >
      {Array.from(new Array(6), (val, idx) => (
        <div key={idx} className="swiper-slide">
          <Media component="img" src={`//placekitten.com/800/${400 - idx}`} />
        </div>
      ))}
    </Rwiper>
  )
})

stories.add('External Controls', () => {
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)
  const paginationRef = React.useRef(null)

  return (
    <>
      <Rwiper
        modules={[A11y, Navigation, Pagination]}
        navigation={{
          prevEl: () => navigationPrevRef.current,
          nextEl: () => navigationNextRef.current,
        }}
        pagination={{
          el: () => paginationRef.current,
          clickable: true,
        }}
        watchOverflow
        // For more settings visit http://idangero.us/swiper/api/
      >
        {Array.from(new Array(6), (val, idx) => (
          <div key={idx} className="swiper-slide">
            <Media component="img" src={`//placekitten.com/800/${400 - idx}`} />
          </div>
        ))}
      </Rwiper>

      <div>
        <button type="button" ref={navigationPrevRef}>
          Prev
        </button>
        <button type="button" ref={navigationNextRef}>
          Next
        </button>
        <div ref={paginationRef} />
      </div>
    </>
  )
})

export default Rwiper
