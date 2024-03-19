import { Container, SimpleGrid } from "@mantine/core";
import classes from "./common.module.css";
import Image from "next/image";
import cx from "clsx";

interface Props {
  children: React.ReactNode;
  greenBackground?: boolean;
  flowerImages?: boolean;
  id?: string;
}

const SectionContainer = ({
  children,
  greenBackground,
  flowerImages,
  id,
}: Props): JSX.Element => {
  return (
    <Container
      style={{
        backgroundColor: greenBackground ? "hsl(86, 6.3%, 80%)" : "",
      }}
      fluid
      pos="relative"
    >
      <Container style={{ padding: 0 }} id={id}>
        {flowerImages && (
          <Image
            src="/assets/images/container-flower.png"
            width={475}
            height={475}
            className={cx(classes.flowerImage, classes.flowerImageLeft)}
            alt="Flower image left"
          />
        )}

        <SimpleGrid
          cols={1}
          style={{
            paddingTop: "3rem",
            paddingBottom: greenBackground ? "1rem" : "5rem",
          }}
        >
          {children}
        </SimpleGrid>

        {flowerImages && (
          <Image
            src="/assets/images/container-flower.png"
            width={475}
            height={475}
            alt="Flower image right"
            className={cx(classes.flowerImage, classes.flowerImageRight)}
          />
        )}
      </Container>
    </Container>
  );
};

export default SectionContainer;
