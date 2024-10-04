"use client";

import {
  Alert,
  Button,
  Flex,
  Group,
  Modal,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  saveGuestUploadedImages,
  uploadFileToGuestGallery,
} from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { IconCloudUpload, IconExternalLink } from "@tabler/icons-react";
import { useState } from "react";
import ImageDropzone from "./components/ImageDropzone";
import ImagePreview from "./components/ImagePreview";
import classes from "./guestUpload.module.css";

interface DownloadProgress {
  [file: string]: {
    progress: number;
    completed: boolean;
  };
}

const GuestUpload = () => {
  const [files, setFiles] = useState<Record<string, FileWithPath>>({});
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [opened, { open, close }] = useDisclosure(false);

  const filesAreNotEmpty = Object.values(files).length > 0;

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: {
      firstName: isNotEmpty("Please enter your first name"),
      lastName: isNotEmpty("Please enter your first name"),
    },
  });

  const handleUpload = async () => {
    if (!filesAreNotEmpty) {
      showNotification({
        color: "red",
        message: "Please select a file before uploading",
      });
      return;
    }

    showNotification({
      color: "blue",
      message: "Now uploading...",
    });

    await Promise.allSettled(
      Object.entries(files).map(([id, file]) => {
        uploadFileToGuestGallery(file, id, (progress) =>
          setDownloadProgress((current) => ({
            ...current,
            [id]: { progress, completed: progress === 100 },
          }))
        ).catch((error) => {
          setDownloadProgress((current) => ({
            ...current,
            [id]: { progress: current[id].progress, completed: true },
          }));
        });
      })
    )
      .catch((error) => {
        showNotification({
          color: "red",
          message: "Error while uploading file. Please try again later.",
        });
      })
      .then(async () => {
        const successfulUploads: Omit<GuestUploadedImage, "file_id">[] = Object.entries(
          files
        ).map(([id, file]) => {
          return {
            first_name: form.values.firstName,
            last_name: form.values.lastName,
            file_name: id,
            mime_type: file.type,
          };
        });

        await saveGuestUploadedImages(successfulUploads);
      })
      .then(() => open());
  };

  const removeFile = (id: string) => {
    if (files[id]) {
      setFiles((curr) => {
        const { [id]: _, ...rest } = curr;
        return rest;
      });
    }
  };

  const closeModal = () => {
    form.reset();
    setDownloadProgress({});
    close();
    setFiles({});
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleUpload)}>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <TextInput
            {...form.getInputProps("firstName")}
            placeholder="Enter your first name"
            label="First Name"
            error={form.errors.firstName}
            mb="md"
            mr="md"
          />
          <TextInput
            {...form.getInputProps("lastName")}
            placeholder="Enter your last name"
            label="Last Name"
            error={form.errors.lastName}
            mb="md"
          />
        </SimpleGrid>

        <ImageDropzone files={files} setFiles={setFiles} />

        {filesAreNotEmpty && (
          <div>
            <Title order={4}>Uploaded Files ({Object.keys(files).length})</Title>
            <ScrollArea.Autosize
              px="sm"
              mah={250}
              style={{ border: "1px solid var(--mantine-color-gray-2)" }}
            >
              {Object.entries(files).map(([id, file], index) => {
                return (
                  <>
                    {index === 0 ? (
                      <Space dir="vertical" mt="sm" key={`${id}-spacer`} />
                    ) : null}

                    <ImagePreview
                      key={id}
                      id={id}
                      file={file}
                      onDelete={removeFile}
                      showDivider={index !== Object.values(files).length - 1}
                      downloadProgress={downloadProgress?.[id]?.progress}
                    />
                  </>
                );
              })}
            </ScrollArea.Autosize>
          </div>
        )}

        {filesAreNotEmpty && (
          <Flex justify="end">
            <Button
              mt="md"
              leftSection={<IconCloudUpload strokeWidth={1.5} />}
              type="submit"
              className={filesAreNotEmpty ? classes.uploadButton : undefined}
            >
              Save photos to gallery
            </Button>
          </Flex>
        )}
      </form>

      <Modal opened={opened} withCloseButton={false} onClose={close}>
        {Object.entries(downloadProgress).every(([id, download]) => {
          return download.progress === 100;
        }) ? (
          <Alert color="green" title="Success">
            All files uploaded successfully!
          </Alert>
        ) : (
          <>
            {Object.values(downloadProgress).every((download) => download.completed) && (
              <>
                <Title order={3}>
                  An error occurred while uploading the following files
                </Title>

                <ScrollArea.Autosize mah={300}>
                  {Object.entries(downloadProgress)
                    .filter(([id, download]) => download.progress !== 100)
                    .map(([id, file]) => (
                      <Text mb="md" key={id}>
                        {files[id].name}
                      </Text>
                    ))}
                </ScrollArea.Autosize>
              </>
            )}
          </>
        )}

        <Group justify="end" mt="lg">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button
            component="a"
            href="/weddingPhotos/gallery"
            rightSection={<IconExternalLink strokeWidth={1.5} />}
          >
            Go to gallery
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default GuestUpload;
