"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AckInput } from "@/components/controls/ackinput";
import { AckSelect } from "@/components/controls/ackselect";
import { AckRadio } from "@/components/controls/ackradiobutton";
import { AckCheckbox } from "@/components/controls/ackcheckbox";
import { AckSwitch } from "@/components/controls/ackswitch";
import { AckDatePicker } from "@/components/controls/ackdatepicker";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TabControlPage() {
  // 1. 탭 목록 및 활성 탭 상태 관리
  const [activeTab, setActiveTab] = useState("general");
  const [tabs, setTabs] = useState([
    { id: "general", label: "기본 정보" },
    { id: "details", label: "상세 정보" },
    { id: "settings", label: "설정" },
  ]);

  // 2. 탭 닫기 핸들러
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // 탭 선택 이벤트 전파 방지

    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    // 닫으려는 탭이 현재 활성화된 탭이라면, 다른 탭(이전 탭)을 활성화
    if (activeTab === tabId && newTabs.length > 0) {
      const index = tabs.findIndex((t) => t.id === tabId);
      // 이전 탭 선택 (없으면 첫 번째)
      const nextTab = newTabs[Math.max(0, index - 1)];
      setActiveTab(nextTab.id);
    }
  };

  // 3. 탭 ID에 따른 컨텐츠 렌더링 함수
  const renderTabContent = (id: string) => {
    switch (id) {
      case "general":
        return (
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>
                사용자의 기본 정보를 입력하는 화면입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AckInput
                label="이름"
                placeholder="이름을 입력하세요"
                required
                labelWidth="w-20"
              />
              <AckSelect
                label="직업"
                options={[
                  { label: "개발자", value: "developer" },
                  { label: "디자이너", value: "designer" },
                  { label: "기획자", value: "pm" },
                ]}
                placeholder="직업을 선택하세요"
                required
              />
              <AckRadio
                label="성별"
                options={[
                  { label: "남성", value: "male" },
                  { label: "여성", value: "female" },
                ]}
                defaultValue="male"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>저장</Button>
            </CardFooter>
          </Card>
        );
      case "details":
        return (
          <Card>
            <CardHeader>
              <CardTitle>상세 정보</CardTitle>
              <CardDescription>
                추가적인 상세 정보를 입력합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AckDatePicker label="생년월일" mode="single" />
              <AckInput label="주소" placeholder="주소를 입력하세요" />
              <AckCheckbox
                label="이메일 수신 동의"
                description="뉴스레터 및 이벤트 정보를 수신합니다."
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>저장</Button>
            </CardFooter>
          </Card>
        );
      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>설정</CardTitle>
              <CardDescription>시스템 설정을 변경합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AckSwitch
                label="다크 모드"
                description="다크 모드를 활성화합니다."
              />
              <AckSwitch
                label="알림 설정"
                description="푸시 알림을 받습니다."
                defaultChecked
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">초기화</Button>
              <Button>적용</Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ContentLayout title="Tab Control Test">
      <div className="flex justify-center w-full mt-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl"
        >
          {/* MDI 스타일: grid 대신 flex로 변경하여 탭 너비 유동적 처리 */}
          <TabsList className="flex justify-start w-full h-auto p-1 gap-1 overflow-x-auto bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative flex items-center gap-2 pr-8 pl-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {tab.label}
                <div
                  role="button"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className={cn(
                    "absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full",
                    "opacity-50 hover:opacity-100 hover:bg-muted-foreground/20 transition-all",
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              {renderTabContent(tab.id)}
            </TabsContent>
          ))}

          {tabs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-md mt-4 bg-muted/10">
              <p>열려있는 탭이 없습니다.</p>
              <Button
                variant="link"
                onClick={() => {
                  setTabs([
                    { id: "general", label: "기본 정보" },
                    { id: "details", label: "상세 정보" },
                    { id: "settings", label: "설정" },
                  ]);
                  setActiveTab("general");
                }}
              >
                탭 다시 열기
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </ContentLayout>
  );
}
