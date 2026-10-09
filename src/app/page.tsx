import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import { GALLERY_STORAGE_BUCKET } from "@spiel-wedding/constants";
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
import { Photo } from "@spiel-wedding/types/Photo";
import { generatePlaceholder } from "@spiel-wedding/util/generateBlurPlaceholder";

async function chunkRequestsForGallery(gallery: Photo[]): Promise<Photo[]> {
  const results: Photo[] = [];
  for (let i = 0; i < gallery.length; i += 5) {
    const chunk = gallery.slice(i, i + 5);
    const chunkedImageResults = await Promise.all(chunk.map(getPlaceholderImage));
    results.push(...chunkedImageResults);
  }
  return results;
}

export async function getPlaceholderImage(photo: Photo): Promise<Photo> {
  const blurDataUrl = await generatePlaceholder({
    imagePath: photo.imagePath,
    bucket: GALLERY_STORAGE_BUCKET,
  });

  return blurDataUrl ? { ...photo, blurDataUrl } : photo;
}

async function getProps() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const [events, gallery, guestMessages, faqs] = await Promise.all([
    getEvents(),
    getPhotoGallery(),
    getGuestMessages(),
    getFAQs(),
  ]);

  const filteredGallery = user ? gallery : gallery.filter((item) => item.isVisible);
  const imagesWithBlurDataUrls = await chunkRequestsForGallery(filteredGallery);

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

        <GuestUpload />
      </SectionContainer>

      <Gallery gallery={gallery} />
    </main>
  );
}
