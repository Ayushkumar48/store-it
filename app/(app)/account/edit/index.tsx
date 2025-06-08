import { User } from "@/types";
import api from "@/utils/interceptor";
import { toast } from "@backpackapp-io/react-native-toast";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import {
  Button,
  Form,
  Input,
  ScrollView,
  Spinner,
  Text,
  View,
  YStack,
} from "tamagui";

export default function EditAccount() {
  const queryClient = useQueryClient();
  const userSession = queryClient.getQueryData<{
    message: string;
    success: boolean;
    user: User;
  }>(["validate-session"]);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(userSession?.user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; password?: boolean }>(
    {},
  );
  useFocusEffect(
    useCallback(() => {
      return () => {
        setName(userSession?.user?.name || "");
        setPassword("");
        setErrors({});
        setSubmitting(false);
        setShowPassword(false);
      };
    }, [userSession?.user?.name]),
  );
  async function handleSubmit() {
    setSubmitting(true);
    if (password !== "") {
      if (password.includes(" ") || password.length < 6) {
        setErrors((prev) => ({ ...prev, password: true }));
        setSubmitting(false);
        return;
      }
    }
    if (name.length < 1) {
      setErrors((prev) => ({ ...prev, name: true }));
      setSubmitting(false);
      return;
    }
    setErrors({});
    try {
      const res = await api.post("/edit-profile", {
        name: name,
        password: password,
        userId: userSession?.user.id,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Profile updated.");
        queryClient.invalidateQueries({ queryKey: ["validate-session"] });
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err.response?.data.message || "Error while updating profile.",
        );
      } else {
        toast.error("Internal Error");
      }
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <Text text="center" pt="$6" fontSize="$8">
        Edit Your Account Details
      </Text>
      <ScrollView
        contentContainerStyle={{
          px: "$4",
          pt: "$8",
          pb: "$14",
          minH: "100%",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Form flex={1} items="center" asChild onSubmit={handleSubmit}>
          <YStack flex={1} gap="$6">
            <YStack gap="$4" width="100%">
              <YStack width="100%" gap="$2">
                <Text>Name:</Text>
                <Input
                  width="100%"
                  value={name}
                  onChangeText={(n) => {
                    setName(n);
                  }}
                />
                {errors?.name && <Text color="red">Name is required</Text>}
              </YStack>
              <YStack width="100%" gap="$2">
                <Text>Username:</Text>
                <Input
                  width="100%"
                  disabled
                  opacity={0.7}
                  value={userSession?.user.username || ""}
                  fontWeight="900"
                />
              </YStack>
              <YStack width="100%" gap="$2">
                <Text>Password:</Text>
                <View width="100%" position="relative">
                  <Input
                    flex={1}
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={(p) => {
                      setPassword(p);
                    }}
                    pr="$6"
                  />

                  <Button
                    position="absolute"
                    t="50%"
                    r="$0"
                    transform={[{ translateY: "-50%" }]}
                    opacity={0.8}
                    px="$2"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </View>
                {errors?.password && (
                  <Text color="red">
                    Password must atleast 6 characters without space.
                  </Text>
                )}
              </YStack>
            </YStack>
            <Form.Trigger asChild disabled={submitting}>
              <Button
                bg="$accent4"
                color="white"
                fontWeight="700"
                icon={submitting ? () => <Spinner color="white" /> : undefined}
              >
                {submitting ? "Submitting" : "Submit"}
              </Button>
            </Form.Trigger>
          </YStack>
        </Form>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
