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
      id={props.id}
      style={{ fontWeight: 600, textAlign: "left" }}
    >
      {props.title}
    </Title>
  );
};

export default SectionTitle;
