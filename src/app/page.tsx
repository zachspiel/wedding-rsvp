import Gallery from "@spiel-wedding/features/Gallery";
import GuestBook from "@spiel-wedding/features/GuestBook";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import Registry from "@spiel-wedding/features/Registry";
import Jumbotron from "@spiel-wedding/features/Jumbotron";
import ZachAndSedona from "@spiel-wedding/features/ZachAndSedona";
import RSVP from "@spiel-wedding/features/RSVP";
import FAQ from "@spiel-wedding/features/FAQ";
import { getPhotoGallery } from "@spiel-wedding/hooks/gallery";
import { getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import { getEvents } from "@spiel-wedding/hooks/events";
import { createClient } from "@spiel-wedding/database/server";

async function getProps() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const [events, gallery, guestMessages] = await Promise.all([
    getEvents(),
    getPhotoGallery(),
    getGuestMessages(),
  ]);

  const filteredGallery = user ? gallery : gallery.filter((item) => item.isVisible);

  return { events, gallery: filteredGallery, guestMessages };
}

export default async function Home() {
  const { events, gallery, guestMessages } = await getProps();

  return (
    <main>
      <Jumbotron />
      <ZachAndSedona />
      <WhenAndWhere />
      <RSVP events={events} />
      <GuestBook guestMessages={guestMessages} />
      <Registry />
      <FAQ />
      <Gallery gallery={gallery} />
    </main>
  );
}
