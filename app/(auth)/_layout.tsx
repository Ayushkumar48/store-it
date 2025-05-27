import { themes } from "@/utils/theme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: themes.light.accent4,
      }}
    />
  );
}
