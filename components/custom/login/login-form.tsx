import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { toast } from "@backpackapp-io/react-native-toast";
import { Button, Form, H4, Spinner, Text, XStack } from "tamagui";
import { Link, useRouter } from "expo-router";
import { z } from "zod";
import { themes } from "@/utils/theme";
import { LoginInput } from "./login-input";
import api, { SESSION_NAME } from "@/utils/interceptor";
import { setItemAsync } from "expo-secure-store";
import { isAxiosError } from "axios";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const onUsernameChange = (text: string) => {
    setFormData((prev) => ({ ...prev, username: text }));
    if (errors.username) {
      setErrors((e) => ({ ...e, username: undefined }));
    }
  };

  const onPasswordChange = (text: string) => {
    setFormData((prev) => ({ ...prev, password: text }));
    if (errors.password) {
      setErrors((e) => ({ ...e, password: undefined }));
    }
  };

  async function handleSubmit() {
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
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      if (data.sessionId) {
        await setItemAsync(SESSION_NAME, data.sessionId);
      }
      toast.success(data.message);
      router.replace("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data.message || "Something went wrong");
        console.error("Login Error:", err?.response?.data);
      } else {
        toast.error("Internal Server Error");
        console.error("Login Error:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formWrapper}>
          <H4 color="$accent4" text="center" fontWeight="800">
            {"Login to\nyour account"}
          </H4>

          <Form style={styles.form} onSubmit={handleSubmit}>
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

            <Form.Trigger asChild disabled={loading} style={{ margin: 10 }}>
              <Button
                icon={loading ? () => <Spinner color="white" /> : undefined}
                theme="accent"
                fontWeight="700"
              >
                Login
              </Button>
            </Form.Trigger>
          </Form>
        </View>

        <XStack style={styles.bottomText}>
          <Text>Doesn&apos;t have an account yet?</Text>
          <Link href="/signup" replace style={styles.bottomLink}>
            Create One
          </Link>
        </XStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: 20,
  },
  form: {
    alignItems: "center",
    padding: 2,
  },
  bottomText: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  bottomLink: {
    color: themes.light.accent2,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
