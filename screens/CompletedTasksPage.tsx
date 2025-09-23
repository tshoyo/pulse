import { Button, DottedLine, ThemedView as View } from "@/components";
import { Colors, Font, Spacing } from "@/constants/theme";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tasks = [
  {
    id: "1234",
    steps: [0, 0, 0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "2521",
    steps: [0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "2799",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "8475",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3368",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3458",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3932",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "6666",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3398",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "5835",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3822",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3439",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "3778",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "9376",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "0974",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "7222",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "2672",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "2678",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "9723",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "8774",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
  {
    id: "7247",
    steps: [0, 0, 0, 0, 0, 0],
    title: "Traffic Stop",
    subtitle: "Speeding",
    icon: require("@/assets/icons/speedometer.png"),
  },
];

export default function CompletedTasksPage() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[StyleSheet.absoluteFill, { paddingTop: top }]}>
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
        <Text style={styles.title}>Completed Tasks</Text>
        <Text style={styles.subtitle}>
          All your completed task from drone network.
        </Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image source={require("@/assets/icons/search.png")} />
            <TextInput
              style={{
                fontSize: Font.size.medium,
                flex: 1,
                outlineWidth: 0,
                color: Colors.dark.text,
              }}
              placeholder="Search tasks"
              placeholderTextColor={Colors.gray.dark["500"]}
            />
          </View>
          <Button icon={require("@/assets/icons/filter.png")} />
        </View>
        <DottedLine />
        <Text style={styles.taskCount}>Today</Text>
        <View style={styles.tasksContainer}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() =>
                router.push({
                  pathname: "/completed/[id]",
                  params: { id: task.id },
                })
              }
            >
              <View style={styles.taskContent}>
                <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.taskMetadata}>
                  <Text style={{ fontSize: Font.size.small }}>
                    ID:#{task.id}
                  </Text>
                  <View
                    style={{
                      transform: [{ scale: 2 }, { translateY: "-6.25%" }],
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text>&middot;</Text>
                  </View>
                  <Text style={{ fontSize: Font.size.medium }}>
                    {task.steps.length} steps
                  </Text>
                </View>
              </View>
              <Image
                source={require("@/assets/icons/chevron-right-black.png")}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: Spacing.block.small,
    alignItems: "flex-start",
  },
  title: {
    fontSize: Font.size.xlarge,
    color: Colors.dark.background,
  },
  subtitle: {
    color: Colors.gray.dark["500"],
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    gap: Spacing.block.xxxsmall,
    alignItems: "center",
    paddingVertical: Spacing.block.medium,
  },
  searchBar: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.text.small,
    padding: Spacing.block.xsmall,
    paddingHorizontal: Spacing.block.small,
    borderRadius: Spacing.block.small * 4,
  },
  taskCount: {
    marginVertical: Spacing.block.medium,
  },
  tasksContainer: {
    width: "100%",
    gap: Spacing.block.xsmall,
  },
  taskCard: {
    backgroundColor: Colors.gray.light["900"],
    borderRadius: Spacing.block.medium,
    padding: Spacing.block.medium,
    alignItems: "center",
    gap: Spacing.block.small,
    flexDirection: "row",
  },
  taskContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  taskSubtitle: {
    fontWeight: "500",
    color: Colors.dark.background,
  },
  taskTitle: {
    fontSize: Font.size.xlarge,
    fontWeight: "600",
    marginVertical: Spacing.text.small,
  },
  taskMetadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.text.small,
    backgroundColor: "transparent",
  },
});
