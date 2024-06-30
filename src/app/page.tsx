import FAQ from "@spiel-wedding/features/FAQ";
import Gallery from "@spiel-wedding/features/Gallery";
import GuestBook from "@spiel-wedding/features/GuestBook";
import Jumbotron from "@spiel-wedding/features/Jumbotron";
import RSVP from "@spiel-wedding/features/RSVP";
import Registry from "@spiel-wedding/features/Registry";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import ZachAndSedona from "@spiel-wedding/features/ZachAndSedona";
import { getEvents } from "@spiel-wedding/hooks/events";
import { getPhotoGallery } from "@spiel-wedding/hooks/gallery";
import { getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getProps() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
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
