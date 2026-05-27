"use server";

import { toggleProductVisibility } from "@/lib/mock-db";
import { getSessionRole } from "@/lib/session-server";
import { revalidatePath } from "next/cache";

export async function setProductPublished(
  id: number,
  published: boolean,
): Promise<void> {
  const role = await getSessionRole();
  if (role !== "admin") {
    throw new Error("Only admins can change product visibility.");
  }

  toggleProductVisibility(id, published);
  revalidatePath("/products");
  revalidatePath("/analytics");
  revalidatePath(`/products/${id}`);
}
