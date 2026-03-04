"use client";

import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { MultiTabs } from "@/components/admin-panel/multi-tabs";
import { cn } from "@/lib/utils";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "h-screen bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 flex flex-col overflow-hidden",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
        )}
      >
        {/* children 대신 MultiTabs 컴포넌트를 렌더링하여 MDI 환경 구성 */}
        <MultiTabs />
      </main>
    </>
  );
}
