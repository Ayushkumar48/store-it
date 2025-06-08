import { themes } from "@/utils/theme";
import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";

export default function Layout() {
  const queryClient = useQueryClient();
  const userSession = queryClient.getQueryData<{
    message: string;
    success: boolean;
    user: User;
  }>(["validate-session"]);
  const router = useRouter();
  if (!userSession?.user) {
    router.replace("/login");
  }
  return (
    <Tabs
      screenOptions={{
        title: "Store It",
        headerTitleStyle: {
          color: themes.dark.color,
          fontWeight: "700",
        },
        tabBarActiveTintColor: themes.light.accent2,
        headerStyle: { backgroundColor: themes.light.accent4 },
        tabBarStyle: {
          bottom: 16,
          marginHorizontal: 16,
          borderRadius: 16,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/edit/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
