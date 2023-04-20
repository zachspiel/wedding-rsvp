import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const WRIGHT_HOUSE_LOCATION = {
  lat: 33.42279057560783,
  lng: -111.84529613067069,
};

const Map = (): JSX.Element => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY ?? "",
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={WRIGHT_HOUSE_LOCATION}
      zoom={15}
    >
      <Marker position={WRIGHT_HOUSE_LOCATION} />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
