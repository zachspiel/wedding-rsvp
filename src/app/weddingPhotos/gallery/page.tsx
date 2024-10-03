import { Container, SimpleGrid, Title } from "@mantine/core";
import { getDriveServive } from "@spiel-wedding/hooks/googleDrive";
import { UploadedPhotoGallery } from "@spiel-wedding/types/Photo";
import GuestGallery from "./components/GuestGallery";

async function getProps() {
  const driveService = getDriveServive();

  const response = await driveService.files.list({
    q: `'${process.env.PARENT_FOLDER}' in parents`,
    fields: "nextPageToken, files(id, name, mimeType)",
  });

  const gallery: UploadedPhotoGallery = { files: response.data.files ?? [] };

  return { gallery };
}

export default async function GalleryPage() {
  const { gallery } = await getProps();

  return (
    <>
      <Container>
        <SimpleGrid cols={1} pb="xl">
          <Title order={1} fw="normal" ta="center" mt="lg">
            Reception Photo Gallery
          </Title>
        </SimpleGrid>
      </Container>

      <GuestGallery gallery={gallery} />
    </>
  );
}
