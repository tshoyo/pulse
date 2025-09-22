import { Image as ExpoImage } from "expo-image";
import { ImageProps, Image as RNImage } from "react-native";

export function Image({ ...props }: ImageProps) {
  //return <ExpoImage {...props} />;
  return <RNImage {...props} />;
}

export { ExpoImage };
