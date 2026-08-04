"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/layout/nav-bar";

export function ConditionalNav() {
  const pathname = usePathname();
  
  const hideOnRoutes = ["/login", "/register", "/signup"];
  
  if (hideOnRoutes.includes(pathname)) {
    return null;
  }
  
  return <NavBar />;
}
