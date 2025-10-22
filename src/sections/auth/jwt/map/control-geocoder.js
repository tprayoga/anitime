import React, { useState } from 'react';
import { useControl, Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './style.css';

const GeocoderControl = ({
  mapboxAccessToken,
  //   marker = true,
  position,
  onLoading = () => {},
  onResults = () => {},
  onResult = () => {},
  onError = () => {},
  ...otherProps
}) => {
  const [markerComponent, setMarkerComponent] = useState(null);

  useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        marker: false,
        accessToken: mapboxAccessToken,
        ...otherProps, // Spread other props
      });

      ctrl.on('loading', onLoading);
      ctrl.on('results', onResults);
      ctrl.on('result', (evt) => {
        onResult(evt);

        const { result } = evt;
        const location =
          result &&
          (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
      });
      ctrl.on('error', onError);

      return ctrl;
    },
    {
      position,
    }
  );

  return markerComponent;
};

export default GeocoderControl;
