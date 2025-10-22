import Map from 'react-map-gl';
import { memo, useState, useCallback } from 'react';

import { MapMarker, MapControl } from 'src/components/map';

import ControlPanel from './control-panel';
import GeocoderControl from './control-geocoder';
import { MAP_ACCESSTOKEN, THEMES_MAP } from './config';

// ----------------------------------------------------------------------

function MapDraggableMarkers({ setValue, name, lon, lat, ...other }) {
  const [events, logEvents] = useState({});

  const onDblClickMap = useCallback((event) => {
    logEvents((prevEvents) => ({ ...prevEvents, onDblClick: event.lngLat }));

    // const lin
    setValue(name, {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragStart = useCallback((event) => {
    logEvents((prevEvents) => ({ ...prevEvents, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((prevEvents) => ({ ...prevEvents, onDrag: event.lngLat }));

    setValue(name, {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((prevEvents) => ({ ...prevEvents, onDragEnd: event.lngLat }));
  }, []);

  return (
    <>
      <Map
        initialViewState={{ latitude: -2.21799, longitude: 117.67046, zoom: 3.5 }}
        onDblClick={onDblClickMap}
        doubleClickZoom={false}
        mapStyle={THEMES_MAP.light}
        {...other}
      >
        <MapControl />

        {(lon || lat) && (
          <MapMarker
            longitude={lon}
            latitude={lat}
            anchor="bottom"
            draggable
            onDragStart={onMarkerDragStart}
            onDrag={onMarkerDrag}
            onDragEnd={onMarkerDragEnd}
          />
        )}
        <GeocoderControl mapboxAccessToken={other.mapboxAccessToken} position="top-right" />
      </Map>

      {/* <ControlPanel events={events} /> */}
    </>
  );
}

export default memo(MapDraggableMarkers);
