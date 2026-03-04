import React from "react";
import DashboardPage from "@/app/(demo)/dashboard/page";
import TabControlPage from "@/app/(demo)/control/tabcontrol/page";
import ControlPage from "@/app/(demo)/control/page";

// 경로(href)와 컴포넌트 매핑
export const PAGE_REGISTRY: Record<string, React.ReactNode> = {
  "/dashboard": <DashboardPage />,
  "/control/tabcontrol": <TabControlPage />,
  "/control": <ControlPage />,
  "/control/nonpage": <div className="p-6">Virtual Table 페이지 (준비중)</div>,
  // 필요한 다른 페이지들도 여기에 추가
};

export const getPageComponent = (href: string) => {
  return (
    PAGE_REGISTRY[href] || (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        페이지를 찾을 수 없습니다: {href}
      </div>
    )
  );
};
