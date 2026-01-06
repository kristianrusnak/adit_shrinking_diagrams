import { useLayoutEffect, useRef, useState } from "react";

export const useCenteredMessage = (
  rootRef: React.RefObject<HTMLDivElement | null>,
  position: "top" | "middle",
) => {
  const [centeredId, setCenteredId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  const getIntersectMiddle = (entries: IntersectionObserverEntry[]) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      const id = visible[0].target.getAttribute("data-id");
      setCenteredId(id);
    }
  };

  const getIntersectTop = (entries: IntersectionObserverEntry[]) => {
    const visible = entries.filter((e) => e.isIntersecting);

    if (visible.length === 0) return;

    const rootTop = visible[0].rootBounds?.top ?? 0;

    let closest = visible[0];
    let minDistance = Infinity;

    for (const entry of visible) {
      const rect = entry.boundingClientRect;
      const distance = Math.abs(rect.top - rootTop);

      if (distance < minDistance) {
        minDistance = distance;
        closest = entry;
      }
    }

    const id = closest.target.getAttribute("data-id");
    setCenteredId(id);
  };

  const intersectTopOptions = (
    root: HTMLElement,
  ): IntersectionObserverInit => ({
    root,
    rootMargin: "-25% 0px -75% 0px",
    threshold: [0, 0.01],
  });

  const intersectMiddleOptions = (
    root: HTMLElement,
  ): IntersectionObserverInit => ({
    root,
    rootMargin: "-50% 0px -50% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  // tutifruti hack - wouldnt work with a regular useEffect :)
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const options =
      position === "top"
        ? intersectTopOptions(root)
        : intersectMiddleOptions(root);

    // root is the chat container
    const observer = new IntersectionObserver((entries) => {
      if (position === "top") {
        getIntersectTop(entries);
      } else if (position === "middle") {
        getIntersectMiddle(entries);
      }
    }, options);

    observerRef.current = observer;
    elementsRef.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  const register = (_id: string) => (el: HTMLElement | null) => {
    if (!el) return;

    elementsRef.current.push(el);

    if (observerRef.current) {
      observerRef.current.observe(el);
      // console.log("Registering");
    }
  };

  return { centeredId, register };
};

export default useCenteredMessage;
