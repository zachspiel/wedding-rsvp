"use client";

import {
  Alert,
  Button,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { saveGuestUploadedImages } from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { IconCloudUpload, IconExternalLink } from "@tabler/icons-react";
import { useState } from "react";
import ImageDropzone from "./components/ImageDropzone";
import ImagePreview from "./components/ImagePreview";
import classes from "./guestUpload.module.css";

interface DownloadProgress {
  [file: string]: number;
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

    await Promise.all(
      Object.entries(files).map(async ([id, file]) => {
        const formData = new FormData();

        formData.set("file", file);
        formData.set("size", `${file.size}`);
        formData.set("mime", file.type);
        formData.set("fileName", id);

        setDownloadProgress((curr) => ({ ...curr, [id]: 0 }));

        const response = await fetch("/api/upload", { method: "POST", body: formData });

        if (!response.ok || !response.body) {
          showNotification({
            color: "red",
            message: " Error getting response from upload",
          });

          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const decodedChunk = decoder.decode(value, { stream: true });

          // If two messages were sent at same time
          if (decodedChunk.includes("}{")) {
            const chunks = decodedChunk
              .split("}{")
              .filter((chunk) => chunk.length > 0)
              .map((chunk) => (!chunk.startsWith("{") ? "{" + chunk : chunk));

            chunks.forEach(updateDownloadProgress);
          } else {
            updateDownloadProgress(decodedChunk);
          }
        }
      })
    );

    const successfulUploads: Omit<GuestUploadedImage, "file_id">[] = Object.entries(
      files
    ).map(([id, file]) => {
      return {
        first_name: form.values.firstName,
        last_name: form.values.lastName,
        file_name: id,
      };
    });

    open();

    await saveGuestUploadedImages(successfulUploads);
  };

  const updateDownloadProgress = (decodedChunk: string) => {
    try {
      const data = JSON.parse(decodedChunk);

      if (data.progress) {
        setDownloadProgress((curr) => ({
          ...curr,
          [data.progress.file]: data.progress.progress,
        }));
      } else if (data.success) {
      } else if (data.success !== undefined && !data.success) {
        showNotification({
          color: "red",
          message: "An error occurred. Please try again later.",
        });
      }
    } catch (exception) {}
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
        <Flex>
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
        </Flex>

        <ImageDropzone files={files} setFiles={setFiles} />

        {filesAreNotEmpty && (
          <div>
            <Title order={4}>Uploaded Files</Title>
            <ScrollArea.Autosize
              px="sm"
              mah={250}
              style={{ border: "1px solid var(--mantine-color-gray-2)" }}
            >
              {Object.entries(files).map(([id, file], index) => {
                return (
                  <>
                    {index === 0 ? <Space dir="vertical" mt="sm" /> : null}

                    <ImagePreview
                      key={id}
                      id={id}
                      file={file}
                      onDelete={removeFile}
                      showDivider={index !== Object.values(files).length - 1}
                      downloadProgress={downloadProgress?.[id]}
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
        {Object.entries(downloadProgress).every(([id, progress]) => {
          return progress === 100;
        }) ? (
          <Alert color="green" title="Success">
            All files uploaded successfully!
          </Alert>
        ) : (
          <>
            <Title order={3}>An error occurred while uploading the following files</Title>

            {Object.entries(downloadProgress)
              .filter(([id, progress]) => progress !== 100)
              .map(([id, file]) => (
                <Text mb="md" key={id}>
                  {files[id].name}
                </Text>
              ))}
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
