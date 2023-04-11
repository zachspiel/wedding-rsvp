import { Title } from "@mantine/core";
import React from "react";

interface Props {
  title: string;
  id: string;
}

const SectionTitle = (props: Props): JSX.Element => {
  return (
    <Title
      order={2}
      size="h1"
      sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
      weight={900}
      align="left"
      id={props.id}
    >
      {props.title}
    </Title>
  );
};

export default SectionTitle;
