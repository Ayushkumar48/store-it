import * as Notifications from "expo-notifications";
import { Button, Popover, Separator, YStack } from "tamagui";
import { PlusSquare, Image, Video } from "@tamagui/lucide-icons";
import { launchImageLibraryAsync } from "expo-image-picker";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@/types";
import { uploadMedia } from "@/utils/api-functions";
import { useEffect } from "react";

export default function NewButton() {
  const queryClient = useQueryClient();
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    }
    requestPermissions();
  }, []);

  const uploadMediaMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (data) => {
      queryClient.setQueryData<MediaType[]>(["medias"], (old = []) => [
        ...data.media,
        ...old,
      ]);
      console.log(data);
    },
    onError: (error: any) => {
      console.error("Upload failed:", error.response?.data || error);
      Alert.alert(
        "Upload Failed",
        error.response?.data?.error || "Something went wrong during upload",
      );
    },
  });

  async function pickMedia(type: "image" | "video") {
    let result = await launchImageLibraryAsync({
      mediaTypes: type === "image" ? ["images"] : ["videos"],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const files = result.assets.length;
      Alert.alert(
        "Selected Files",
        `Total ${files === 1 ? files + " file" : files + " files"} selected`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Upload",
            onPress: async () => {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Uploading! 📤",
                  body: "Uploading the content to cloud.",
                  sound: true,
                },
                trigger: null,
              });
              const formData = new FormData();

              result.assets.forEach((asset, index) => {
                formData.append("media", {
                  uri: asset.uri,
                  name:
                    asset.fileName ||
                    `file-${index}.${asset.type === "video" ? "mp4" : "jpg"}`,
                  type:
                    asset.mimeType ||
                    (asset.type === "video" ? "video/mp4" : "image/jpeg"),
                } as any);
              });

              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Uploaded ✅",
                  body: "Successfully uploaded to cloud!",
                  sound: true,
                },
                trigger: null,
              });
              uploadMediaMutation.mutate(formData);
            },
          },
        ],
      );
    }
  }
  return (
    <Popover placement="top">
      <Popover.Trigger asChild>
        <Button
          elevation={20}
          rounded={10}
          position="absolute"
          b={30}
          r={20}
          theme="accent"
          color="white"
          icon={PlusSquare}
          scaleIcon={1.5}
        />
      </Popover.Trigger>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        p={0}
        elevate
        enterStyle={{ opacity: 0, y: -10 }}
        exitStyle={{ opacity: 0, y: -10 }}
        animation="quick"
      >
        <YStack>
          <Popover.Close
            asChild
            p="$2"
            justify="flex-start"
            display="flex"
            items="center"
            flexDirection="row"
            onPress={() => pickMedia("image")}
          >
            <Button unstyled icon={Image} size="$4" scaleIcon={1.2}>
              Photos
            </Button>
          </Popover.Close>
          <Separator />
          <Popover.Close
            asChild
            p="$2"
            justify="flex-start"
            display="flex"
            items="center"
            flexDirection="row"
            onPress={() => pickMedia("video")}
          >
            <Button unstyled icon={Video} size="$4" scaleIcon={1.2}>
              Videos
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
