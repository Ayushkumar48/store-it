import MonthImages from "@/components/custom/dashboard/month-images";
import NewButton from "@/components/custom/dashboard/new-button";
import { RefreshCcw } from "@tamagui/lucide-icons";
import { Spinner, Text, YStack, Button } from "tamagui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchImages } from "@/utils/api-functions";
import { useState } from "react";

const PAGE_SIZE = 30;

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["medias"],
    queryFn: ({ pageParam = 1 }) =>
      fetchImages({ pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages?.length + 1 : undefined,
    retry: false,
  });

  const medias = data
    ? data.pages.flatMap((page) =>
        Array.isArray(page.media) ? page.media : [],
      )
    : [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <YStack items="center" justify="center" flex={1}>
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
      {medias && medias?.length > 0 ? (
        <MonthImages
          medias={medias}
          refreshing={refreshing}
          onRefresh={onRefresh}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      ) : (
        <YStack items="center" py={40}>
          <Text color="$accent4">No images or videos found.</Text>
          <Text color="$accent5" fontSize="$2" mt={4}>
            Upload media using the + button below
          </Text>
        </YStack>
      )}
      <NewButton />
    </>
  );
}
