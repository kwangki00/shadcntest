"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTabStore } from "@/hooks/use-tab-store";
import { getPageComponent } from "@/lib/page-registry";

export function MultiTabs() {
  const { tabs, activeTab, setActiveTab, removeTab } = useTabStore();
  const router = useRouter();

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-muted-foreground">
        <p>열려있는 탭이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          router.push(value);
        }}
        className="w-full flex flex-col h-full"
      >
        <div className="px-4 pt-2 bg-background border-b">
          <TabsList className="flex justify-start w-full h-auto p-0 gap-1 bg-transparent overflow-x-auto scrollbar-hide rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "relative group flex items-center gap-2 py-2 h-9 rounded-t-md rounded-b-none border border-b-0 min-w-fit",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary",
                  "data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground",
                  "pr-7 pl-3",
                )}
              >
                <span className="text-sm">{tab.label}</span>
                <div
                  role="button"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full",
                    "opacity-50 hover:opacity-100 transition-all",
                    "hover:bg-muted-foreground/20 group-data-[state=active]:hover:bg-primary-foreground/20",
                    "group-data-[state=active]:text-primary-foreground",
                  )}
                >
                  <X className="w-3 h-3" />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-0 h-full m-0 p-0 border-none data-[state=active]:block data-[state=inactive]:hidden"
              forceMount
            >
              {getPageComponent(tab.href)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
