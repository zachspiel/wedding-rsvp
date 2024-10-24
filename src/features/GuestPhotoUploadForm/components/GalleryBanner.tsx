import { Anchor, Button, Container, Group, Image, Text, Title } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import classes from "../guestUpload.module.css";
import image from "./weddingBanner.svg";

interface Props {
  displayText: "UPLOAD" | "GALLERY";
}

const GalleryBanner = ({ displayText }: Props) => {
  const uploadText = {
    title: "Want to upload photos?",
    link: "/#uploadPhotos",
    buttonText: "Upload photos",
  };

  const galleryText = {
    title: "Looking for the reception photo gallery?",
    link: "/weddingPhotos/gallery",
    buttonText: " View gallery",
  };

  const textProps = displayText === "UPLOAD" ? uploadText : galleryText;

  return (
    <Container size="md" className={classes.container}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>{textProps.title}</Title>

          <Text c="dimmed" mt="md">
            Please navigate to{" "}
            <Anchor href={textProps.link} c="blue">
              {textProps.link}
            </Anchor>{" "}
            or use the button below.
          </Text>

          <Group mt={30}>
            <Button
              component="a"
              href={textProps.link}
              radius="xl"
              size="md"
              className={classes.control}
              rightSection={<IconExternalLink />}
            >
              {textProps.buttonText}
            </Button>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} alt="Wedding banner image" />
      </div>
    </Container>
  );
};

export default GalleryBanner;
