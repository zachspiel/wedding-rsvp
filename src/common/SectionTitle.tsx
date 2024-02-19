import React from "react";
import { Title } from "@mantine/core";
import classes from "./common.module.css";

interface Props {
  title: string;
  id: string;
}

const SectionTitle = (props: Props): JSX.Element => {
  return (
    <Title
      size="h1"
      id={props.id}
      className={classes.sectionTitle}
      style={{ fontWeight: 600, textAlign: "left" }}
    >
      {props.title}
    </Title>
  );
};

export default SectionTitle;
