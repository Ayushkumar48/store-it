import { Text, XStack, Button, YStack, H5, Spinner } from "tamagui";
import { LogIn, UserPlus, RefreshCcw } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import api, { SESSION_NAME } from "@/utils/interceptor";
import { isAxiosError } from "axios";
import { getItemAsync } from "expo-secure-store";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const checkUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionId = await getItemAsync(SESSION_NAME);
      if (sessionId) {
        const { data } = await api.post("/validate", sessionId);
        if (data?.success) {
          router.replace("/dashboard");
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
      if (isAxiosError(err)) {
        console.error(err?.response?.data);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (loading) {
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
      <YStack
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text fontSize={18} color="$red10" text="center">
          {error}
        </Text>
        <Button
          icon={RefreshCcw}
          onPress={checkUser}
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
