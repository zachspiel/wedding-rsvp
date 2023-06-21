"use client";
import { Group, FileButton, Button } from "@mantine/core";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, database } from "@spiel-wedding/database/database";
import { notifications } from "@mantine/notifications";
import {
  showSuccessNotification,
  showFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { Photo } from "@spiel-wedding/types/Photo";
import { v4 as uuid4 } from "uuid";
import { set, ref as databaseRef } from "firebase/database";
import { useEffect, useState } from "react";

const UploadImages = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);

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
    const filePath = `/gallery/${file.name}`;
    const storageRef = ref(storage, filePath);
    const arrayBuffer = await file.arrayBuffer();

    if (arrayBuffer !== undefined) {
      const uploadTask = uploadBytesResumable(storageRef, arrayBuffer);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );

          if (percent === 100) {
            showSuccessNotification("Successfully uploaded image.");

            getDownloadURL(storageRef).then((url) => {
              savePhotoToDatabase(file.name, url);
            });
          }
        },
        (err) => showFailureNotification(),
      );
    }
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
    <Group>
      <FileButton onChange={setFiles} accept="image/png,image/jpeg" multiple>
        {(props): JSX.Element => <Button {...props}>Upload images</Button>}
      </FileButton>
    </Group>
  );
};

export default UploadImages;
