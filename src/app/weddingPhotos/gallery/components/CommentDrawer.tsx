import {
  Alert,
  Avatar,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { addCommentToImage } from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestImageComment, GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { formatDate } from "@spiel-wedding/util";
import { IconCalendarEvent, IconUser } from "@tabler/icons-react";
import { useEffect } from "react";
import { mutate } from "swr";
import classes from "../styles.module.css";

interface Props {
  file: GuestUploadedImage;
  comments: GuestImageComment[];
  isLoading: boolean;
  opened: boolean;
  close: () => void;
}

const CommentDrawer = ({ file, comments, isLoading, opened, close }: Props) => {
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      comment: "",
    },
    validate: {
      firstName: isNotEmpty("Please enter your first name"),
      lastName: isNotEmpty("Please enter your first name"),
      comment: isNotEmpty("Please enter a comment"),
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

  const createContainerForComment = (comment: GuestImageComment) => {
    const guestName = comment.first_name + " " + comment.last_name;
    return (
      <div key={`${comment.comment_id}-container`}>
        <Group justify="space-between">
          <Group>
            <Avatar name={guestName} alt={guestName} radius="xl" size="sm" />
            <div>
              <Text size="sm">{guestName}</Text>
              <Text size="xs" c="dimmed">
                {formatDate(new Date(comment.created_at))}
              </Text>
            </div>
          </Group>
        </Group>
        <Text
          pl={45}
          pr={20}
          size="sm"
          lineClamp={5}
          component="div"
          style={{ wordBreak: "break-all" }}
        >
          <p style={{ marginTop: 5 }}>{comment.message}</p>
        </Text>
        <Divider mb="xs" />
      </div>
    );
  };

  const handleSubmit = async () => {
    const { firstName, lastName, comment } = form.getValues();
    const result = await addCommentToImage(file.file_id, comment, firstName, lastName);

    if (result.length > 0) {
      showNotification({
        message: "Added comment!",
      });

      await mutate("comments_for_file");
    } else {
      showNotification({
        color: "red",
        message: "An error occurred. Please try again later.",
      });
    }

    window.localStorage.setItem(
      "guest-name",
      JSON.stringify({ firstName, lastName, comment: "" })
    );
    form.setFieldValue("comment", "");
  };

  if (!file) {
    return <></>;
  }

  return (
    <Drawer
      radius="md"
      opened={opened}
      onClose={close}
      title="Comments"
      offset={8}
      styles={{
        body: {
          maxHeight: "95%",
          height: "100%",
          display: "flex",
          flexFlow: "column",
        },
      }}
    >
      {isLoading && (
        <Stack gap="md">
          <Skeleton w={100} h={200} />
          <Skeleton w={100} h={200} />
          <Skeleton w={100} h={200} />
        </Stack>
      )}

      <div>
        <Group gap="md">
          <IconUser strokeWidth={1.5} color="var(--mantine-color-dimmed)" />
          <Text size="sm">
            {file.first_name} {file.last_name}
          </Text>
        </Group>
        <Group gap="md" mt="sm">
          <IconCalendarEvent strokeWidth={1.5} color="var(--mantine-color-dimmed)" />
          <Text fw="normal" size="sm">
            {formatDate(new Date(file.created_at ?? new Date().toString()))}
          </Text>
        </Group>

        <Divider my="md" />
      </div>

      <ScrollArea className={classes.commentsContainer} type="always">
        {!isLoading && file !== null && (
          <>
            {comments.map(createContainerForComment)}

            {comments.length === 0 && !isLoading && (
              <Alert variant="light" color="blue" my="md">
                No comments added. Be the first!
              </Alert>
            )}
          </>
        )}
      </ScrollArea>

      <div className={classes.drawerFooter}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group mb="md">
            <TextInput
              {...form.getInputProps("firstName")}
              placeholder="Enter your first name"
              label="First Name"
              error={form.errors.firstName}
              mr="md"
            />
            <TextInput
              {...form.getInputProps("lastName")}
              placeholder="Enter your last name"
              label="Last Name"
              error={form.errors.lastName}
            />
          </Group>
          <Textarea
            {...form.getInputProps("comment")}
            placeholder="Add a comment"
            label="Message"
            error={form.errors.comment}
            mb="md"
            minRows={2}
            maxRows={4}
          />
          <Button type="submit" disabled={isLoading}>
            Post
          </Button>
        </form>
      </div>
    </Drawer>
  );
};

export default CommentDrawer;
