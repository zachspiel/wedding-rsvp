"use client";

import {
  Alert,
  Button,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { saveGuestUploadedImages } from "@spiel-wedding/hooks/guestUploadedImages";
import { IconPhoto } from "@tabler/icons-react";
import Compressor from "@uppy/compressor";
import Uppy from "@uppy/core";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Dashboard as UppyDashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GalleryBanner from "./components/GalleryBanner";
import { sendEmailForUploadedImages } from "./sendEmailAction";

const GuestUpload = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [uppy] = useState(initializeUppy);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: {
      firstName: isNotEmpty("Please enter your first name"),
      lastName: isNotEmpty("Please enter your first name"),
    },
    onValuesChange: (values) => {
      window.localStorage.setItem("guest-name", JSON.stringify(values));
    },
  });

  useEffect(() => {
    const storedValue = window.localStorage.getItem("guest-name");
    if (storedValue) {
      try {
        form.setValues(JSON.parse(window.localStorage.getItem("guest-name")!));
      } catch (e) {
        console.log("Failed to parse stored value");
      }
    }
  }, []);

  function initializeUppy() {
    const BEARER_TOKEN = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseUploadURL = `https://qaobgjglyovmcaiiagyx.supabase.co/storage/v1/upload/resumable`;

    const uppyInstance = new Uppy({
      restrictions: {
        allowedFileTypes: ["image/*", "video/*"],
      },
    });

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
      const { firstName, lastName } = form.getValues();

      const successfulUploads = result.successful?.map((uploadResult) => ({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        file_name: uploadResult.meta.objectName as string,
        mime_type: uploadResult.type,
      }));

      if (successfulUploads !== undefined && successfulUploads.length > 0) {
        const result = saveGuestUploadedImages(successfulUploads);

        modals.openConfirmModal({
          title: "Thank you for uploading!",
          children: (
            <Text size="sm">
              To view the gallery, please use the button below or close this window to
              keep adding more images.
            </Text>
          ),
          labels: { confirm: "Go to gallery", cancel: "Add more images" },
          onCancel: () => modals.closeAll(),
          onConfirm: () => router.push("/weddingPhotos/gallery"),
        });

        result.then((uploadedImages) => {
          const emailProps = {
            firstName,
            lastName,
            uploadedImages,
          };

          sendEmailForUploadedImages(emailProps);
        });
      }

      if (result.failed && result.failed.length > 0) {
        showNotification({
          message:
            result.failed.length +
            " images failed to upload. Please try again or let Zach know!",
          color: "red",
        });
      }
    });

    return uppyInstance;
  }
  const handleUpload = async () => {
    await uppy.upload().catch((error) => {
      showNotification({
        color: "red",
        message: "Error while uploading file. Please try again later.",
      });
    });
  };

  return (
    <>
      <Alert color="grape" icon={<IconPhoto strokeWidth={1.5} />}>
        Please use the form below to upload photos and videos of the reception. Thank you
        so much for participating!
      </Alert>

      <form onSubmit={form.onSubmit(handleUpload)}>
        <Flex justify="center">
          <UppyDashboard
            uppy={uppy}
            showProgressDetails
            width={isMobile ? "100%" : ""}
            note="Feel free to upload as many photos as you like, but please try to keep videos relatively short. Thank you!"
          />
        </Flex>
      </form>

      <GalleryBanner displayText="GALLERY" />

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
          <form>
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
          </form>
        </SimpleGrid>

        <Group justify="end" mt="lg">
          <Button onClick={close}>Save</Button>
        </Group>
      </Modal>
    </>
  );
};

export default GuestUpload;
