import { Button, Group, rem, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import { IconDownload, IconFolderOpen, IconUpload, IconX } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { v4 as uuid } from "uuid";
import classes from "../guestUpload.module.css";

interface Props {
  files: Record<string, FileWithPath>;
  setFiles: Dispatch<SetStateAction<Record<string, FileWithPath>>>;
}

const ImageDropzone = ({ files, setFiles }: Props) => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        mt="lg"
        openRef={openRef}
        onDrop={(newFiles) => {
          setFiles((curr) => {
            const updatedFiles = { ...curr };
            newFiles.forEach((file) => (updatedFiles[uuid()] = file));
            return updatedFiles;
          });
        }}
        onReject={(fileRejections) => {
          showNotification({
            color: "red",
            message: `Unable to upload files. Please make sure they are an image or video.`,
          });
        }}
        className={classes.dropzone}
        radius="md"
        accept={["image/*", "video/*"]}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group justify="center" gap={0} mih={220}>
            <Dropzone.Accept>
              <IconDownload
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" ta="center" inline>
                Drag images and videos here or click to select files
              </Text>
              <Text size="sm" c="dimmed" ta="center" inline mt={7}>
                Attach as many files as you like, each file should not exceed 30mb.
              </Text>
            </div>
          </Group>
        </div>
      </Dropzone>

      <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
        leftSection={<IconFolderOpen strokeWidth={1.5} />}
      >
        Select files
      </Button>
    </div>
  );
};

export default ImageDropzone;
