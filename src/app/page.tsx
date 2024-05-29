import Gallery from "@spiel-wedding/features/Gallery";
import GuestBook from "@spiel-wedding/features/GuestBook";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import Registry from "@spiel-wedding/features/Registry";
import Jumbotron from "@spiel-wedding/features/Jumbotron";
import PatricAndCariza from "@spiel-wedding/features/PatricAndCariza";
import RSVP from "@spiel-wedding/features/RSVP";
import FAQ from "@spiel-wedding/features/FAQ";

export default function Home() {
  return (
    <main>
      <Jumbotron />
      <PatricAndCariza />
      <WhenAndWhere />
      <RSVP />
      <GuestBook />
      <Registry />
      <FAQ />
      <Gallery />
    </main>
  );
}
