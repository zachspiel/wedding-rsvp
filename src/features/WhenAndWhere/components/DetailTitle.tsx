"use client";

import { Title, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  detail: string | React.ReactNode;
  className?: string;
}

const DetailTitle = ({ detail, className }: Props) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Title order={isMobile ? 4 : 2} mb="md" fw={400} className={className}>
      {detail}
    </Title>
  );
};

export default DetailTitle;
