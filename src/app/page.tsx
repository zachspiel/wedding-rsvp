import { Button } from "@mantine/core";
import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import { createClient } from "@spiel-wedding/database/server";
import FAQ from "@spiel-wedding/features/FAQ";
import Gallery from "@spiel-wedding/features/Gallery";
import GuestBook from "@spiel-wedding/features/GuestBook";
import GuestUpload from "@spiel-wedding/features/GuestPhotoUploadForm";
import Jumbotron from "@spiel-wedding/features/Jumbotron";
import RSVP from "@spiel-wedding/features/RSVP";
import Registry from "@spiel-wedding/features/Registry";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import ZachAndSedona from "@spiel-wedding/features/ZachAndSedona";
import { getEvents } from "@spiel-wedding/hooks/events";
import { getFAQs } from "@spiel-wedding/hooks/faq";
import { getPhotoGallery } from "@spiel-wedding/hooks/gallery";
import { getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import { getPlaceholderImage } from "@spiel-wedding/util/generateBlurPlaceholder";
import { IconExternalLink } from "@tabler/icons-react";

async function getProps() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const [events, gallery, guestMessages, faqs] = await Promise.all([
    getEvents(),
    getPhotoGallery(),
    getGuestMessages(),
    getFAQs(),
  ]);

  const filteredGallery = user ? gallery : gallery.filter((item) => item.isVisible);
  const blurImagePromises = filteredGallery.map((image) => getPlaceholderImage(image));
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  return { events, gallery: imagesWithBlurDataUrls, guestMessages, faqs };
}

interface Props {
  searchParams: { query: string };
}
export default async function Home({ searchParams }: Props) {
  const { events, gallery, guestMessages, faqs } = await getProps();

  return (
    <main>
      <Jumbotron />
      <ZachAndSedona />
      <WhenAndWhere />
      <RSVP events={events} />
      <GuestBook guestMessages={guestMessages} />
      <Registry />
      <FAQ faqs={faqs} query={searchParams.query} />

      <SectionContainer>
        <SectionTitle id="weddingGallery" title="Upload Reception Photos" />

        <div>
          <Button
            component="a"
            href="/weddingPhotos/gallery"
            target="_blank"
            rightSection={<IconExternalLink strokeWidth={1.5} />}
          >
            View reception gallery
          </Button>
        </div>
        <GuestUpload />
      </SectionContainer>

      <Gallery gallery={gallery} />
    </main>
  );
}
