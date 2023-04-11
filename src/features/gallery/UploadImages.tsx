import React, { useState } from "react";
import { Group, FileButton, Button } from "@mantine/core";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../database/database";
import { notifications } from "@mantine/notifications";

const UploadImages = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = async () => {
    notifications.show({
      message: "Uploading image(s)...",
      color: "blue",
    });
    files.forEach((file) => {
      uploadFile(file);
    });
  };

  const uploadFile = async (file: File) => {
    const filePath = `/gallery/${file.name}`;
    const storageRef = ref(storage, filePath);
    const arrayBuffer = await file.arrayBuffer();

    if (arrayBuffer !== undefined) {
      const uploadTask = uploadBytesResumable(storageRef, arrayBuffer);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          if (percent === 100) {
            notifications.show({
              message: "Successfully uploaded image.",
              color: "green",
            });
          }
        },
        (err) =>
          notifications.show({
            message: err.message,
            color: "red",
          })
      );
    }
  };

  React.useEffect(() => {
    if (files.length > 0) {
      handleUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <Group>
      <FileButton onChange={setFiles} accept="image/png,image/jpeg" multiple>
        {(props) => <Button {...props}>Upload images</Button>}
      </FileButton>
    </Group>
  );
};

export default UploadImages;
