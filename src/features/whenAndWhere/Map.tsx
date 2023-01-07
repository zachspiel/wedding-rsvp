import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 33.470537886567875,
  lng: -111.7427867022771,
};

const Map = (): JSX.Element => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC-YodCYGgMEEu6PUz4w82GI4gmHxgkft4",
  });

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <Marker
        position={{
          lat: 33.470537886567875,
          lng: -111.7427867022771,
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
