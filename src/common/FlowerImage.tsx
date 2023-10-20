import { Flex } from "@mantine/core";
import Image from "next/image";
import flowerImage from "../assets/images/green-flower.webp";

const FlowerImage = (): JSX.Element => {
  return (
    <Flex justify="center">
      <Image
        src={flowerImage}
        height={125}
        style={{ marginTop: "-65px" }}
        alt="Flower Image"
      />
    </Flex>
  );
};

export default FlowerImage;
