import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Input, Label, YStack, Text } from "tamagui";

type LoginInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
};

export function LoginInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
}: LoginInputProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shake animation function
  const shake = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  React.useEffect(() => {
    if (error) {
      shake();
    }
  }, [error, shake]);

  return (
    <Animated.View
      style={{ transform: [{ translateX: shakeAnim }], width: "100%" }}
    >
      <YStack style={styles.input}>
        <Label>{label}</Label>
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          borderColor={error ? "red" : undefined}
          autoCapitalize="none"
        />
        {error && (
          <Text color="red" fontSize="$2" mt={2}>
            {error}
          </Text>
        )}
      </YStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
  },
});
