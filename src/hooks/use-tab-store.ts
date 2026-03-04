import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Tab {
  id: string;
  label: string;
  href: string;
}

interface TabState {
  tabs: Tab[];
  activeTab: string;
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [{ id: "/dashboard", label: "Dashboard", href: "/dashboard" }],
      activeTab: "/dashboard",
      addTab: (tab) => {
        const { tabs } = get();
        if (!tabs.find((t) => t.id === tab.id)) {
          set({ tabs: [...tabs, tab], activeTab: tab.id });
        } else {
          set({ activeTab: tab.id });
        }
      },
      removeTab: (id) => {
        const { tabs, activeTab } = get();
        const newTabs = tabs.filter((t) => t.id !== id);
        set({ tabs: newTabs });

        if (activeTab === id && newTabs.length > 0) {
          set({ activeTab: newTabs[newTabs.length - 1].id });
        } else if (newTabs.length === 0) {
          set({ activeTab: "" });
        }
      },
      setActiveTab: (id) => set({ activeTab: id }),
    }),
    {
      name: "tab-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
