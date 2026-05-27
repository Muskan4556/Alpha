"use client";

import { useEffect, useRef } from "react";

export function useRefetchOnTabVisible(
  enabled: boolean,
  refetch: () => void | Promise<void>,
) {
  const refetchRef = useRef(refetch);

  useEffect(() => {
    refetchRef.current = refetch;
  });

  useEffect(() => {
    if (!enabled) return;

    function onVisible() {
      if (document.visibilityState === "visible") {
        refetchRef.current();
      }
    }

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [enabled]);
}
