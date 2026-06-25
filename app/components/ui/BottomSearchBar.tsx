"use client";

import { useEffect, useRef } from "react";
import SearchBar from "./SearchBar";

export default function BottomSearchBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      if (!ref.current) return;
      const lifted = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      ref.current.style.transform = `translateY(-${lifted}px)`;
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ willChange: "transform" }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-bordeaux rounded-t-[2.5rem] px-4 pt-5 pb-8 transition-transform duration-200 ease-out"
    >
      <SearchBar />
    </div>
  );
}
