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
  Skeleton,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { createClient } from "@spiel-wedding/database/client";
import { getGuestImages } from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestImageWithLikes } from "@spiel-wedding/types/Photo";
import { IconEye, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import classes from "../styles.module.css";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const GuestGallery = ({ searchParams }: Props) => {
  const [mimeFilter, setMimeFilter] = useState<string[] | undefined>([]);
  const [namesFilter, setNameFilter] = useState<string[] | undefined>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>();

  const { data: gallery, isLoading } = useSWR("guest_gallery", getGuestImages, {
    fallbackData: [],
  });

  useEffect(() => {
    if (!opened) {
      setScrollToIndex(null);
    }

    if (scrollToIndex && embla) {
      embla?.scrollTo(scrollToIndex, true);
    }
  }, [opened, embla]);

  const matchingImagesForFilters = gallery
    .filter((file) => {
      if (!mimeFilter || mimeFilter.length === 0) {
        return true;
      }

      return mimeFilter.some((filter) => file.mime_type.includes(filter));
    })
    .filter((file) => {
      const name = file.first_name + " " + file.last_name;

      if (namesFilter && namesFilter?.length > 0) {
        return namesFilter.includes(name);
      }

      return true;
    });

  const createImageCard = (
    file: GuestImageWithLikes,
    index: number,
    height?: string | number
  ) => {
    const supabase = createClient();
    const name = file.first_name + " " + file.last_name;
    const { data } = supabase.storage.from("guest_gallery").getPublicUrl(file.file_name);

    return (
      <div key={file.file_id} id={file.file_name || undefined}>
        <Card p={0} radius={0} className={classes.card} h={height}>
          {file.mime_type.includes("video") ? (
            <video controls height="100%" width="100%">
              <source src={data.publicUrl} type={file.mime_type} />
            </video>
          ) : (
            <Image
              src={data.publicUrl}
              fill
              style={{
                objectFit: "fill",
                objectPosition: "top",
                transform: "translate3d(0, 0, 0)",
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              alt={file.file_id}
            />
          )}
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
          </Group>
        </Flex>
      </div>
    );
  };

  return (
    <>
      <Flex justify="space-between" mx="lg" mt="lg" wrap="wrap">
        <Text fw="bolder" ml="lg" size="lg">
          Filters
        </Text>

        <Text>
          Showing <b>{matchingImagesForFilters.length}</b> of <b>{gallery.length}</b>{" "}
          items
        </Text>
      </Flex>

      <Flex ml="lg" w="100%" gap="md" wrap="wrap">
        <Chip.Group multiple value={mimeFilter} onChange={setMimeFilter}>
          <Group justify="center">
            <Chip value="image">Images</Chip>
            <Chip value="video">Videos</Chip>
          </Group>
        </Chip.Group>

        <MultiSelect
          data={Array.from(
            new Set(gallery.map((image) => `${image.first_name} ${image.last_name}`))
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

        {isLoading && (
          <>
            <Skeleton width={300} height={300} />
            <Skeleton width={300} height={300} />
            <Skeleton width={300} height={300} />
            <Skeleton width={300} height={300} />
            <Skeleton width={300} height={300} />
          </>
        )}
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
          c: "white",
          mr: "md",
          w: "fit-content",
          children: <Text>Close</Text>,
        }}
        classNames={classes}
      >
        <Carousel
          slideSize={{ base: "100%", lg: "50%" }}
          slideGap={"sm"}
          loop
          withIndicators
          classNames={classes}
          getEmblaApi={setEmbla}
        >
          {matchingImagesForFilters.map((file, index) => {
            return (
              <Carousel.Slide key={file.file_id + "slide"}>
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
