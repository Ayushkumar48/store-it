import { useEffect, useState } from "react";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Image, View } from "tamagui";

export function VideoThumbnail({ videoUrl }: { videoUrl: string }) {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
          time: 1500,
        });
        setThumbnailUri(uri);
      } catch (e) {
        console.warn("Could not generate thumbnail", e);
      }
    };

    generateThumbnail();
  }, [videoUrl]);

  return (
    <View width="100%" height="100%">
      {thumbnailUri ? (
        <Image
          source={{ uri: thumbnailUri }}
          width="100%"
          height="100%"
          borderRadius="$2"
          objectFit="cover"
        />
      ) : (
        <View width="100%" height="100%" bg="#ccc" />
      )}
    </View>
  );
}
