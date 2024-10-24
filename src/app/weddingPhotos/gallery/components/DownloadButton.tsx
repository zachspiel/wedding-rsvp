"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import { showCustomFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { createClient } from "@spiel-wedding/database/client";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { IconDownload } from "@tabler/icons-react";
import JsFileDownloader from "js-file-downloader";
import { mutate } from "swr";

interface Props {
  file: GuestUploadedImage;
  mr?: string;
}

const DownloadButton = ({ file, mr }: Props) => {
  const downloadFile = async () => {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("guest_gallery")
      .getPublicUrl(file.file_name);

    new JsFileDownloader({
      url: data.publicUrl,
    }).catch(function (error) {
      showCustomFailureNotification("An error occurred. Please try again later.");
    });

    await incrementDownload();
  };

  const incrementDownload = async () => {
    const supabase = createClient();
    await supabase.rpc("increment_downloads", { x: 1, row_id: file.file_id });
    await mutate("guest_gallery");
  };

  return (
    <Group gap="xs" mr={mr ?? "lg"}>
      <ActionIcon
        variant="transparent"
        c="white"
        size="xl"
        title="download"
        onClick={downloadFile}
      >
        <IconDownload style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
      <Text c="dimmed">{file.downloads}</Text>
    </Group>
  );
};

export default DownloadButton;