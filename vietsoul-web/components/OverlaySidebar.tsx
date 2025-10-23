"use client";

import { useUIStore } from "../store/ui";
import Sidebar from "./Sidebar";

export default function OverlaySidebar() {
  const open = useUIStore((s) => s.sidebarOpen);
  const close = useUIStore((s) => s.closeSidebar);
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="absolute left-2 top-2 right-2">
        <Sidebar />
      </div>
    </div>
  );
}


