"use client";

import { Suspense } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import PlayerBar from "../../components/PlayerBar";
import { PageTransition } from "../../components/PageTransition";
import OverlaySidebar from "../../components/OverlaySidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-2 p-2 h-full pb-20">
        <aside className="h-full hidden md:block">
          <Sidebar />
        </aside>
        <main className="h-full rounded-lg bg-white/5 ring-1 ring-white/10 overflow-hidden backdrop-blur-sm">
          <Suspense fallback={
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
              <div className="text-neutral-400">Loading...</div>
            </div>
          }>
            <Topbar />
          </Suspense>
          <div className="h-[calc(100%-56px)] overflow-auto p-6">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
      <PlayerBar />
      <OverlaySidebar />
    </div>
  );
}
