import { Text, XStack, Button, YStack, H5, Spinner } from "tamagui";
import { LogIn, UserPlus, RefreshCcw } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { validateSession } from "@/utils/api-functions";
import { toast } from "@backpackapp-io/react-native-toast";
import { isAxiosError } from "axios";

export default function Index() {
  const router = useRouter();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["validate-session"],
    queryFn: validateSession,
    retry: false,
  });
  useEffect(() => {
    if (error) {
      if (isAxiosError(error) && error?.response?.status !== 500) {
        toast.error(
          error.response?.data.message || "Session expired. Please login.",
        );
      }
      router.replace("/login");
    }
    if (data?.success) {
      router.replace("/dashboard");
    }
  }, [data, router, error]);

  if (isLoading) {
    return (
      <YStack
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <Spinner size="large" color="$accent4" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack items="center" justify="center" flex={1} gap={20} px={20}>
        <Text fontSize={18} color="$red10" text="center">
          {error instanceof Error
            ? error.message
            : "Failed to connect to server. Please try again."}
        </Text>
        <Button
          icon={RefreshCcw}
          onPress={() => refetch()}
          theme="accent"
          variant="outlined"
          color="$accent4"
          fontWeight="700"
        >
          Retry
        </Button>
      </YStack>
    );
  }

  return (
    <YStack px={30} gap={40} flex={1} justify="center">
      <H5>
        Welcome to{" "}
        <Text color="$accent4" fontWeight="800">
          Store It
        </Text>
      </H5>
      <Text fontSize={18} text="justify">
        A free and open-source storage for storing your favorite Photos, Videos
        and Files.
      </Text>
      <XStack gap={10} justify="space-between">
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
          color="$accent4"
          fontWeight="800"
        >
          Signup
        </Button>
      </XStack>
    </YStack>
  );
}
