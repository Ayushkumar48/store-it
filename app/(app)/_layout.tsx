import { themes } from "@/utils/theme";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Store It",
          headerTitleStyle: {
            color: themes.dark.color,
            fontWeight: "700",
          },
          statusBarBackgroundColor: themes.light.accent4,
          headerStyle: { backgroundColor: themes.light.accent4 },
        }}
      />
    </Stack>
  );
}
