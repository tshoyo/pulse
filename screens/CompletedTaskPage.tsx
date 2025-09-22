import { Button, DottedLine, ThemedView as View } from "@/components";
import { Colors, Font, Spacing } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const steps = [
  {
    title: "Approach the vehicle.",
    subtitle: "Tag",
    icon: require("@/assets/icons/side-mirror.png"),
    description:
      "Approach the vehicle directly in front of the officers vehicle.",
  },
  {
    title: "Scan outer vehicle.",
    subtitle: "Tag",
    icon: require("@/assets/icons/car.png"),
    description:
      "Check the vehicle for its make, model, and license plate number.",
  },
  {
    title: "Speeding speech prompt.",
    subtitle: "Tag",
    icon: require("@/assets/icons/comment.png"),
    description:
      "Hello, you are being pulled over for speeding. You were recorded going [insert speed] in a [insert speed].",
  },
  {
    title: "Scan inner vehicle.",
    subtitle: "Tag",
    icon: require("@/assets/icons/seat-belt.png"),
    description:
      "Verify the vehicle number of the individuals, ensure that seatbelts are fastened, and check for any potential weapons.",
  },
  {
    title: "Scan owner license.",
    subtitle: "Tag",
    icon: require("@/assets/icons/drivers-license.png"),
    description:
      "Ask the driver to hold the back of their license up to be scanned.",
  },
  {
    title: "Scan owner registration.",
    subtitle: "Tag",
    icon: require("@/assets/icons/document.png"),
    description: "Ask the driver to hold up their registration to be scanned.",
  },
];

export default function CompletedTaskPage() {
  const { id } = useLocalSearchParams();

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
      >
        <Button
          onPress={() => router.back()}
          buttonStyle={{
            transform: [{ rotateZ: "180deg" }],
            marginVertical: Spacing.block.xsmall,
          }}
          color="tertiary"
          icon={require("@/assets/icons/chevron-right-black.png")}
        />
        <Text style={styles.title}>{"Traffic Stop - Speeding"}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: Spacing.text.xsmall,
          }}
        >
          <View style={{ transform: [{ translateY: "25%" }] }}>
            <Image source={require("@/assets/icons/info.png")} />
          </View>
          <Text style={{ fontSize: Font.size.medium }}>
            A speeding traffic stop occurs when police pull over a driver for
            exceeding the posted speed limit.
          </Text>
        </View>
        <DottedLine />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: Spacing.block.small,
    alignItems: "flex-start",
    gap: Spacing.block.small,
  },
  title: {
    fontSize: Font.size.xlarge,
    color: Colors.dark.background,
  },
  subtitle: {
    color: Colors.gray.dark["500"],
  },
  taskMetadata: {
    backgroundColor: Colors.gray.light["900"],
    padding: Spacing.block.small,
    borderRadius: Spacing.block.small,
    gap: Spacing.text.medium,
    width: "100%",
  },
  stepCount: {
    marginVertical: Spacing.block.medium,
  },
  stepsContainer: {
    width: "100%",
    borderRadius: 12,
    borderColor: "#DCDCDCC4",
    borderWidth: 1,
  },
  stepCard: {
    padding: Spacing.block.small,
    paddingVertical: Spacing.block.xsmall,
    alignItems: "flex-start",
    gap: Spacing.block.xxsmall,
    flexDirection: "row",
  },
  stepContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  stepSubtitle: {
    fontSize: Font.size.small,
    color: Colors.dark.background,
  },
  stepTitle: {
    fontSize: Font.size.medium,
    fontWeight: "600",
    marginVertical: Spacing.text.xxsmall,
  },
  stepDescription: {
    fontSize: Font.size.small,
  },
});
