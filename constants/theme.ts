/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  brand: {
    primary: {
      color: "#4C5DF9",
      tint: "#1E2456",
      highlight: "#3849E0",
    },
  },
  light: {
    text: "#161A21",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  gray: {
    dark: {
      100: "#161A21",
      500: "#797979",
    },
    light: {
      100: "#9FA1B0",
      800: "#C9C9C9",
      900: "#F6F6F6",
    },
  },
  dark: {
    text: "#FFFFFF",
    background: "#090909",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
} as const;

export const Spacing = {
  block: {
    large: 32,
    medium: 24,
    small: 16,
    xsmall: 12,
    xxsmall: 8,
    xxxsmall: 6,
  },
  text: {
    xxlarge: 32,
    xlarge: 24,
    large: 24,
    medium: 16,
    small: 12,
    xsmall: 8,
    xxsmall: 4,
  },
} as const;

export const Font = {
  size: {
    xlarge: 24,
    large: 18,
    medium: 14,
    small: 12,
  },
  ...Platform.select({
    ios: {
      /** iOS `UIFontDescriptorSystemDesignDefault` */
      sans: "system-ui",
      /** iOS `UIFontDescriptorSystemDesignSerif` */
      serif: "ui-serif",
      /** iOS `UIFontDescriptorSystemDesignRounded` */
      rounded: "ui-rounded",
      /** iOS `UIFontDescriptorSystemDesignMonospaced` */
      mono: "ui-monospace",
    },
    default: {
      sans: "normal",
      serif: "serif",
      rounded: "normal",
      mono: "monospace",
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded:
        "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
} as const;
