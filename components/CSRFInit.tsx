"use client";
import { useEffect } from "react";

export default function CSRFInit() {
  useEffect(() => {
    fetch("/api/csrf", { credentials: "include" });
  }, []);

  return null;
}
