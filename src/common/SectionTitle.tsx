import React from "react";
import { Center, Flex, Stack, Title } from "@mantine/core";
import classes from "./common.module.css";
import Image from "next/image";

interface Props {
  title: string;
  id: string;
}

const SectionTitle = (props: Props): JSX.Element => {
  return (
    <Flex
      justify="center"
      direction="column"
      w="100%"
      align="center"
      mb="xl"
      id={props.id}
    >
      <Image
        src="https://images.zola.com/723f79df-4627-4699-af22-2759453ca0a3?w=400"
        alt="Flower top"
        width={400}
        height={100}
      />
      <Title
        size="h1"
        className={classes.sectionTitle}
        style={{ fontWeight: 600, textAlign: "left" }}
        w="initial"
      >
        {props.title}
      </Title>

      <Image
        src="https://images.zola.com/0a0487b7-1629-4e21-9e11-26933de0df18?w=400"
        alt="Flower bottom"
        width={400}
        height={100}
      />
    </Flex>
  );
};

export default SectionTitle;
