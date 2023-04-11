import React from "react";
import { Title } from "@mantine/core";

interface Props {
  title: string;
  id: string;
}

const SectionTitle = (props: Props): JSX.Element => {
  return (
    <Title
      order={2}
      size="h1"
      sx={(theme): Record<string, string> => ({ fontFamily: `Poppins, sans-serif` })}
      weight={900}
      align="left"
      id={props.id}
    >
      {props.title}
    </Title>
  );
};

export default SectionTitle;
