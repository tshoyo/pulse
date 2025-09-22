import { Image } from "@/components";
import { Colors, Font, Spacing } from "@/constants/theme";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  hideArrow?: boolean;
  block?: boolean;
  bold?: boolean;
  icon?: ImageSourcePropType;
  text?: string;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "tertiary";
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  iconStyle?: ImageStyle;
};

export function Button({
  hideArrow = false,
  block = false,
  bold = false,
  icon,
  text,
  color = "primary",
  size = "large",
  disabled,
  textStyle,
  buttonStyle,
  iconStyle,
  ...props
}: TouchableOpacityProps & ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        color === "primary"
          ? styles.buttonPrimary
          : color === "secondary"
          ? styles.buttonSecondary
          : styles.buttonTertiary,
        !!icon ? styles.buttonIconOnly : null,
        block && styles.buttonBlock,
        size === "medium" && styles.buttonMedium,
        disabled && { opacity: 0.4 },
        buttonStyle,
      ]}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <Image style={[styles.buttonIconProp, iconStyle]} source={icon} />
      )}
      {text && (
        <Text
          style={[
            styles.buttonText,
            bold && { fontWeight: "bold" },
            size === "medium" && styles.buttonMediumText,
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
      {!(icon || hideArrow) && (
        <Image
          style={[styles.buttonIcon, size === "medium" && { marginRight: 0 }]}
          source={require("@/assets/icons/chevron-right-white.png")}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.block.xsmall,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    borderRadius: Spacing.block.xsmall * 2,
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: Colors.brand.primary.color,
  },
  buttonSecondary: {
    backgroundColor: Colors.dark.background,
  },
  buttonTertiary: {
    backgroundColor: Colors.gray.light["900"],
  },
  buttonBlock: {
    borderRadius: Spacing.block.xsmall,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: Font.size.large,
    flex: 1,
    textAlign: "center",
  },
  buttonIconOnly: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonIconProp: {},
  buttonMedium: {
    padding: Spacing.block.xsmall / 2,
    paddingHorizontal: Spacing.block.small / 2,
  },
  buttonMediumText: {
    fontSize: Font.size.small,
  },
  buttonSmall: {},
  buttonSmallText: {},
});
