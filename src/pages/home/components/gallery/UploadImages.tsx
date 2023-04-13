import React, { useState } from "react";
import { Group, FileButton, Button } from "@mantine/core";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../database/database";
import { notifications } from "@mantine/notifications";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../../../components/notifications/notifications";

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
          }
        },
        (err) => showFailureNotification(),
      );
    }
  };

  React.useEffect(() => {
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
