"use client";

import { useAuth } from "../../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import PlayerBar from "../../components/PlayerBar";
import { PageTransition } from "../../components/PageTransition";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't check auth for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
        router.push("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  // Show login page directly without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-neutral-900">
        <div className="text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-dvh grid grid-rows-[1fr_auto] grid-cols-1">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-2 p-2 pb-0">
        <aside className="h-full hidden md:block">
          <AdminSidebar />
        </aside>
        <main className="h-full rounded-lg bg-neutral-900/40 ring-1 ring-white/5 overflow-hidden">
          <AdminTopbar />
          <div className="h-[calc(100%-56px)] overflow-auto p-6">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
      <footer className="px-2 pb-2">
        <PlayerBar />
      </footer>
    </div>
  );
}
