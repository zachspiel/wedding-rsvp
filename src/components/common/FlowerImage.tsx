import React from "react";
import { Image } from "@mantine/core";
import flowers from "../../assets/images/green-flower.webp";

const FlowerImage = (): JSX.Element => {
  return (
    <Image
      src={flowers}
      fit="contain"
      height="125px"
      sx={{ marginTop: "-65px" }}
      alt="Flower Image"
    />
  );
};

export default FlowerImage;
