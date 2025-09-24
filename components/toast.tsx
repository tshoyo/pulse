import { Colors, Font, Spacing } from "@/constants/theme";
import { PropsWithChildren, ReactNode } from "react";
import { Image, StyleSheet, ViewStyle } from "react-native";
import { ThemedText as Text } from "./themed-text";
import { ThemedView as View } from "./themed-view";

type ToastProps = {
  title?: string | (() => ReactNode);
  subtitle?: string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export function Toast({
  title: Title,
  subtitle,
  style,
  contentContainerStyle,
  children,
}: PropsWithChildren<ToastProps>) {
  return (
    <View style={[styles.toast, style]}>
      <View style={[styles.textContainer]}>
        <View
          style={{
            flexDirection: "row",
            gap: Spacing.text.xsmall,
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 16, height: 16 }}
            source={require("@/assets/icons/check-circle-green.png")}
          />
          {Title ? (
            typeof Title === "string" ? (
              <Text style={[styles.title]}>{Title}</Text>
            ) : (
              <Title />
            )
          ) : null}
        </View>

        <Text style={[styles.subtitle]}>{subtitle}</Text>
      </View>
      {children ? (
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    borderRadius: Spacing.block.xsmall,
    padding: Spacing.block.xsmall,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.block.xsmall,
  },
  contentContainer: {},
  textContainer: {
    gap: Spacing.text.xxsmall,
    flexShrink: 1,
  },
  title: {
    fontSize: Font.size.large,
    color: Colors.dark.background,
  },
  subtitle: {
    fontSize: Font.size.small,
    color: Colors.dark.background,
    lineHeight: Font.size.small + 6,
  },
});
