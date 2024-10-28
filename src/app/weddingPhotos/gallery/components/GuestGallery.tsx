"use client";

import { Carousel, Embla } from "@mantine/carousel";
import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Center,
  Chip,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  MultiSelect,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { createClient } from "@spiel-wedding/database/client";
import {
  getCommentsForImage,
  getGuestImages,
} from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { formatDate } from "@spiel-wedding/util";
import { IconMessage, IconVideo, IconX } from "@tabler/icons-react";
import cx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import classes from "../styles.module.css";
import CommentDrawer from "./CommentDrawer";
import DownloadButton from "./DownloadButton";
import LikeButton from "./LikeButton";

interface Props {
  placeHolderImages: string[];
}

const GuestGallery = ({ placeHolderImages }: Props) => {
  const [mimeFilter, setMimeFilter] = useState<string[] | undefined>(["image", "video"]);
  const [namesFilter, setNameFilter] = useState<string[] | undefined>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [thumbnail, setThumbnail] = useState<Embla | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>();
  const [likes, setLikes] = useLocalStorage<string[]>({
    key: "liked_images",
    defaultValue: [],
  });
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState<GuestUploadedImage | null>();

  const { data: gallery, isLoading } = useSWR("guest_gallery", getGuestImages, {
    fallbackData: [],
  });

  const {
    data: comments,
    isLoading: commentsAreLoading,
    mutate,
  } = useSWR(
    selectedFile == null ? null : "comments_for_file",
    (key) => getCommentsForImage(selectedFile?.file_id as string),
    {
      fallbackData: [],
    }
  );

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

  const createImageCard = (file: GuestUploadedImage, index: number) => {
    const supabase = createClient();
    const { data } = supabase.storage.from("guest_gallery").getPublicUrl(file.file_name);

    return (
      <Stack gap={0} pos="relative">
        {file.mime_type.includes("video") ? (
          <video controls width="100%" height="80%">
            <source src={data.publicUrl} type={file.mime_type} />
          </video>
        ) : (
          <Image
            src={data.publicUrl}
            className={classes.galleryImage}
            onClick={() => {
              setScrollToIndex(index);
              open();
            }}
            style={{
              objectPosition: "top",
              transform: "translate3d(0, 0, 0)",
            }}
            objectFit="contain"
            width={720}
            height={480}
            layout="responsive"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            alt={file.file_id}
            loading="lazy"
            unoptimized={file.mime_type.includes("gif")}
            blurDataURL={placeHolderImages[index]}
            placeholder="blur"
          />
        )}
        <Group bg="sage-green.9" w="100%" mt="auto">
          <LikeButton
            id={file.file_id}
            likes={file.likes}
            rpc="likes"
            swrKey="guest_gallery"
            savedLikes={likes}
            setLikes={setLikes}
            color="white"
          />
          <DownloadButton file={file} />

          <Group gap="xs">
            <ActionIcon
              variant="transparent"
              c="white"
              size="xl"
              title="download"
              onClick={() => {
                setSelectedFile(file);
                mutate();
                openDrawer();
              }}
            >
              <IconMessage style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
            <Text c="dimmed">{file?.guest_image_comments?.length ?? 0}</Text>
          </Group>
        </Group>
      </Stack>
    );
  };

  const onThumbClick = useCallback(
    (index: number) => {
      if (!embla || !thumbnail) return;

      embla.scrollTo(index);
      thumbnail.scrollTo(index);

      setActiveSlide(index);
    },
    [embla, thumbnail]
  );

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

      <Flex ml="lg" gap="md" wrap="wrap">
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

      <Container>
        <Divider my="md" />
        <SimpleGrid
          spacing={"xs"}
          mt="lg"
          style={{ overflow: "hidden" }}
          cols={{
            md: 3,
            sm: 2,
            base: 1,
          }}
        >
          {matchingImagesForFilters.length === 0 && !isLoading && (
            <Card withBorder h={200} w="100%" mb="lg">
              <Text>No matching items found.</Text>
            </Card>
          )}
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
      </Container>
      <Modal
        opened={opened}
        onClose={close}
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
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
        {matchingImagesForFilters?.[activeSlide] && (
          <Group gap="sm" c="white" p="sm">
            <Avatar color="white" size="lg" />
            <div style={{ flex: 1 }}>
              <Text size="lg" fw={500}>
                {matchingImagesForFilters[activeSlide].first_name}{" "}
                {matchingImagesForFilters[activeSlide].last_name}
              </Text>

              {matchingImagesForFilters[activeSlide].created_at !== null && (
                <Text c="dimmed" size="lg">
                  {formatDate(
                    new Date(
                      matchingImagesForFilters[activeSlide].created_at ??
                        new Date().toString()
                    )
                  )}
                </Text>
              )}
            </div>

            <Group ml="auto">
              <LikeButton
                id={matchingImagesForFilters[activeSlide].file_id}
                likes={matchingImagesForFilters[activeSlide].likes}
                rpc="likes"
                swrKey="guest_gallery"
                savedLikes={likes}
                setLikes={setLikes}
                color="white"
                mr="md"
              />

              <DownloadButton file={matchingImagesForFilters[activeSlide]} mr="md" />
            </Group>
          </Group>
        )}

        <Carousel
          height="75vh"
          slideSize={{ base: "100%" }}
          slideGap="lg"
          loop
          classNames={classes}
          onSlideChange={(index) => {
            thumbnail?.scrollTo(index);
            setActiveSlide(index);
          }}
          getEmblaApi={setEmbla}
        >
          {matchingImagesForFilters.map((file, index) => {
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
                {file.mime_type.includes("video") ? (
                  <video
                    controls
                    width="100%"
                    height="100%"
                    style={{ objectFit: "contain" }}
                    controlsList="nofullscreen"
                  >
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
                        objectPosition: "top",
                        zIndex: 0,
                        transform: "translate3d(0, 0, 0)",
                      }}
                      objectFit="contain"
                      quality={80}
                      loading="lazy"
                      blurDataURL={placeHolderImages[index]}
                      placeholder="blur"
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
                  <Box
                    h={60}
                    w={60}
                    className={cx(
                      classes.imageThumbnail,
                      index === activeSlide ? classes.activeSlide : undefined
                    )}
                  >
                    <Center mt="md">
                      <IconVideo strokeWidth={1.5} color="white" />
                    </Center>
                  </Box>
                ) : (
                  <Image
                    className={cx(
                      classes.imageThumbnail,
                      index === activeSlide ? classes.activeSlide : undefined
                    )}
                    src={data.publicUrl}
                    objectFit="contain"
                    height={60}
                    width={60}
                    alt={file.file_id}
                    unoptimized={file.mime_type.includes("gif")}
                    blurDataURL={placeHolderImages[index]}
                    placeholder="blur"
                    loading="lazy"
                  />
                )}
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Modal>

      <CommentDrawer
        comments={comments}
        isLoading={commentsAreLoading}
        opened={drawerOpened}
        close={() => {
          closeDrawer();
          setSelectedFile(null);
        }}
        file={selectedFile as GuestUploadedImage}
      />
    </>
  );
};

export default GuestGallery;
