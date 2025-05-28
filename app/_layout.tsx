import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "../tamagui.config";
import { Easing } from "react-native-reanimated";
import { themes } from "@/utils/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <Toasts
              globalAnimationConfig={{
                duration: 500,
                flingPositionReturnDuration: 200,
                easing: Easing.elastic(1),
              }}
              overrideDarkMode={true}
              preventScreenReaderFromHiding={true}
            />
            <Stack
              screenOptions={{
                headerShown: false,
                statusBarBackgroundColor: themes.light.accent4,
              }}
            />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
