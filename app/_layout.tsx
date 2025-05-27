// import "../tamagui-web.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "../tamagui.config";
import { Easing } from "react-native-reanimated";

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
            <Slot />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
