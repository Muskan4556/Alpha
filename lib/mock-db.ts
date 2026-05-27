import "server-only";

const globalStore = globalThis as typeof globalThis & {
  __alphaHiddenProductIds?: Set<number>;
};

// Shared in-memory store for hidden product ids 
export const hiddenProductIds =
  globalStore.__alphaHiddenProductIds ??
  (globalStore.__alphaHiddenProductIds = new Set<number>());

export function toggleProductVisibility(id: number, isPublished: boolean) {
  if (isPublished) {
    hiddenProductIds.delete(id);
  } else {
    hiddenProductIds.add(id);
  }
}
