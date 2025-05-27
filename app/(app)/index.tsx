import { Text, XStack, Button, YStack, H5, Spinner } from "tamagui";
import { LogIn, UserPlus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { validateUser } from "@/utils/interceptor";
import { toast } from "@backpackapp-io/react-native-toast";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    validateUser()
      .then((valid) => {
        if (valid) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, [router]);

  return (
    <>
      {loading ? (
        <YStack
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Spinner size="large" color="$accent4" />
        </YStack>
      ) : (
        <YStack
          style={{ paddingHorizontal: 30 }}
          gap={40}
          flex={1}
          justify="center"
        >
          <H5>
            Welcome to{" "}
            <Text color={"$accent4"} fontWeight={"800"}>
              Store It
            </Text>
          </H5>
          <Text style={{ fontSize: 18, textAlign: "justify" }}>
            A free and open-source storage for storing you favorite Photos,
            Videos and Files.
          </Text>
          <XStack gap={10} justify={"space-between"}>
            <Button
              onPress={() => router.push("/login")}
              icon={LogIn}
              size="$4.5"
              theme="accent"
              fontWeight="800"
            >
              Login
            </Button>
            <Button
              onPress={() => router.push("/signup")}
              size="$4.5"
              variant="outlined"
              icon={UserPlus}
              theme="accent"
              color={"$accent4"}
              fontWeight="800"
            >
              Signup
            </Button>
          </XStack>
        </YStack>
      )}
    </>
  );
}
