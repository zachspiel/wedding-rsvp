"use client";

import { Group, rem, Text, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  showSuccessNotification,
  showFailureNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconX, IconPhoto, IconUpload } from "@tabler/icons-react";
import { useSWRConfig } from "swr";
import {
  GALLERY_SWR_KEY,
  uploadFileToGallery,
} from "@spiel-wedding/hooks/gallery";

const UploadImages = (): JSX.Element => {
  const theme = useMantineTheme();
  const { mutate } = useSWRConfig();

  const handleUpload = async (files: File[]): Promise<void> => {
    notifications.show({
      message: "Uploading image(s)...",
      color: "blue",
    });

    files.forEach((file) => {
      uploadImage(file);
    });
  };

  const uploadImage = async (file: File): Promise<void> => {
    const newImage = await uploadFileToGallery(file);

    if (newImage) {
      showSuccessNotification("Successfully uploaded image.");
      mutate(GALLERY_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  return (
    <Dropzone
      onDrop={(files) => handleUpload(files)}
      onReject={(files) =>
        files.map((file) =>
          showCustomFailureNotification(
            file.errors.map((error) => error.message).join(", "),
          ),
        )
      }
      accept={IMAGE_MIME_TYPE}
    >
      <Group
        align="center"
        gap="lg"
        style={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={theme.colors[theme.primaryColor][6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size="3.2rem" stroke={1.5} color={theme.colors.red[6]} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default UploadImages;
