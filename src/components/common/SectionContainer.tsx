import { Container, SimpleGrid } from "@mantine/core";
import cx from "clsx";
import Image from "next/image";
import classes from "./common.module.css";

interface Props {
  children: React.ReactNode;
  greenBackground?: boolean;
  flowerImages?: boolean;
}

const SectionContainer = ({
  children,
  greenBackground,
  flowerImages,
}: Props): JSX.Element => {
  return (
    <Container
      className={greenBackground ? classes.sectionContainerGreenBackground : ""}
      fluid
      pos="relative"
      mih={flowerImages ? "75vh" : undefined}
    >
      <Container style={{ padding: 0 }}>
        {flowerImages && (
          <Image
            src="/assets/images/container-flower.png"
            width={375}
            height={375}
            className={cx(classes.flowerImage, classes.flowerImageLeft)}
            alt="Flower image left"
          />
        )}

        <SimpleGrid
          cols={1}
          style={{
            paddingBottom: greenBackground ? "1rem" : "5rem",
          }}
        >
          {children}
        </SimpleGrid>

        {flowerImages && (
          <Image
            src="/assets/images/container-flower.png"
            width={375}
            height={375}
            alt="Flower image right"
            className={cx(classes.flowerImage, classes.flowerImageRight)}
          />
        )}
      </Container>
    </Container>
  );
};

export default SectionContainer;
