import { LoginForm } from "@/components/custom/login/login-form";
import { vh, vw } from "@/utils/theme";
import { YStack, Image } from "tamagui";

export default function Signup() {
  return (
    <YStack style={{ padding: "$2", alignSelf: "center" }} gap="$2">
      <Image
        source={require("@/assets/images/login-img.png")}
        style={{ width: vw, height: vh * 0.3 }}
      />
      <LoginForm />
    </YStack>
  );
}
