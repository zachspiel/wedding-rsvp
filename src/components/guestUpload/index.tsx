"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  rem,
  Stepper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import { GuestPhotoUploadResult } from "@spiel-wedding/types/Photo";
import {
  IconCloudUpload,
  IconDownload,
  IconFolderOpen,
  IconPhoto,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import classes from "./guestUpload.module.css";

const GuestUpload = () => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [active, setActive] = useState(0);

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleUpload = async () => {
    nextStep();
    showNotification({
      color: "blue",
      message: "Now uploading...",
    });

    await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("mime", file.type);
        formData.set("fileName", file.name);

        return fetch("/api/upload", { method: "POST", body: formData }).then((res) =>
          res.json()
        );
      })
    ).then((results: GuestPhotoUploadResult[]) => {
      setFiles([]);

      if (results.every((result) => result.success)) {
        revalidatePage("/upload");
        showNotification({
          color: "green",
          message: `Successfully added ${results.length} items`,
        });
      } else {
        showNotification({
          color: "red",
          message: "An error occurred. Please try again later.",
        });
      }
    });
  };
  console.log(active);
  return (
    <>
      <Stepper active={active}>
        <Stepper.Step label="Browse Files" />
        <Stepper.Step label="Select Your Files" />
        <Stepper.Step label="Click Upload" />
        <Stepper.Completed>
          <Alert color="green">Your photos are now uploading!</Alert>
        </Stepper.Completed>
      </Stepper>

      <div className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={(newFiles) => {
            setFiles([...files, ...newFiles]);

            if (active === 0) {
              setActive(2);
            }
          }}
          onFileDialogCancel={() => {
            prevStep();
          }}
          onFileDialogOpen={() => {
            if (active === 3) {
              setActive(0);
            } else {
              nextStep();
            }
          }}
          onReject={(files) => {
            showNotification({
              color: "red",
              message: `Unable to upload files. Please make sure they are less than 1 GB and are an image or video.`,
            });
          }}
          className={classes.dropzone}
          radius="md"
          accept={["image/*", "video/*"]}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: "none" }}>
            <Group justify="center" gap="xl" mih={220}>
              <Dropzone.Accept>
                <IconDownload
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-dimmed)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed 30mb
                </Text>
              </div>
            </Group>
          </div>
        </Dropzone>

        <Button
          className={classes.control}
          size="md"
          radius="xl"
          onClick={() => openRef.current?.()}
          leftSection={<IconFolderOpen strokeWidth={1.5} />}
        >
          Select files
        </Button>
      </div>
      {files.length > 0 && (
        <Group justify="end">
          <Button
            leftSection={<IconCloudUpload strokeWidth={1.5} />}
            onClick={handleUpload}
          >
            Upload Files
          </Button>
        </Group>
      )}

      {files.length > 0 && (
        <>
          <Divider my="md" />

          <Title order={3}>File Upload Preview</Title>
        </>
      )}

      {files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);

        return (
          <Group justify="space-between" key={`${file.name}-${index}`}>
            <Flex direction="column">
              <Image
                src={imageUrl}
                onLoad={() => URL.revokeObjectURL(imageUrl)}
                w={100}
                h={100}
                alt={file.name}
              />
              <Text c="dimmed">{file.name}</Text>
            </Flex>

            <ActionIcon
              variant="subtle"
              onClick={() => {
                const updatedFiles = files.filter((item) => item.name !== file.name);
                setFiles(updatedFiles);

                if (updatedFiles.length === 0) {
                  setActive(0);
                }
              }}
            >
              <IconTrash strokeWidth={1.5} />
            </ActionIcon>
          </Group>
        );
      })}
    </>
  );
};

export default GuestUpload;
