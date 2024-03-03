import { Container, SimpleGrid } from "@mantine/core";
import classes from "./common.module.css";
import Image from "next/image";
import cx from "clsx";

interface Props {
  children: React.ReactNode;
  grayBackground?: boolean;
  flowerImages?: boolean;
}

const SectionContainer = ({
  children,
  grayBackground,
  flowerImages,
}: Props): JSX.Element => {
  return (
    <Container
      style={{
        backgroundColor: grayBackground ? "hsl(86, 6.3%, 80%)" : "",
      }}
      fluid
      className={classes.sectionContainer}
    >
      <Container style={{ padding: 0 }}>
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
            paddingBottom: grayBackground ? "1rem" : "5rem",
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
