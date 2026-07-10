"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full">
      <Sidebar open={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        {children}
      </div>
    </div>
  );
}
