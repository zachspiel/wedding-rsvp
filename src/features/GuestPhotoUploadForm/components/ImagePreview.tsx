import {
  ActionIcon,
  Divider,
  Flex,
  Image,
  Paper,
  Progress,
  Space,
  Text,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
import { IconExclamationCircle, IconTrash } from "@tabler/icons-react";

interface Props {
  id: string;
  file: FileWithPath;
  showDivider: boolean;
  downloadProgress?: number;
  failedToDownload?: boolean;
  onDelete: (id: string) => void;
}

const units = ["bytes", "KiB", "MiB", "GiB"];

const ImagePreview = ({
  id,
  file,
  downloadProgress,
  failedToDownload,
  showDivider,
  onDelete,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 50em)");

  const getPreview = () => {
    const imageUrl = URL.createObjectURL(file);
    if (file.type.includes("video")) {
      return (
        <video width={isMobile ? "200" : "300"} height="200" controls>
          <source
            src={imageUrl}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
            type={file.type}
          />
        </video>
      );
    }

    return (
      <Image
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        alt={id}
        h={100}
        w={100}
      />
    );
  };

  function niceBytes(bytes: number) {
    let l = 0;
    let n = bytes;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }

  return (
    <Paper bg="gray.1" p="xs" radius={0}>
      <Flex justify="space-between" align="center">
        {failedToDownload && <IconExclamationCircle color="red" strokeWidth={1.5} />}
        <div>
          {getPreview()} <Text c="dimmed">{niceBytes(file.size)}</Text>
        </div>

        {!downloadProgress && !failedToDownload && (
          <ActionIcon color="red" onClick={() => onDelete(id)} mr="lg">
            <IconTrash strokeWidth={1.5} />
          </ActionIcon>
        )}
      </Flex>

      {downloadProgress && (
        <Progress
          mt={0}
          value={downloadProgress}
          color={downloadProgress < 100 ? "blue" : "teal"}
        />
      )}

      {showDivider ? <Divider my="sm" /> : <Space dir="vertical" mb="md" />}
    </Paper>
  );
};

export default ImagePreview;
