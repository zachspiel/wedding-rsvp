import { Container, SimpleGrid, Title } from "@mantine/core";
import GalleryBanner from "@spiel-wedding/features/GuestPhotoUploadForm/components/GalleryBanner";
import GuestGallery from "./components/GuestGallery";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <>
      <Container>
        <SimpleGrid cols={1} pb="xl">
          <Title order={1} fw="normal" ta="center" mt="lg">
            Reception Photo Gallery
          </Title>
        </SimpleGrid>

        <GalleryBanner displayText="UPLOAD" />
      </Container>

      <GuestGallery />
    </>
  );
}
