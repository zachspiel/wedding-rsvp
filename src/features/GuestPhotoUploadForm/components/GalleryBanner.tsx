import { Anchor, Button, Container, Group, Image, Text, Title } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import classes from "../guestUpload.module.css";
import image from "./weddingBanner.svg";

const GalleryBanner = () => {
  return (
    <Container size="md" className={classes.container}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Looking for the reception photo gallery?
          </Title>

          <Text c="dimmed" mt="md">
            Please navigate to{" "}
            <Anchor href="/weddingPhotos/gallery" c="blue">
              /weddingPhotos/gallery
            </Anchor>{" "}
            or use the button below.
          </Text>

          <Group mt={30}>
            <Button
              component="a"
              href="/weddingPhotos/gallery"
              radius="xl"
              size="md"
              className={classes.control}
              rightSection={<IconExternalLink />}
            >
              View gallery
            </Button>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} alt="Wedding banner image" />
      </div>
    </Container>
  );
};

export default GalleryBanner;
