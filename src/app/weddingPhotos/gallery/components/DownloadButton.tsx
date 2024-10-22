"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { createClient } from "@spiel-wedding/database/client";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { IconDownload } from "@tabler/icons-react";

interface Props {
  file: GuestUploadedImage;
  mr?: string;
}

const DownloadButton = ({ file, mr }: Props) => {
  const downloadFile = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("guest_gallery")
      .download(file.file_name);

    if (data === null || error !== null) {
      notifications.show({
        color: "red",
        message: "An error occurred while downloading.",
      });
      return;
    }

    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.file_name;
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    await incrementDownload();
  };

  const incrementDownload = async () => {
    const supabase = createClient();
    await supabase.rpc("increment_downloads", { x: 1, row_id: file.file_id });
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
