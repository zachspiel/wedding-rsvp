import { FlowerImage } from "@spiel-wedding/common";
import RsvpSection from "@spiel-wedding/components/home/guestRsvpForm/RsvpSection";
import Gallery from "@spiel-wedding/features/Gallery";
import GuestBook from "@spiel-wedding/features/GuestBook";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import Registry from "@spiel-wedding/features/Registry";
import Jumbotron from "@spiel-wedding/features/Jumbotron";

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
    </main>
  );
}
