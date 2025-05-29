import { MediaType } from "@/types";
import { Image, Text, View, XStack, YStack } from "tamagui";

export default function MonthImages({ medias }: { medias: MediaType[] }) {
  console.log(medias[0]);
  return (
    <YStack gap="$4">
      <Text fontSize="$5">March, 2025 ({medias.length})</Text>
      <XStack flexWrap="wrap" gap="$1" width="100%" justify="flex-start">
        {medias.map((item, key: number) => (
          <View key={key} aspectRatio={1} flexBasis="23%">
            <Image
              source={{ uri: item.presignedUrl }}
              width="100%"
              height="100%"
              borderRadius="$2"
              objectFit="cover"
            />
          </View>
        ))}
      </XStack>
    </YStack>
  );
}
