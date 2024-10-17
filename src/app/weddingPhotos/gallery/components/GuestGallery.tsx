"use client";

import { Carousel, Embla } from "@mantine/carousel";
import {
  Avatar,
  Box,
  Center,
  Chip,
  Flex,
  Group,
  Modal,
  MultiSelect,
  SimpleGrid,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createClient } from "@spiel-wedding/database/client";
import { getGuestImages } from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestImageWithLikes } from "@spiel-wedding/types/Photo";
import { IconVideo, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import classes from "../styles.module.css";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const GuestGallery = ({ searchParams }: Props) => {
  const [mimeFilter, setMimeFilter] = useState<string[] | undefined>([]);
  const [namesFilter, setNameFilter] = useState<string[] | undefined>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [thumbnail, setThumbnail] = useState<Embla | null>(null);

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

  const createImageCard = (file: GuestImageWithLikes, index: number) => {
    const supabase = createClient();
    const { data } = supabase.storage.from("guest_gallery").getPublicUrl(file.file_name);

    return (
      <div
        onClick={() => {
          setScrollToIndex(index);
          open();
        }}
      >
        {file.mime_type.includes("video") ? (
          <video controls width="100%">
            <source src={data.publicUrl} type={file.mime_type} />
          </video>
        ) : (
          <Image
            src={data.publicUrl}
            className={classes.galleryImage}
            style={{
              objectPosition: "50% 50%",
              transform: "translate3d(0, 0, 0)",
              borderRadius: "0.5rem",
            }}
            objectFit="cover"
            width={720}
            height={480}
            layout="responsive"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            alt={file.file_id}
            unoptimized={file.mime_type.includes("gif")}
          />
        )}
      </div>
    );
  };

  const onThumbClick = useCallback(
    (index: number) => {
      if (!embla || !thumbnail) return;

      embla.scrollTo(index);
      thumbnail.scrollTo(index);
    },
    [embla, thumbnail]
  );

  function formatDate(date: Date) {
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return (
      date.getMonth() +
      1 +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      "  " +
      strTime
    );
  }

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
        p="md"
        spacing={"xs"}
        mt="lg"
        style={{ overflow: "hidden" }}
        bg="sage-green"
        cols={{
          lg: 4,
          md: 4,
          sm: 2,
          base: 1,
        }}
      >
        {matchingImagesForFilters.length === 0 && <Text>No matching items found.</Text>}
        {matchingImagesForFilters.map((file, index) => {
          return createImageCard(file, index);
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
        centered
        fullScreen
        size="calc(100vw - 3rem)"
        closeButtonProps={{
          icon: <IconX color="#ffffff" />,
          bg: "red",
          c: "white",
          mr: "md",
          w: "fit-content",
          px: "md",
          size: "xl",
          children: <Text>Close</Text>,
        }}
        classNames={classes}
      >
        <Carousel
          height="85vh"
          slideSize={{ base: "100%", lg: "50%" }}
          slideGap="lg"
          loop
          classNames={classes}
          onSlideChange={(index) => thumbnail?.scrollTo(index)}
          getEmblaApi={setEmbla}
        >
          {matchingImagesForFilters.map((file) => {
            const supabase = createClient();
            const name = file.first_name + " " + file.last_name;
            const { data } = supabase.storage
              .from("guest_gallery")
              .getPublicUrl(file.file_name);

            return (
              <Carousel.Slide
                key={file.file_id + "slide"}
                style={{ marginBottom: "0.5rem" }}
                title={name}
              >
                <Group gap="sm" bg="sage-green" c="white" p="sm">
                  <Avatar color="white" />
                  <Text size="sm" fw={500} ml="sm">
                    {name}
                  </Text>

                  {file.created_at && (
                    <Text ml="auto">{formatDate(new Date(file.created_at))}</Text>
                  )}
                </Group>

                {file.mime_type.includes("video") ? (
                  <video controls width="100%" style={{ objectFit: "contain" }}>
                    <source src={data.publicUrl} type={file.mime_type} />
                  </video>
                ) : (
                  <div style={{ height: "90%", position: "relative" }}>
                    <Image
                      key={data.publicUrl}
                      src={data.publicUrl}
                      alt={file.file_id}
                      className={classes.cardImage}
                      fill
                      style={{
                        zIndex: 0,
                        transform: "translate3d(0, 0, 0)",
                      }}
                      objectFit="contain"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                )}
              </Carousel.Slide>
            );
          })}
        </Carousel>

        <Carousel
          height="100px"
          slideGap={"sm"}
          loop
          slideSize="100px"
          initialSlide={scrollToIndex ?? 0}
          getEmblaApi={setThumbnail}
        >
          {matchingImagesForFilters.map((file, index) => {
            const supabase = createClient();
            const { data } = supabase.storage
              .from("guest_gallery")
              .getPublicUrl(file.file_name);

            return (
              <Carousel.Slide
                key={`${file.file_id}-thumbnail`}
                onClick={() => onThumbClick(index)}
              >
                {file.mime_type.includes("video") ? (
                  <Box h={60} w={60} className={classes.imageThumbnail}>
                    <Center mt="md">
                      <IconVideo strokeWidth={1.5} />
                    </Center>
                  </Box>
                ) : (
                  <Image
                    className={classes.imageThumbnail}
                    src={data.publicUrl}
                    objectFit="contain"
                    height={60}
                    width={60}
                    alt={file.file_id}
                    unoptimized={file.mime_type.includes("gif")}
                  />
                )}
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Modal>
    </>
  );
};

export default GuestGallery;
