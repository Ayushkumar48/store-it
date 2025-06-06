import { User } from "@/types";
import { Edit3 } from "@tamagui/lucide-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Button, Form, Text, View, XStack, YStack } from "tamagui";

export default function Account() {
  const queryClient = useQueryClient();
  const userSession = queryClient.getQueryData<{
    message: string;
    success: boolean;
    user: User;
  }>(["validate-session"]);
  const router = useRouter();
  return (
    <View px="$4" py="$6" flex={1}>
      <Text text="center" fontSize="$8">
        View Your Account
      </Text>
      <Form flex={1}>
        <XStack items="center" gap="$4" flex={1}>
          <YStack gap="$3">
            <Text fontSize="$6">Name:</Text>
            <Text fontSize="$6">Username:</Text>
          </YStack>
          <YStack gap="$3">
            <Text fontSize="$6">{userSession?.user.name}</Text>
            <Text fontSize="$6">{userSession?.user.username}</Text>
          </YStack>
        </XStack>
      </Form>
      <Button
        onPress={() => router.push("/account/edit")}
        display="inline-flex"
        icon={Edit3}
        bg="$accent4"
        color="white"
        fontWeight="800"
      >
        Edit Account Details
      </Button>
    </View>
  );
}
