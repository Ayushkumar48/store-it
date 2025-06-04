import React, { useEffect } from "react";
import { View } from "tamagui";
import { useVideoPlayer, VideoView } from "expo-video";

export function VideoPlayer({
  videoUrl,
  isVisible = true,
}: {
  videoUrl: string;
  isVisible?: boolean;
}) {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (!isVisible) {
      player.pause();
    }
  }, [isVisible, player]);

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <VideoView
        style={{ width: "100%", height: "100%" }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
        contentFit="contain"
      />
    </View>
  );
}
