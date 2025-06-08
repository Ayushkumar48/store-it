import { MediaType } from "@/types";
import { Sheet } from "@tamagui/sheet";
import { Dispatch, SetStateAction, useState } from "react";
import PagerView from "react-native-pager-view";
import { Image, View } from "tamagui";
import { VideoPlayer } from "./video-player";

export function CustomSheet({
  open,
  setOpen,
  medias,
  setSelectedIndex,
  selectedIndex,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  medias: MediaType[];
  setSelectedIndex: Dispatch<SetStateAction<number | null>>;
  selectedIndex: number;
}) {
  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={(isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSelectedIndex(null);
        }
      }}
      snapPoints={[85, 50, 25]}
      snapPointsMode="percent"
      dismissOnSnapToBottom
      position={0}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        bg="$shadow6"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Frame
        p="$4"
        justify="center"
        items="center"
        gap="$5"
        flex={1}
        bg={"black"}
      >
        <MediaShow
          medias={medias}
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
        />
      </Sheet.Frame>
    </Sheet>
  );
}

export function MediaShow({
  medias,
  setSelectedIndex,
  selectedIndex,
}: {
  medias: MediaType[];
  setSelectedIndex: Dispatch<SetStateAction<number | null>>;
  selectedIndex: number;
}) {
  const [currentPage, setCurrentPage] = useState(selectedIndex);

  return (
    <PagerView
      style={{
        flex: 1,
        backgroundColor: "black",
        height: "100%",
        width: "100%",
      }}
      initialPage={selectedIndex}
      onPageSelected={(e) => {
        const newPosition = e.nativeEvent.position;
        setSelectedIndex(newPosition);
        setCurrentPage(newPosition);
      }}
    >
      {medias.map((media, index) => (
        <View
          key={index}
          flex={1}
          justify="center"
          items="center"
          height="100%"
          width="100%"
        >
          {media.mediaType === "video" ? (
            <VideoPlayer
              videoUrl={media.cloudfrontUrl}
              isVisible={currentPage === index}
            />
          ) : (
            <Image
              source={{ uri: media.cloudfrontUrl }}
              width="100%"
              height="100%"
              objectFit="contain"
            />
          )}
        </View>
      ))}
    </PagerView>
  );
}
