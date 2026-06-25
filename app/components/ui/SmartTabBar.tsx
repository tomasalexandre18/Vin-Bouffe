"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import TabBar from "./TabBar";
import safeFrom from "@/libs/safeFrom";

function Inner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === "/") return null;

  const backUrl = pathname.startsWith("/recette/")
    ? safeFrom(searchParams.get("from") ?? undefined, "/")
    : "/";

  return <TabBar backUrl={backUrl} />;
}

export default function SmartTabBar() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
