import { Container, SimpleGrid, Title } from "@mantine/core";
import GalleryBanner from "@spiel-wedding/features/GuestPhotoUploadForm/components/GalleryBanner";
import { getGuestImages } from "@spiel-wedding/hooks/guestUploadedImages";
import { generatePlaceholder } from "@spiel-wedding/util/generateBlurPlaceholder";
import GuestGallery from "./components/GuestGallery";

async function getProps() {
  const guestUploadedImages = await getGuestImages();

  return await Promise.all(
    guestUploadedImages.map(async (image) =>
      generatePlaceholder({ imagePath: image.file_name, bucket: "guest_gallery" })
    )
  );
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const placeHolderImages = await getProps();

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

      <GuestGallery placeHolderImages={placeHolderImages} />
    </>
  );
}
