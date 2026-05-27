import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getSession } from "@/lib/session-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session} />
      <SidebarInset className="bg-[#0b1512]">
        <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b border-white/5 bg-[#0b1512]/50 px-4 md:px-6 backdrop-blur-md">
          <SidebarTrigger className="-ml-1 text-white/50 hover:bg-white/5 hover:text-white transition-colors" />
          <div className="h-4 w-px bg-white/5 mx-1 sm:mx-2" />
          <h1 className="text-base md:text-lg font-semibold text-white/80">
            Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.03),transparent_50%)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
