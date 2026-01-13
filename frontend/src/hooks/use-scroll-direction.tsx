import { useEffect, useState, useRef } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const lastScrollY = useRef(0);
  const accumulatedDelta = useRef(0);
  const THRESHOLD = 5; // Change for sensitivity

  useEffect(() => {
    lastScrollY.current = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const delta = scrollY - lastScrollY.current;

      accumulatedDelta.current += delta;

      if (Math.abs(accumulatedDelta.current) >= THRESHOLD) {
        const direction = accumulatedDelta.current > 0 ? "down" : "up";
        setScrollDirection(direction);
        accumulatedDelta.current = 0; // Reset after direction change
      }

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return scrollDirection;
}