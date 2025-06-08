import { SignupForm } from "@/components/custom/signup/signup-form";
import { User } from "@/types";
import { vh, vw } from "@/utils/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { YStack, Image } from "tamagui";

export default function Signup() {
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
    <YStack self="center" p="$2" gap="$2">
      <Image
        source={require("../../../assets/images/loginimg.png")}
        width={vw}
        height={vh * 0.3}
      />
      <SignupForm />
    </YStack>
  );
}
