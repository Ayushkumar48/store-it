import { SignupForm } from "@/components/custom/signup/signup-form";
import { vh, vw } from "@/utils/theme";
import { YStack, Image } from "tamagui";

export default function Signup() {
  return (
    <YStack self="center" p="$2" gap="$2">
      <Image
        source={require("@/assets/images/login-img.png")}
        width={vw}
        height={vh * 0.3}
      />
      <SignupForm />
    </YStack>
  );
}
