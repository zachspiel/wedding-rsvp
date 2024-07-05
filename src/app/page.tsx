import { createClient } from "@spiel-wedding/database/server";
import GuestBook from "@spiel-wedding/features/GuestBook";
import Jumbotron from "@spiel-wedding/features/Jumbotron";
import RSVP from "@spiel-wedding/features/RSVP";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import ZachAndSedona from "@spiel-wedding/features/ZachAndSedona";
import { getEvents } from "@spiel-wedding/hooks/events";
import { getFAQs } from "@spiel-wedding/hooks/faq";
import { getPhotoGallery } from "@spiel-wedding/hooks/gallery";
import { getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import { getPlaceholderImage } from "@spiel-wedding/util/generateBlurPlaceholder";

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

export default async function Home() {
  const { events, gallery, guestMessages, faqs } = await getProps();

  return (
    <main>
      <Jumbotron />
      <ZachAndSedona />
      <WhenAndWhere />
      <RSVP events={events} />
      <GuestBook guestMessages={guestMessages} />
      {/*<Registry />
      <FAQ faqs={faqs} />
      <Gallery gallery={gallery} />*/}
    </main>
  );
}
