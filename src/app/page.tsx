import { AdminViewToggle, FlowerImage } from "@spiel-wedding/common";
import Jumbotron from "@spiel-wedding/components/home/Jumbotron";
import Gallery from "@spiel-wedding/components/home/gallery/Gallery";
import GuestBook from "@spiel-wedding/components/home/guestBook/GuestBook";
import RsvpSection from "@spiel-wedding/components/home/guestRsvpForm/RsvpSection";
import Registry from "@spiel-wedding/components/home/registry/Registry";
import WhenAndWhere from "@spiel-wedding/components/home/whenAndWhere/WhenAndWhere";

export default function Home() {
  return (
    <main>
      <Jumbotron />
      <WhenAndWhere />
      <FlowerImage />
      <RsvpSection />
      <GuestBook />
      <FlowerImage />
      <Registry />
      <Gallery />
      <AdminViewToggle />
    </main>
  );
}
