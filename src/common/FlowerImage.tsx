"use client";
import { Image } from "@mantine/core";

const FlowerImage = (): JSX.Element => {
  return (
    <Image
      src="/assets/images/green-flower.webp"
      fit="contain"
      height="125px"
      sx={{ marginTop: "-65px" }}
      alt="Flower Image"
    />
  );
};

export default FlowerImage;
