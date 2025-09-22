import { Colors, Font, Spacing } from "@/constants/theme";
import { router } from "expo-router";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { Button } from "./button";
import { ExpoImage } from "./image";
import { ThemedText as Text } from "./themed-text";
import { ThemedView as View } from "./themed-view";

export const TaskCategories = [
  {
    title: "Police Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/police.png"),
    slug: "police",
  },
  {
    title: "State/City Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/michigan-flag.png"),
    slug: "local-government",
  },
  {
    title: "EMS Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/ambulance.png"),
    slug: "ems",
  },
  {
    title: "Fire Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/firetruck.png"),
    slug: "fire",
  },
] as const;

type TaskCategory = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  slug: string;
};
type TaskCategoryConst = typeof TaskCategories;

type TaskCategoryListProps = {
  supportedTypes: TaskCategoryConst[number]["slug"][];
};

export function TaskCategoryList({ supportedTypes }: TaskCategoryListProps) {
  return (
    <>
      {TaskCategories.map((taskCategory) => (
        <View key={taskCategory.slug} style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{taskCategory.title}</Text>
            <Text style={styles.subtitle}>{taskCategory.subtitle}</Text>
            <Button
              text="View Tasks"
              disabled={false && !supportedTypes.includes(taskCategory.slug)}
              size="medium"
              onPress={() =>
                router.push({
                  pathname: "/(main)/tasks/[type]",
                  params: { type: taskCategory.slug },
                })
              }
            />
          </View>
          <View style={styles.imageContainer}>
            <ExpoImage
              contentFit="cover"
              contentPosition={
                taskCategory.slug === "local-government"
                  ? { left: 0, top: "50%" }
                  : { left: 0, bottom: "50%" }
              }
              style={styles.image}
              source={taskCategory.image}
            />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light["900"],
    borderRadius: Spacing.block.xxsmall,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.block.small,
    overflow: "hidden",
  },
  content: {
    padding: Spacing.block.medium,
    flexBasis: 175,
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "600",
  },
  subtitle: {
    fontSize: Font.size.small,
    color: Colors.gray.dark["500"],
    marginBottom: Spacing.block.small,
  },
  imageContainer: {
    paddingVertical: 12,
    height: "100%",
    flex: 1,
    backgroundColor: "transparent",
  },
  image: {
    height: "100%",
    width: "auto",
  },
});
