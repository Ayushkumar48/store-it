import { User } from "@/types";
import { themes } from "@/utils/theme";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";

export default function AuthLayout() {
  const queryClient = useQueryClient();
  const userSession = queryClient.getQueryData<{
    message: string;
    success: boolean;
    user: User;
  }>(["validate-session"]);
  const router = useRouter();
  if (userSession?.user) {
    router.replace("/dashboard");
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: themes.light.accent4,
      }}
    />
  );
}
