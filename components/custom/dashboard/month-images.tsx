import { MediaType } from "@/types";
import { Image, Text, View, XStack } from "tamagui";
import { VideoThumbnail } from "./video-thumbnail";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { CustomSheet } from "./sheet";

type Props = {
  medias: MediaType[];
  refreshing: boolean;
  onRefresh: () => void;
};

export default function MonthImages({ medias, refreshing, onRefresh }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <FlatList
        data={medias}
        numColumns={4}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 8,
          marginBottom: 8,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        ListHeaderComponent={
          <Text fontSize="$5" pb={12}>
            All Photos and Videos
          </Text>
        }
        renderItem={({ item, index }) => (
          <MediaItem
            media={item}
            index={index}
            setOpen={setOpen}
            setSelectedIndex={setSelectedIndex}
          />
        )}
      />

      {selectedIndex !== null && (
        <CustomSheet
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

function MediaItem({
  media,
  index,
  setOpen,
  setSelectedIndex,
}: {
  media: MediaType;
  index: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const isVideo = media.mediaType === "video";

  return (
    <View
      key={index}
      aspectRatio={1}
      flexBasis="23%"
      position="relative"
      onPress={() => {
        setOpen(true);
        setSelectedIndex(index);
      }}
    >
      {isVideo ? (
        <VideoThumbnail videoUrl={media.cloudfrontUrl} />
      ) : (
        <Image
          source={{ uri: media.cloudfrontUrl }}
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
}
