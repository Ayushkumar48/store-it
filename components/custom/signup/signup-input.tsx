import React, { useEffect, useRef, useCallback } from "react";
import { Animated, StyleSheet } from "react-native";
import { Input, Label, YStack, Text } from "tamagui";

interface SignupInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  id: string;
}

export function SignupInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  id,
}: SignupInputProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
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

  useEffect(() => {
    if (error) {
      shake();
    }
  }, [error, shake]);

  return (
    <YStack style={styles.input}>
      <Label htmlFor={id}>{label}</Label>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          borderColor={error ? "#f87171" : undefined}
        />
      </Animated.View>
      {error ? (
        <Text color="#f87171" fontSize="$2" marginStart={2}>
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
  },
});
