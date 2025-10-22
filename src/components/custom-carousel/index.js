import PropTypes from 'prop-types';

import Card from '@mui/material/Card';

import Image from 'src/components/image';
import Carousel, { useCarousel, CarouselArrowIndex } from 'src/components/carousel';
import { useState } from 'react';
import { Lightbox, useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

export default function CarouselCustom({ data }) {
  const carousel = useCarousel({
    autoplay: true,
  });
  const lightbox = useLightBox(data);

  const [state, setState] = useState({
    disabledZoom: false,
    disabledVideo: false,
    disabledTotal: false,
    disabledCaptions: false,
    disabledSlideshow: false,
    disabledThumbnails: false,
    disabledFullscreen: false,
  });

  return (
    <>
      <Card sx={{ width: '200px' }}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data?.map((item, index) => {
            const thumbnail = item.src;

            return (
              <Image
                key={index}
                src={item.src}
                ratio="1/1"
                onClick={() => lightbox.onOpen(`${thumbnail}`)}
                sx={{
                  '&:hover' : {
                    opacity: 0.8,
                    cursor : 'pointer'
                  }
                }}
              />
            )
          })}
        </Carousel>

        <CarouselArrowIndex
          index={carousel.currentIndex}
          total={data?.length}
          onNext={carousel.onNext}
          onPrev={carousel.onPrev}
        />
      </Card>
      <Lightbox
        open={lightbox.open}
        close={lightbox.onClose}
        slides={data}
        index={lightbox.selected}
        disabledZoom={state.disabledZoom}
        disabledTotal={state.disabledTotal}
        disabledVideo={state.disabledVideo}
        disabledCaptions={state.disabledCaptions}
        disabledSlideshow={state.disabledSlideshow}
        disabledThumbnails={state.disabledThumbnails}
        disabledFullscreen={state.disabledFullscreen}
      />
    </>
  );
}

CarouselCustom.propTypes = {
  data: PropTypes.array,
};
