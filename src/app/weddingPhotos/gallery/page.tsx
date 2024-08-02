import {
  Anchor,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Title,
} from "@mantine/core";
import GoogleDriveImage from "@spiel-wedding/components/guestUpload/GoogleDriveImage";
import { getDriveServive } from "@spiel-wedding/hooks/googleDrive";
import { UploadedPhotoGallery } from "@spiel-wedding/types/Photo";
import { IconExternalLink } from "@tabler/icons-react";

async function getProps() {
  const driveService = getDriveServive();

  const response = await driveService.files.list({
    pageSize: 10,
    q: `'${process.env.PARENT_FOLDER}' in parents`,
    fields: "nextPageToken, files(id, name)",
  });

  const gallery: UploadedPhotoGallery = { files: response.data.files ?? [] };

  return { gallery };
}

const items = [
  { title: "Home", href: "/weddingPhotos" },
  { title: "Gallery", href: "/weddingPhotos/gallery" },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default async function GalleryPage() {
  const { gallery } = await getProps();

  return (
    <>
      <Container>
        <SimpleGrid cols={1} pb="xl">
          <Breadcrumbs my="md">{items}</Breadcrumbs>

          <Title order={1} fw="normal" ta="center" mt="lg">
            Wedding Gallery 🖼️
          </Title>
        </SimpleGrid>
      </Container>

      <Group mx="xl">
        <Button
          variant="outline"
          component="a"
          href="/weddingPhotos/upload"
          size="lg"
          rightSection={<IconExternalLink strokeWidth={1.5} />}
        >
          📷 Upload Photos
        </Button>
      </Group>

      <SimpleGrid
        mx="md"
        spacing={{
          base: "sm",
          lg: "lg",
          md: "md",
        }}
        mt="lg"
        p="sm"
        cols={{
          lg: 4,
          md: 4,
          sm: 2,
          xs: 1,
        }}
      >
        {gallery.files.map((file) => (
          <Card withBorder h={300}>
            <GoogleDriveImage id={file?.id ?? ""} key={file?.id} />
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
