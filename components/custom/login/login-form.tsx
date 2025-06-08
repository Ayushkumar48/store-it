import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  Button,
  Form,
  H4,
  Spinner,
  Text,
  XStack,
  View,
  ScrollView,
} from "tamagui";
import { Link, useRouter } from "expo-router";
import { z } from "zod";
import { themes } from "@/utils/theme";
import { LoginInput } from "./login-input";
import { SESSION_NAME } from "@/utils/interceptor";
import { setItemAsync } from "expo-secure-store";
import { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, validateSession } from "@/utils/api-functions";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const { refetch } = useQuery({
    queryKey: ["validate-session"],
    queryFn: validateSession,
    retry: false,
  });
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const onUsernameChange = (text: string) => {
    setFormData((prev) => ({ ...prev, username: text }));
    if (errors.username) setErrors((e) => ({ ...e, username: undefined }));
  };

  const onPasswordChange = (text: string) => {
    setFormData((prev) => ({ ...prev, password: text }));
    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
  };

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      await setItemAsync(SESSION_NAME, data.sessionId);
      await refetch();
      toast.success(data.message);
      router.replace("/dashboard");
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message || "Something went wrong");
        console.error("Login Error:", err.response?.data);
      } else {
        toast.error("Internal Server Error");
        console.error("Login Error:", err);
      }
    },
  });

  function handleSubmit() {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        username: fieldErrors.username?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    }

    setErrors({});
    login(formData);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View px={20}>
          <H4 color="$accent4" text="center" fontWeight="800">
            {"Login to\nyour account"}
          </H4>

          <Form items="center" p={2} onSubmit={handleSubmit}>
            <LoginInput
              label="Username:"
              placeholder="Username"
              value={formData.username}
              onChangeText={onUsernameChange}
              error={errors.username}
            />

            <LoginInput
              label="Password:"
              placeholder="Password"
              value={formData.password}
              onChangeText={onPasswordChange}
              error={errors.password}
              secureTextEntry
            />

            <Form.Trigger asChild disabled={isPending} style={{ margin: 10 }}>
              <Button
                icon={isPending ? () => <Spinner color="white" /> : undefined}
                theme="accent"
                fontWeight="700"
              >
                Login
              </Button>
            </Form.Trigger>
          </Form>
        </View>

        <XStack items="center" justify="center" gap={5}>
          <Text>Doesn&apos;t have an account yet?</Text>
          <Link
            href="/signup"
            replace
            style={{
              color: themes.light.accent2,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            Create One
          </Link>
        </XStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
