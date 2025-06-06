import { useState } from "react";
import { Button, Form, Input, Spinner, Text, View, YStack } from "tamagui";

export default function EditAccount() {
  const [submitting, setSubmitting] = useState(false);
  return (
    <View px="$4" py="$6" flex={1}>
      <Text text="center" fontSize="$8">
        Edit Your Account Details
      </Text>
      <Form flex={1} items="center" asChild>
        <YStack>
          <Input width="100%" />
          <Form.Trigger asChild disabled={submitting}>
            <Button
              bg="$accent4"
              color="white"
              fontWeight="700"
              icon={submitting ? () => <Spinner color="white" /> : undefined}
            >
              Submit
            </Button>
          </Form.Trigger>
        </YStack>
      </Form>
    </View>
  );
}
