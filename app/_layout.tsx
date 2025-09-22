import { SplashScreenController } from "@/components/splash-screen-controller";
import AuthProvider from "@/providers/auth-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  // const { isLoggedIn } = useAuthContext();
  const { isLoggedIn } = { isLoggedIn: true };
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
export default function RootLayout() {
  const colorScheme = "light" as "light" | "dark"; //useColorScheme();
  const [loaded] = useFonts({
    //SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <GestureHandlerRootView>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
