"use client";

import { useEffect, useRef } from "react";

let lockCount = 0;
let savedScrollY = 0;
let originalOverflow = "";
let originalPosition = "";
let originalTop = "";
let originalWidth = "";

export function useScrollLock(active: boolean) {
  const hasLock = useRef(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    const { style } = document.body;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      originalOverflow = style.overflow;
      originalPosition = style.position;
      originalTop = style.top;
      originalWidth = style.width;

      style.overflow = "hidden";
      style.position = "fixed";
      style.top = `-${savedScrollY}px`;
      style.width = "100%";
    }

    lockCount += 1;
    hasLock.current = true;

    return () => {
      if (!hasLock.current) {
        return;
      }

      lockCount = Math.max(0, lockCount - 1);
      hasLock.current = false;

      if (lockCount === 0) {
        style.overflow = originalOverflow;
        style.position = originalPosition;
        style.top = originalTop;
        style.width = originalWidth;
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [active]);
}
