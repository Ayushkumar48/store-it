import { View, Image, Text, Button } from "tamagui";
import PagerView from "react-native-pager-view";
import { useRef } from "react";
import { MediaType } from "@/types";
import { vh, vw } from "@/utils/theme";
import { VideoPlayer } from "./video-player";

export default function FullscreenMediaViewer({
  medias,
  index,
  onClose,
}: {
  medias: MediaType[];
  index: number;
  onClose: () => void;
}) {
  const pagerRef = useRef<PagerView>(null);

  return (
    <View
      bg="black"
      position="absolute"
      t={0}
      l={0}
      width={vw}
      height={vh}
      z={999}
    >
      <PagerView initialPage={index} style={{ flex: 1 }} ref={pagerRef}>
        {medias.map((media, i) => {
          const isVideo = media.mediaType === "video";

          return (
            <View
              key={i.toString()}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                key={i}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isVideo ? (
                  <VideoPlayer videoUrl={media.presignedUrl} />
                ) : (
                  <Image
                    source={{ uri: media.presignedUrl }}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                )}
              </View>
            </View>
          );
        })}
      </PagerView>

      <Button
        position="absolute"
        t={50}
        r={20}
        onPress={onClose}
        bg="rgba(0,0,0,0.5)"
        px={10}
        py={6}
        rounded="$2"
      >
        <Text color="white" fontSize="$4">
          ✕
        </Text>
      </Button>
    </View>
  );
}
