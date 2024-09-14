import { getPhotoGallery } from "@spiel-wedding/hooks/gallery";
import { RsvpResponse } from "@spiel-wedding/types/Guest";
import { createNewResponse } from "@spiel-wedding/util";
import { getPlaceholderImage } from "@spiel-wedding/util/generateBlurPlaceholder";
import { expect, test } from "vitest";

test("Create new event response", () => {
  const newEventResponse = createNewResponse("guest-id-1", "event-id-1");

  expect(newEventResponse.guestId).toBe("guest-id-1");
  expect(newEventResponse.eventId).toBe("event-id-1");
  expect(newEventResponse.rsvp).toBe(RsvpResponse.NO_RESPONSE);
});

test("Create placeholder image", async () => {
  const gallery = await getPhotoGallery();

  const placeholderImage = await getPlaceholderImage(gallery[0]);

  expect(placeholderImage).toBeDefined();
  expect(placeholderImage.blurDataUrl).toBeDefined();
});
