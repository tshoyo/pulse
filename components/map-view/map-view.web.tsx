import { default as WebMapView } from "@teovilla/react-native-web-maps";
import React from "react";
import { MapViewProps } from "react-native-maps/lib/MapView";

const MapView = ({ ...props }: MapViewProps) => {
  return (
    // @ts-expect-error WebMapView is valid jsx element
    <WebMapView
      provider="google"
      googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB}
      {...props}
    ></WebMapView>
  );
};

export default MapView;
export * from "@teovilla/react-native-web-maps";
