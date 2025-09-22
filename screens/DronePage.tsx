import { Image, Toast } from "@/components";
import { Colors, Font, Spacing } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  CameraDevice,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export default function DronePage() {
  const [stepIndex, setStepIndex] = useState(0);
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const toastTitle = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.text.xxsmall,
      }}
    >
      {true ? (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("@/assets/icons/check-circle-green.png")}
        />
      ) : (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("@/assets/icons/check-circle-green.png")}
        />
      )}
      <Text style={{ fontWeight: "500", fontSize: Font.size.large }}>
        Step {stepIndex + 1}
      </Text>
    </View>
  );
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}>
      {
        <Camera
          style={StyleSheet.absoluteFill}
          device={device as CameraDevice}
          isActive={true}
        />
      }
      <View
        style={{
          position: "absolute",
          padding: Spacing.block.medium,
          top: 0,
          width: "100%",
        }}
      >
        <Toast
          title={toastTitle}
          subtitle={
            "Ask the driver to hold up their registration to be scanned."
          }
        >
          <View>
            <Text>
              {Intl.NumberFormat("en-US", {
                style: "percent",
                maximumFractionDigits: 0,
              }).format(stepIndex / 6)}
            </Text>
          </View>
        </Toast>
      </View>
      <View
        style={{
          position: "absolute",
          padding: Spacing.block.medium,
          bottom: 0,
          width: "100%",
        }}
      >
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={{ fontWeight: "500", color: Colors.dark.text }}>
            Exit/Cancel Task
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: Colors.light.background,
    borderWidth: 1,
    padding: Spacing.block.xsmall,
    borderRadius: Spacing.block.xsmall * 4,
    alignItems: "center",
  },
});
