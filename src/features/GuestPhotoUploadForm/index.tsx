"use client";

import { Button, Flex, Group, Modal, SimpleGrid, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { saveGuestUploadedImages } from "@spiel-wedding/hooks/guestUploadedImages";
import Compressor from "@uppy/compressor";
import Uppy, { Meta, UploadResult } from "@uppy/core";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Dashboard as UppyDashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { useState } from "react";
import GalleryBanner from "./components/GalleryBanner";

const GuestUpload = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [uppy] = useState(initializeUppy);

  function initializeUppy() {
    const BEARER_TOKEN = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseUploadURL = `https://qaobgjglyovmcaiiagyx.supabase.co/storage/v1/upload/resumable`;

    const uppyInstance = new Uppy();

    uppyInstance
      .use(Tus, {
        endpoint: supabaseUploadURL,
        headers: {
          authorization: `Bearer ${BEARER_TOKEN}`,
        },
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"],
      })
      .use(Compressor);

    uppyInstance.on("file-added", (file) => {
      if (!form.isValid()) {
        open();
      }

      file.meta = {
        ...file.meta,
        bucketName: "guest_gallery",
        objectName: file.name,
        contentType: file.type,
      };
    });

    uppyInstance.on("complete", (result) => {
      const successfulUploads = result.successful?.map((uploadResult) => ({
        first_name: form.values.firstName,
        last_name: form.values.lastName,
        file_name: uploadResult.meta.objectName as string,
        mime_type: uploadResult.type,
      }));

      if (successfulUploads !== undefined) {
        saveGuestUploadedImages(successfulUploads);
      }
    });

    return uppyInstance;
  }

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
    await uppy
      .upload()
      .then((uploadResult) => saveImagePathsToDatabase(uploadResult))
      .catch((error) => {
        showNotification({
          color: "red",
          message: "Error while uploading file. Please try again later.",
        });
      });
  };

  const saveImagePathsToDatabase = async (
    uploadResult?: UploadResult<Meta, Record<string, unknown>>
  ) => {
    if (!uploadResult || !uploadResult.successful) {
      return;
    }

    const successfulUploads = uploadResult.successful.map((file) => {
      return {
        first_name: form.values.firstName,
        last_name: form.values.lastName,
        file_name: file.name ?? file.id,
        mime_type: file.type,
      };
    });

    await saveGuestUploadedImages(successfulUploads).then(() => open());
  };

  return (
    <>
      <GalleryBanner />

      <form onSubmit={form.onSubmit(handleUpload)}>
        <Flex justify="center">
          <UppyDashboard uppy={uppy} showProgressDetails />
        </Flex>
      </form>

      <Modal
        opened={opened}
        withCloseButton={false}
        onClose={close}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text c="dimmed" mb="md">
          Please enter your first and last name below to continue adding files.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <TextInput
            {...form.getInputProps("firstName")}
            placeholder="Enter your first name"
            label="First Name"
            error={form.errors.firstName}
            mb={{ base: 0, md: "md" }}
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

        <Group justify="end" mt="lg">
          <Button onClick={close}>Save</Button>
        </Group>
      </Modal>
    </>
  );
};

export default GuestUpload;
