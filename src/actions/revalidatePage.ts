"use server";

import { revalidatePath } from "next/cache";

export default async function revalidatePage(path: string) {
  revalidatePath(path);
}
