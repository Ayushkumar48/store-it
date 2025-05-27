import { themes } from "@/utils/theme";
import { toast } from "@backpackapp-io/react-native-toast";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
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
import api, { SESSION_NAME } from "@/utils/interceptor";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { isAxiosError } from "axios";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupData, string>>
  >({});

  function handleChange(field: keyof SignupData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit() {
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
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", formData);
      const sessionId = data.sessionId;
      await setItemAsync(SESSION_NAME, sessionId);
      toast.success(data.message);
      router.replace("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data.message || "Something went wrong");
        console.error("Signup Error:", err?.response?.data);
      } else {
        toast.error("Internal Server Error");
        console.error("Signup Error:", err);
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
            {"Create\nyour account"}
          </H4>

          <Form style={styles.form} onSubmit={handleSubmit}>
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
            <Form.Trigger asChild disabled={loading} style={{ margin: 10 }}>
              <Button
                icon={loading ? () => <Spinner color="white" /> : undefined}
                theme="accent"
                fontWeight="700"
              >
                Create Account
              </Button>
            </Form.Trigger>
          </Form>
        </View>
        <XStack style={styles.bottomText}>
          <Text>Already have an account?</Text>
          <Link href="/login" replace style={styles.bottomLink}>
            Login here
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
