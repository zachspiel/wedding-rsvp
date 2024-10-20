"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import { createClient } from "@spiel-wedding/database/client";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { mutate } from "swr";

interface Props {
  id: string;
  likes: number;
  rpc: string;
  swrKey: string;
  savedLikes: string[];
  color: string;
  setLikes: (val: string[]) => void;
}

const LikeButton = ({ id, likes, rpc, savedLikes, swrKey, color, setLikes }: Props) => {
  const isSaved = savedLikes.includes(id);

  const toggleLike = async () => {
    const supabase = createClient();
    if (isSaved) {
      await supabase.rpc(`decrement_${rpc}`, { x: 1, row_id: id });
      setLikes(savedLikes.filter((id) => id !== id));
    } else {
      await supabase.rpc(`increment_${rpc}`, { x: 1, row_id: id });
      setLikes([...savedLikes, id]);
    }

    await mutate(swrKey);
  };

  return (
    <Group gap="xs" mr="md">
      <ActionIcon
        variant="transparent"
        c={isSaved ? "red" : color}
        size="xl"
        onClick={toggleLike}
      >
        {isSaved ? (
          <IconHeartFilled style={{ width: "70%", height: "70%" }} stroke={1.5} />
        ) : (
          <IconHeart style={{ width: "70%", height: "70%" }} stroke={1.5} />
        )}
      </ActionIcon>
      <Text c="dimmed">{likes}</Text>
    </Group>
  );
};

export default LikeButton;
