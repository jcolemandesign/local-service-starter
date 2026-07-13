"use client";

import { useEffect } from "react";

export function RecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));

    if (params.get("type") !== "recovery") {
      return;
    }

    window.location.replace(`/update-password${hash}`);
  }, []);

  return null;
}
