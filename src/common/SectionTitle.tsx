import React from "react";
import { Flex, Title } from "@mantine/core";
import classes from "./common.module.css";
import Image from "next/image";
import cx from "clsx";

interface Props {
  title: string;
  hideFlowers?: boolean;
  id?: string;
}

const SectionTitle = ({ title, hideFlowers, id }: Props): JSX.Element => {
  return (
    <Flex
      justify="center"
      direction="column"
      w="100%"
      align="center"
      mb="xl"
      style={{ marginTop: "3rem" }}
      className={classes.sectionTitleContainer}
      id={id}
    >
      <Image
        src="/assets/images/flower-divider-top.png"
        alt="Flower top"
        width={400}
        height={100}
        className={cx(classes.flowerDivider, hideFlowers ? classes.hidden : "")}
      />
      <Title
        size="h1"
        className={classes.sectionTitle}
        style={{ fontWeight: 600, textAlign: "left" }}
        w="initial"
      >
        {title}
      </Title>

      <Image
        src="/assets/images/flower-divider-bottom.png"
        alt="Flower bottom"
        width={400}
        height={100}
        className={cx(classes.flowerDivider, hideFlowers ? classes.hidden : "")}
      />
    </Flex>
  );
};

export default SectionTitle;
