import { getPhotoGallery } from "@spiel-wedding/hooks/gallery";
import { describe, expect, it } from "vitest";

describe("Gallery", () => {
  it("Gets all visible images", async () => {
    const gallery = await getPhotoGallery();

    expect(gallery !== null).toBeTruthy();
    expect(gallery.length).toBeGreaterThan(0);
  });
});
