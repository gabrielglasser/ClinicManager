"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      redirect("/auth/login");
    } else {
      redirect("/dashboard");
    }
  }, []);

  return null;
}
