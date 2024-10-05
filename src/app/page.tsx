import { Alert, Button, Text } from "@mantine/core";
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
import { IconInfoCircle } from "@tabler/icons-react";

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

  const deadline = new Date("9/26/2024");
  const currentDate = new Date();

  const difference = deadline.getTime() - currentDate.getTime();

  const alertMessage = {
    info: "Please RSVP no later than September 26th 2024.",
    color: "teal",
    hideSearch: false,
  };

  if (difference < 0) {
    alertMessage.info = `The RSVP deadline has passed. Please reach out to the bride or groom to make any changes to your RSVP status.`;
    alertMessage.color = "red";
    alertMessage.hideSearch = true;
  }

  return { events, gallery: imagesWithBlurDataUrls, guestMessages, faqs, alertMessage };
}

export default async function Home() {
  const { events, gallery, guestMessages, faqs, alertMessage } = await getProps();

  return (
    <main>
      <Jumbotron />
      <ZachAndSedona />
      <WhenAndWhere />
      <RSVP events={events} alertMessage={alertMessage} />
      <GuestBook guestMessages={guestMessages} />
      <Registry />

      <FAQ faqs={faqs} />

      <SectionContainer>
        <SectionTitle id="uploadPhotos" title="Upload Photos" />
        <Alert
          variant="light"
          color="teal"
          icon={<IconInfoCircle style={{ marginTop: "12px" }} />}
        >
          <Text size="sm" inline>
            Please use the form to upload photos of the reception.
          </Text>
          <Button
            component="a"
            href="/weddingPhotos/gallery"
            variant="transparent"
            color="blue"
            p={0}
          >
            Click here to view the gallery.
          </Button>
        </Alert>
        <GuestUpload />
      </SectionContainer>

      <Gallery gallery={gallery} />
    </main>
  );
}
