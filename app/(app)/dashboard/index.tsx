import MonthImages from "@/components/custom/dashboard/month-images";
import NewButton from "@/components/custom/dashboard/new-button";
import { MediaType } from "@/types";
import { RefreshCcw } from "@tamagui/lucide-icons";
import { ScrollView, Spinner, Text, YStack, Button } from "tamagui";
import { useQuery } from "@tanstack/react-query";
import { fetchImages } from "@/utils/api-functions";

function Dashboard() {
  const {
    data: medias,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MediaType[]>({
    queryKey: ["medias"],
    queryFn: fetchImages,
    retry: false,
  });

  console.log(medias?.[0]);
  if (isLoading) {
    return (
      <YStack
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <Spinner size="large" color="$accent4" />
      </YStack>
    );
  }

  if (isError) {
    const errorMsg =
      (error as any)?.response?.data?.error || "Internal Server Error!";
    return (
      <YStack items="center" justify="center" flex={1} gap={20} px={20}>
        <Text fontSize={18} color="$red10" text="center">
          {errorMsg}
        </Text>
        <Button
          icon={RefreshCcw}
          onPress={() => refetch()}
          theme="accent"
          variant="outlined"
          color="$accent4"
          fontWeight="700"
        >
          Retry
        </Button>
      </YStack>
    );
  }

  return (
    <>
      <ScrollView>
        <YStack width="100%" gap="$4" mt={8} mb={25} px={6} items="center">
          {medias && medias.length > 0 ? (
            <MonthImages medias={medias} />
          ) : (
            <YStack items="center" py={40}>
              <Text color="$accent4">No images or videos found.</Text>
              <Text color="$accent5" fontSize="$2" mt={4}>
                Upload media using the + button below
              </Text>
            </YStack>
          )}
          {medias && medias.length > 0 && <Text>No more content to show.</Text>}
        </YStack>
      </ScrollView>
      <NewButton />
    </>
  );
}

export default Dashboard;
