"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import { createClient } from "@spiel-wedding/database/client";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { mutate } from "swr";

interface Props {
  file: GuestUploadedImage;
  savedLikes: string[];
  setLikes: (val: string[]) => void;
}

const LikeButton = ({ file, savedLikes, setLikes }: Props) => {
  const isSaved = savedLikes.includes(file.file_id);

  const toggleLike = async () => {
    const supabase = createClient();
    if (isSaved) {
      await supabase.rpc("decrement_likes", { x: 1, row_id: file.file_id });
      setLikes(savedLikes.filter((id) => id !== file.file_id));
    } else {
      await supabase.rpc("increment_likes", { x: 1, row_id: file.file_id });
      setLikes([...savedLikes, file.file_id]);
    }

    await mutate("guest_gallery");
  };

  return (
    <Group gap="xs" mr="md">
      <ActionIcon
        variant="transparent"
        c={isSaved ? "red" : "white"}
        size="xl"
        onClick={toggleLike}
      >
        {isSaved ? (
          <IconHeartFilled style={{ width: "70%", height: "70%" }} stroke={1.5} />
        ) : (
          <IconHeart style={{ width: "70%", height: "70%" }} stroke={1.5} />
        )}
      </ActionIcon>
      <Text c="dimmed">{file.likes}</Text>
    </Group>
  );
};

export default LikeButton;
