import { Container, SimpleGrid, Title } from "@mantine/core";
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
      </Container>

      <GuestGallery searchParams={searchParams} />
    </>
  );
}
