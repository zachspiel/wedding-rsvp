"use client";

import { Carousel, Embla } from "@mantine/carousel";
import {
  ActionIcon,
  Card,
  Center,
  Chip,
  Flex,
  Group,
  Modal,
  MultiSelect,
  rem,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import GoogleDriveImage from "@spiel-wedding/components/guestUpload/GoogleDriveImage";
import { getGuestImages } from "@spiel-wedding/hooks/guestUploadedImages";
import { GoogleDriveFile, UploadedPhotoGallery } from "@spiel-wedding/types/Photo";
import { IconEye, IconShare, IconX } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import useSWR from "swr";
import classes from "../styles.module.css";

interface Props {
  gallery: UploadedPhotoGallery;
}

const GuestGallery = ({ gallery }: Props) => {
  const [mimeFilter, setMimeFilter] = useState<string[] | undefined>([]);
  const [namesFilter, setNameFilter] = useState<string[] | undefined>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>();
  const searchParams = useSearchParams();

  const { data: guestUploadedImages } = useSWR("guestUploadedImages", getGuestImages, {
    fallbackData: [],
  });

  useEffect(() => {
    if (searchParams && searchParams.get("activeIndex")) {
      setScrollToIndex(parseInt(searchParams.get("activeIndex") ?? "0"));
      open();
    }
  }, []);

  useEffect(() => {
    if (!opened) {
      setScrollToIndex(null);
    }

    if (scrollToIndex && embla) {
      embla?.scrollTo(scrollToIndex, true);
    }
  }, [opened, embla]);

  const matchingImagesForFilters = gallery.files
    .filter((file) => {
      if (!mimeFilter || mimeFilter.length === 0) {
        return true;
      }

      return mimeFilter.some((filter) => file.mimeType?.includes(filter));
    })
    .filter((file) => {
      const matchingGuestPhoto = guestUploadedImages.find(
        (image) => image.file_name === file.name
      );

      const name = matchingGuestPhoto
        ? `${matchingGuestPhoto?.first_name} ${matchingGuestPhoto?.last_name}`
        : "";

      if (namesFilter && namesFilter?.length > 0) {
        return namesFilter.includes(name);
      }

      return true;
    });

  const createImageCard = (
    file: GoogleDriveFile,
    index: number,
    height?: string | number
  ) => {
    const matchingGuestPhoto = guestUploadedImages.find(
      (image) => image.file_name === file.name
    );

    const name = matchingGuestPhoto
      ? `${matchingGuestPhoto?.first_name} ${matchingGuestPhoto?.last_name}`
      : "";

    const url = `http://localhost:3000/weddingPhotos/gallery?activeIndex=${index}`;

    return (
      <Stack key={file.id} gap={0} w="100%" id={file.name || undefined}>
        <Card p={0} radius={0} className={classes.card} h={height}>
          <GoogleDriveImage
            id={file?.id ?? ""}
            key={file?.id}
            mimeType={file?.mimeType || ""}
            guestUploadedImages={guestUploadedImages}
          />
        </Card>
        <Flex justify="space-between" className={classes.footer} w="100%" p="xs">
          <Center>
            <Text fz="sm" inline c="white">
              {name}
            </Text>
          </Center>

          <Group gap={8} mr={0}>
            {!opened && (
              <ActionIcon
                className={classes.action}
                onClick={() => {
                  setScrollToIndex(index);
                  open();
                }}
              >
                <IconEye
                  style={{ width: rem(16), height: rem(16) }}
                  color={theme.colors.blue[6]}
                />
              </ActionIcon>
            )}

            <CopyToClipboard
              text={url}
              onCopy={() => {
                showNotification({
                  color: "blue",
                  message: "Image link copied",
                });
              }}
            >
              <ActionIcon className={classes.action}>
                <IconShare
                  style={{ width: rem(16), height: rem(16) }}
                  color={theme.colors.blue[6]}
                />
              </ActionIcon>
            </CopyToClipboard>
          </Group>
        </Flex>
      </Stack>
    );
  };

  return (
    <>
      <Flex justify="space-between" mx="lg" mt="lg">
        <Text fw="bolder" ml="lg" size="lg">
          Filters
        </Text>

        <Text>
          Showing <b>{matchingImagesForFilters.length}</b> of{" "}
          <b>{gallery.files.length}</b> items
        </Text>
      </Flex>

      <Flex ml="lg" w="100%" gap="md">
        <Chip.Group multiple value={mimeFilter} onChange={setMimeFilter}>
          <Group justify="center">
            <Chip value="image">Images</Chip>
            <Chip value="video">Videos</Chip>
          </Group>
        </Chip.Group>

        <MultiSelect
          data={Array.from(
            new Set(
              guestUploadedImages.map((image) => `${image.first_name} ${image.last_name}`)
            )
          )}
          value={namesFilter}
          onChange={setNameFilter}
          placeholder="Filter by guest"
        />
      </Flex>
      <SimpleGrid
        mx="md"
        spacing="xs"
        mt="lg"
        p="sm"
        cols={{
          lg: 4,
          md: 4,
          sm: 2,
          xs: 1,
        }}
      >
        {matchingImagesForFilters.length === 0 && <Text>No matching items found.</Text>}
        {matchingImagesForFilters.map((file, index) => {
          return createImageCard(file, index, 300);
        })}
      </SimpleGrid>

      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "slide-up", duration: 200 }}
        centered
        fullScreen
        size="calc(100vw - 3rem)"
        closeButtonProps={{
          icon: <IconX color="#ffffff" />,
          bg: "#717769",
          size: isMobile ? "lg" : "",
          c: "white",
          p: "sm",
          children: "close",
        }}
        classNames={classes}
      >
        <Carousel
          slideSize={{ base: "100%", lg: "50%" }}
          slideGap={"sm"}
          loop
          classNames={classes}
          getEmblaApi={setEmbla}
        >
          {matchingImagesForFilters.map((file, index) => {
            return (
              <Carousel.Slide key={file.id + "slide"}>
                {createImageCard(file, index, "80vh")}
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Modal>
    </>
  );
};

export default GuestGallery;
