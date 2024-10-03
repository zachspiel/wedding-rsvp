import { ActionIcon, Divider, Flex, Image, Progress, Space } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { IconTrash, IconVideo } from "@tabler/icons-react";

interface Props {
  id: string;
  file: FileWithPath;
  showDivider: boolean;
  downloadProgress?: number;

  onDelete: (id: string) => void;
}
const ImagePreview = ({ id, file, downloadProgress, showDivider, onDelete }: Props) => {
  const getPreview = () => {
    if (file.type.includes("video")) {
      return <IconVideo width={50} height={50} strokeWidth={1.5} />;
    }

    const imageUrl = URL.createObjectURL(file);

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

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Flex justify="space-between">
        {getPreview()}

        {!downloadProgress && (
          <ActionIcon color="red" onClick={() => onDelete(id)}>
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

      {showDivider ? <Divider my="xs" /> : <Space dir="vertical" mb="md" />}
    </div>
  );
};

export default ImagePreview;
