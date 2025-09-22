import { Colors } from "@/constants/theme";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "./image";

type AvatarProps = {
  size?: number;
  avatar: ImageSourcePropType;
  badgeImage?: ImageSourcePropType;
  badgeColor?: string;
  dark?: boolean;
  avatarContainerStyle?: ViewStyle;
  avatarStyle?: ImageStyle;
};

const badgeSize = 18;

export function Avatar({
  size = 40,
  avatar,
  badgeImage,
  badgeColor = Colors.brand.primary.color,
  dark,
  avatarContainerStyle,
  avatarStyle,
}: AvatarProps) {
  const badgeScale = size / 40;
  return (
    <View style={[styles.avatarContainer, avatarContainerStyle]}>
      <Image
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size },
          avatarStyle,
        ]}
        source={avatar}
      />
      {badgeImage && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor,
              borderColor: dark
                ? Colors.dark.background
                : Colors.light.background,
              borderWidth: badgeSize * badgeScale * (1 / 8),
              width: badgeSize * badgeScale,
              height: badgeSize * badgeScale,
              bottom: ((badgeSize * badgeScale) / 2) * -1,
              borderRadius: (badgeSize * badgeScale) / 2,
            },
          ]}
        >
          <Image style={styles.badgeImage} source={badgeImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    left: 0,
    alignItems: "center",
    justifyContent: "space-around",
  },
  badgeImage: {},
  avatar: {},
  avatarContainer: {},
});
