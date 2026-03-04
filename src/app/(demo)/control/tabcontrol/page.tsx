"use client";

import React from "react";
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

export default function TabControlPage() {
  return (
    <ContentLayout title="Tab Control Test">
      <div className="flex justify-center w-full mt-4">
        <Tabs defaultValue="general" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">기본 정보</TabsTrigger>
            <TabsTrigger value="details">상세 정보</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* 탭 1: 기본 정보 */}
          <TabsContent value="general">
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
          </TabsContent>

          {/* 탭 2: 상세 정보 */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>상세 정보</CardTitle>
                <CardDescription>
                  추가적인 상세 정보를 입력합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AckDatePicker label="생년월일" mode="single" />
                <AckInput
                  label="주 소"
                  placeholder="주소를 입력하세요"
                  className="sm:w-full"
                />
                <AckCheckbox
                  label="이메일 수신 동의"
                  description="뉴스레터 및 이벤트 정보를 수신합니다."
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>저장</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 탭 3: 설정 */}
          <TabsContent value="settings">
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
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
