import { Image } from "@/components/image";
import { Colors, Font, Spacing } from "@/constants/theme";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type DroneMarkerProps = {
  connected?: boolean;
  name?: string;
};

export function DroneMarker({
  connected,
  name = "Drone",
  ...props
}: TouchableOpacityProps & DroneMarkerProps) {
  return (
    <TouchableOpacity style={[styles.marker]} {...props}>
      <View style={styles.markerContent}>
        <View style={styles.markerIconContainer}>
          {connected ? (
            <Image
              style={styles.markerIcon}
              source={require("@/assets/icons/check-circle-green.png")}
            />
          ) : (
            <Image
              style={styles.markerIcon}
              source={require("@/assets/icons/check-circle-gray.png")}
            />
          )}
        </View>
        <Text style={styles.markerText}>{name}</Text>
      </View>
      <Image
        source={require("@/assets/icons/triangle.png")}
        style={styles.markerTriangle}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: "center",
    gap: 0,
  },
  markerContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    padding: Spacing.block.xxxsmall,
    paddingRight: Spacing.block.medium,
    borderRadius: 52,
    gap: Spacing.block.xxxsmall,
  },
  markerIconContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 13,
    padding: Spacing.block.xxxsmall,
    width: 26,
    height: 26,
  },
  markerIcon: {
    width: 14,
    height: 14,
  },
  markerText: {
    color: Colors.dark.text,
    fontSize: Font.size.medium,
  },
  markerTriangle: {
    height: 12,
    width: 20,
  },
});
