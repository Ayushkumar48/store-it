import { Toast, useToastController, useToastState } from "@tamagui/toast";
import React from "react";
import { Button, Label, Switch, XStack, YStack } from "tamagui";
export default function CurrentToast() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  return (
    <Toast
      animation="200ms"
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
      exitStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
      transform={[{ translateY: 0 }]}
      opacity={1}
      scale={1}
      viewportName={currentToast.viewportName}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
}

const ToastControl = ({ native }: { native: boolean }) => {
  const toast = useToastController();

  return (
    <XStack gap="$2" justifyContent="center">
      <Button
        onPress={() => {
          toast.show("Successfully saved!", {
            message: "Don't worry, we've got your data.",
            native,
            demo: true,
          });
        }}
      >
        Show
      </Button>
      <Button
        onPress={() => {
          toast.hide();
        }}
      >
        Hide
      </Button>
    </XStack>
  );
};

const NativeOptions = ({
  native,
  setNative,
}: {
  native: boolean;
  setNative: (native: boolean) => void;
}) => {
  return (
    <XStack gap="$3">
      <Label size="$1" onPress={() => setNative(false)}>
        Custom
      </Label>
      <Switch
        id="native-toggle"
        nativeID="native-toggle"
        theme="accent"
        size="$1"
        checked={!!native}
        onCheckedChange={(val) => setNative(val)}
      >
        <Switch.Thumb
          animation={[
            "quick",
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Switch>

      <Label size="$1" onPress={() => setNative(true)}>
        Native
      </Label>
    </XStack>
  );
};
