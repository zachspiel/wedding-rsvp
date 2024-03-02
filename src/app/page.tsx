import Jumbotron from "@spiel-wedding/components/home/Jumbotron";
import Gallery from "@spiel-wedding/components/home/gallery/Gallery";
import GuestBook from "@spiel-wedding/components/home/guestBook/GuestBook";
import RsvpSection from "@spiel-wedding/components/home/guestRsvpForm/RsvpSection";
import Registry from "@spiel-wedding/components/home/registry/Registry";
import WhenAndWhere from "@spiel-wedding/components/home/whenAndWhere/WhenAndWhere";
import ZachAndSedona from "@spiel-wedding/components/home/zachAndSedona/ZachAndSedona";

export default function Home() {
  return (
    <main>
      <Jumbotron />
      <ZachAndSedona />
      <WhenAndWhere />
      <RsvpSection />
      <GuestBook />
      <Registry />
      <Gallery />
    </main>
  );
}
