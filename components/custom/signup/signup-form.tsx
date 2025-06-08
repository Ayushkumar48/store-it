import { themes } from "@/utils/theme";
import { toast } from "@backpackapp-io/react-native-toast";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  Form,
  Spinner,
  H4,
  View,
  ScrollView,
  Text,
  XStack,
} from "tamagui";
import { z } from "zod";
import { SignupInput } from "./signup-input";
import { SESSION_NAME } from "@/utils/interceptor";
import { setItemAsync } from "expo-secure-store";
import { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signupUser, validateSession } from "@/utils/api-functions";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { refetch } = useQuery({
    queryKey: ["validate-session"],
    queryFn: validateSession,
    retry: false,
  });
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupData, string>>
  >({});

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: async (data) => {
      await setItemAsync(SESSION_NAME, data.sessionId);
      await refetch();
      toast.success(data.message);
      router.replace("/dashboard");
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message || "Something went wrong");
        console.error("Signup Error:", err.response?.data);
      } else {
        toast.error("Internal Server Error");
        console.error("Signup Error:", err);
      }
    },
  });

  function handleChange(field: keyof SignupData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit() {
    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: zodErrors.name?.[0],
        username: zodErrors.username?.[0],
        password: zodErrors.password?.[0],
      });
      return;
    }
    setErrors({});
    signupMutation.mutate(formData);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View px={20}>
          <H4 color="$accent4" text="center" fontWeight="800">
            {"Create\nyour account"}
          </H4>

          <Form onSubmit={handleSubmit} items="center" p={2}>
            <SignupInput
              id="name"
              label="Name:"
              placeholder="Name"
              value={formData.name}
              onChangeText={(val) => handleChange("name", val)}
              error={errors.name}
            />
            <SignupInput
              id="username"
              label="Username:"
              placeholder="Username"
              value={formData.username}
              onChangeText={(val) => handleChange("username", val)}
              error={errors.username}
            />
            <SignupInput
              id="password"
              label="Password:"
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(val) => handleChange("password", val)}
              error={errors.password}
            />
            <Form.Trigger
              asChild
              disabled={signupMutation.isPending}
              style={{ margin: 10 }}
            >
              <Button
                icon={
                  signupMutation.isPending
                    ? () => <Spinner color="white" />
                    : undefined
                }
                theme="accent"
                fontWeight="700"
              >
                Create Account
              </Button>
            </Form.Trigger>
          </Form>
        </View>
        <XStack items="center" justify="center" gap={5}>
          <Text>Already have an account?</Text>
          <Link
            href="/login"
            replace
            style={{
              color: themes.light.accent2,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            Login here
          </Link>
        </XStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
