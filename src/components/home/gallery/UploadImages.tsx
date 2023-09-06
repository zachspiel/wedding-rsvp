"use client";
import { Group, rem, Text, useMantineTheme } from "@mantine/core";
import { database, storage } from "@spiel-wedding/database/database";
import { notifications } from "@mantine/notifications";
import {
  showSuccessNotification,
  showFailureNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { Photo } from "@spiel-wedding/types/Photo";
import { v4 as uuid4 } from "uuid";
import { set, ref as databaseRef } from "firebase/database";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconX, IconPhoto, IconUpload } from "@tabler/icons-react";

const UploadImages = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);
  const theme = useMantineTheme();
  const handleUpload = async (): Promise<void> => {
    notifications.show({
      message: "Uploading image(s)...",
      color: "blue",
    });

    files.forEach((file) => {
      uploadFile(file);
    });
  };

  const uploadFile = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const { fileName, compressedImage } = await response.json();

    if (fileName) {
      const storageRef = ref(storage, `gallery/${fileName}`);
      const bytes = new Uint8Array(compressedImage?.data ?? []);

      uploadBytes(storageRef, bytes).then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            showSuccessNotification("Successfully uploaded image.");
            savePhotoToDatabase(fileName, url);
          })
          .catch(showFailureNotification);
      });
    } else {
      showFailureNotification();
    }

    // if (result.status === 200) {
    //   showSuccessNotification("Successfully uploaded image.");
    // } else {
    //   showFailureNotification();
    // }

    // const arrayBuffer = await file.arrayBuffer();

    // if (arrayBuffer !== undefined) {
    //   const uploadTask = uploadBytesResumable(storageRef, arrayBuffer);

    //   uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //       const percent = Math.round(
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
    //       );

    //       if (percent === 100) {
    //         showSuccessNotification("Successfully uploaded image.");

    //         getDownloadURL(storageRef).then((url) => {
    //           savePhotoToDatabase(file.name, url);
    //         });
    //       }
    //     },
    //     (err) => showFailureNotification(),
    //   );
    // }
  };

  const savePhotoToDatabase = (filename: string, downloadUrl: string): void => {
    const newPhoto: Photo = {
      id: uuid4(),
      caption: filename,
      isVisible: false,
      filePath: `/gallery/${filename}`,
      downloadUrl: downloadUrl,
    };

    set(databaseRef(database, `photos/${newPhoto.id}`), newPhoto);
  };

  useEffect(() => {
    if (files.length > 0) {
      handleUpload();
    }
  }, [files]);

  return (
    <Dropzone
      onDrop={(files) => setFiles(files)}
      onReject={(files) =>
        files.map((file) =>
          showCustomFailureNotification(
            file.errors.map((error) => error.message).join(", ")
          )
        )
      }
      accept={IMAGE_MIME_TYPE}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default UploadImages;
