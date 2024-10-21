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
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  addCommentToImage,
  getCommentsForImage,
} from "@spiel-wedding/hooks/guestUploadedImages";
import { GuestImageComment, GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { formatDate } from "@spiel-wedding/util";
import { IconClock, IconUser } from "@tabler/icons-react";
import { useEffect } from "react";
import useSWR from "swr";
import classes from "../styles.module.css";

interface Props {
  file: GuestUploadedImage;
  opened: boolean;
  close: () => void;
}

const CommentDrawer = ({ file, opened, close }: Props) => {
  const [likedComments, setLikedComments] = useLocalStorage<string[]>({
    key: "liked_comments",
    defaultValue: [],
  });

  const {
    data: comments,
    isLoading,
    mutate,
  } = useSWR(
    file == null ? null : "comments_for_file",
    (key) => getCommentsForImage(file.file_id),
    {
      fallbackData: [],
    }
  );

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
          pl={54}
          size="sm"
          mb="sm"
          lineClamp={3}
          component="div"
          style={{ wordBreak: "break-all" }}
        >
          <p>{comment.message}</p>
        </Text>
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

      await mutate();
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
    <Drawer radius="md" opened={opened} onClose={close} title="Comments">
      <Stack gap={0}>
        {isLoading && (
          <>
            <Skeleton w={100} h={200} />
            <Skeleton w={100} h={200} />
            <Skeleton w={100} h={200} />
          </>
        )}

        <Group gap="md">
          <IconUser strokeWidth={1.5} />
          <Text size="sm" c="dimmed">
            {file.first_name} {file.last_name}
          </Text>
        </Group>

        <Group gap="md" mt="sm">
          <IconClock strokeWidth={1.5} />
          <Text fw="normal" size="sm" c="dimmed">
            {formatDate(new Date(file.created_at ?? new Date().toString()))}
          </Text>
        </Group>

        <Divider my="md" />

        <ScrollArea style={{ flex: 1 }} display="flex">
          {comments.map(createContainerForComment)}

          {comments.length === 0 && !isLoading && (
            <Alert variant="light" color="blue" my="md">
              No comments added. Be the first!
            </Alert>
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
            <Button type="submit">Post</Button>
          </form>
        </div>
      </Stack>
    </Drawer>
  );
};

export default CommentDrawer;
