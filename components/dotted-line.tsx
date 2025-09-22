import { Colors } from "@/constants/theme";
import { View } from "react-native";

export function DottedLine() {
  return (
    <View
      style={{
        height: 0,
        borderTopWidth: 0.5,
        borderStyle: "dashed",
        borderColor: Colors.gray.dark["500"],
        flex: 1,
        width: "100%",
      }}
    ></View>
  );
}
