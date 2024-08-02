import {
  Anchor,
  Breadcrumbs,
  Button,
  Container,
  Group,
  SimpleGrid,
  Title,
} from "@mantine/core";
import GuestUpload from "@spiel-wedding/components/guestUpload";
import { IconExternalLink } from "@tabler/icons-react";

const items = [
  { title: "Home", href: "/weddingPhotos" },
  { title: "Upload", href: "/weddingPhotos/upload" },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default async function UploadPhotosPage() {
  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <Breadcrumbs my="md">{items}</Breadcrumbs>

        <Title order={2} fw="normal" ta="center">
          Upload Photos & Videos
        </Title>
        <Group>
          <Button
            variant="outline"
            component="a"
            href="/weddingPhotos/gallery"
            size="lg"
            rightSection={<IconExternalLink strokeWidth={1.5} />}
          >
            🖼️ View Gallery
          </Button>
        </Group>
        <GuestUpload />
      </SimpleGrid>
    </Container>
  );
}
