import * as Notifications from "expo-notifications";
import { Button, Popover, Separator, YStack } from "tamagui";
import { PlusSquare, Image, Video } from "@tamagui/lucide-icons";
import { launchImageLibraryAsync } from "expo-image-picker";
import { Alert } from "react-native";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { uploadMedia } from "@/utils/api-functions";
import { useEffect } from "react";
import { MediaType } from "@/types";

export default function NewButton() {
  const queryClient = useQueryClient();
  const UPLOAD_NOTIFICATION_ID = "upload-notification";

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    }
    requestPermissions();
  }, []);

  const uploadSingleMedia = async (asset: any) => {
    const formData = new FormData();
    formData.append("media", {
      uri: asset.uri,
      name: asset.fileName || `file.${asset.type === "video" ? "mp4" : "jpg"}`,
      type:
        asset.mimeType || (asset.type === "video" ? "video/mp4" : "image/jpeg"),
    } as any);

    try {
      const result = await uploadMedia(formData);
      queryClient.setQueryData<
        InfiniteData<{ media: MediaType[]; hasMore: boolean }>
      >(["medias"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [{ media: result.media, hasMore: true }, ...oldData.pages],
          pageParams: [1, ...oldData.pageParams],
        };
      });

      return result;
    } catch (err) {
      console.error(err);
    }
  };

  async function pickMedia(type: "image" | "video") {
    let result = await launchImageLibraryAsync({
      mediaTypes: type === "image" ? ["images"] : ["videos"],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const files = result.assets?.length;
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
              Alert.alert(
                "Upload Started",
                "Files will be uploaded sequentially",
              );

              let uploadedCount = 0;
              let failedCount = 0;
              const totalFiles = result.assets?.length;

              await Notifications.dismissAllNotificationsAsync();
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Video Upload",
                  body: `Preparing to upload ${totalFiles} video${totalFiles > 1 ? "s" : ""}...`,
                  sound: false,
                },
                identifier: UPLOAD_NOTIFICATION_ID,
                trigger: null,
              });

              for (const asset of result.assets) {
                try {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: "Video Upload",
                      body: `Uploading ${uploadedCount + 1} of ${totalFiles}`,
                      sound: false,
                    },
                    identifier: UPLOAD_NOTIFICATION_ID,
                    trigger: null,
                  });

                  await uploadSingleMedia(asset);
                  uploadedCount++;
                } catch (error) {
                  console.error("Individual upload failed:", error);
                  failedCount++;
                }

                if (uploadedCount + failedCount < totalFiles) {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: "Video Upload",
                      body: `Progress: ${uploadedCount} of ${totalFiles} complete`,
                      sound: false,
                    },
                    identifier: UPLOAD_NOTIFICATION_ID,
                    trigger: null,
                  });
                }
              }

              await Notifications.scheduleNotificationAsync({
                content: {
                  title:
                    failedCount > 0
                      ? "Upload Completed with Issues"
                      : "Upload Completed ✅",
                  body:
                    failedCount > 0
                      ? `${uploadedCount} of ${totalFiles} videos uploaded, ${failedCount} failed`
                      : `All ${totalFiles} video${totalFiles > 1 ? "s" : ""} uploaded successfully!`,
                  sound: true,
                },
                identifier: UPLOAD_NOTIFICATION_ID,
                trigger: null,
              });
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
