import { MediaType } from "@/types";
import { Image, Text, View, XStack, YStack } from "tamagui";
import { VideoThumbnail } from "./video-thumbnail";
import { useState } from "react";
import { SheetDemo } from "./sheet";

export default function MonthImages({ medias }: { medias: MediaType[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <YStack gap="$4">
        <Text fontSize="$5">March, 2025 ({medias.length})</Text>
        <XStack flexWrap="wrap" gap="$1" width="100%" justify="flex-start">
          {medias.map((item, key) => {
            const isVideo = item.mediaType === "video";

            return (
              <View
                key={key}
                aspectRatio={1}
                flexBasis="23%"
                position="relative"
                onPress={() => {
                  setOpen(true);
                  setSelectedIndex(key);
                }}
              >
                {isVideo ? (
                  <VideoThumbnail videoUrl={item.cloudfrontUrl} />
                ) : (
                  <Image
                    source={{ uri: item.cloudfrontUrl }}
                    width="100%"
                    height="100%"
                    borderRadius="$2"
                    objectFit="cover"
                  />
                )}
                {isVideo && (
                  <XStack
                    position="absolute"
                    b={4}
                    r={4}
                    bg="rgba(0,0,0,0.5)"
                    px={6}
                    py={2}
                    rounded="$1"
                    justify="center"
                    items="center"
                  >
                    <Text color="white" fontSize="$2">
                      ▶
                    </Text>
                  </XStack>
                )}
              </View>
            );
          })}
        </XStack>
      </YStack>
      {selectedIndex !== null && (
        <SheetDemo
          open={open}
          setOpen={setOpen}
          medias={medias}
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
        />
      )}
    </>
  );
}
