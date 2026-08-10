"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.error("Swiss Trails offline support could not start:", error);
    });
  }, []);

  return null;
}
