"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { AckDatePicker } from "@/components/controls/ackdatepicker";

import { AckInput } from "@/components/controls/ackinput";
import { AckCheckbox } from "@/components/controls/ackcheckbox";
import { AckRadio } from "@/components/controls/ackradiobutton";
import { AckSwitch } from "@/components/controls/ackswitch";
import { AckSelect } from "@/components/controls/ackselect";
import { useState } from "react";
import { AckMultiSelect } from "@/components/controls/ackmultiselect";
import { AckTextarea } from "@/components/controls/acktextarea";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  // 훅(Hook)  선언
  const sidebar = useStore(useSidebar, (x) => x);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;

  //Multi select 옵션
  const SKILL_OPTIONS = [
    { label: "React", value: "react" },
    { label: "Next.js", value: "next" },
    { label: "Tailwind CSS", value: "tailwind" },
    { label: "TypeScript", value: "ts" },
    { label: "skill1", value: "skill1" },
    { label: "skill2", value: "skill2" },
    { label: "skill3", value: "skill3" },
    { label: "skill4", value: "skill4" },
    { label: "skill5", value: "skill5" },
    { label: "skill6", value: "skill6" },
    { label: "skill7", value: "skill7" }
  ];

  //라디오버튼 옵션
  const GENDER_OPTIONS = [
    { label: "남성", value: "male" },
    { label: "여성", value: "female" },
    { label: "선택안함", value: "none" }
  ];

  const PLAN_OPTIONS = [
    { label: "베이직", value: "basic", description: "월 9,900원" },
    { label: "프리미엄", value: "pro", description: "월 19,900원" }
  ];

  //select 옵션
  const ROLE_OPTIONS = [
    { label: "관리자", value: "admin" },
    { label: "일반 사용자", value: "user" },
    { label: "게스트", value: "guest" }
  ];

  const DOMAIN_OPTIONS = [
    { label: "gmail.com", value: "gmail.com" },
    { label: "naver.com", value: "naver.com" },
    { label: "직접 입력", value: "custom" }
  ];

  return (
    <ContentLayout title="Control Test">
      <Card className="p-5">
        <div className=" space-y-5">
          {/*🔶Datepicekr */}
          <div className="space-y-3">
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              1. DatePicker
            </h1>
            <AckDatePicker label="날 짜" />
            <AckDatePicker label="미래날짜" allowFuture />
            <AckDatePicker label="날 짜" labelWidth="w-[60px]" />
            <AckDatePicker
              label="기간선택"
              mode="range"
              showPresets={false}
              required
            />

            <AckDatePicker
              mode="range"
              label="검색조건"
              labelWidth="w-[60px]"
            />

            <AckDatePicker
              label="기간선택"
              mode="range"
              showPresets={true}
              required
              disabled
            />
            <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          </div>
          {/*🔶Inputbox */}
          <div>
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              2. Inputbox
            </h1>
            <div className="space-y-3">
              <AckInput
                label="텍 스 트"
                placeholder="검색조건"
                className="sm:w-[10rem]"
              />
              <AckInput
                label="텍 스 트"
                placeholder="검색조건"
                className="sm:w-[10rem]"
              />
              <AckInput label="아이디" required placeholder="아이디" />
              <AckInput label="아이디" required placeholder="아이디" disabled />
            </div>
            <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          </div>
          {/*🔶Checkbox */}
          <div>
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              3. CheckBox
            </h1>
            <div className="space-y-4">
              <AckCheckbox
                label="로그인 상태 유지"
                description="(공용 PC에서는 해제하세요)"
              />

              <AckCheckbox
                label="약관 동의"
                required
                error="필수 동의 항목입니다."
              />
              <AckCheckbox
                label="로그인 상태 유지"
                description="(공용 PC에서는 해제하세요)"
                disabled
              />
            </div>
            <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          </div>
          {/*🔶Radiobutton */}
          <div>
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              4. RadioButton
            </h1>
            <div className="space-y-4">
              <AckRadio
                label="성 별"
                options={GENDER_OPTIONS}
                required
                defaultValue="none"
              />
              {/* 세로 배치 라디오 (설명 포함) */}
              <AckRadio
                label="구독플랜"
                options={PLAN_OPTIONS}
                orientation="vertical"
                defaultValue="basic"
                error="플랜을 선택해 주세요."
              />
              <AckRadio
                label="성 별"
                options={GENDER_OPTIONS}
                required
                defaultValue="none"
                disabled
              />
            </div>
            <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          </div>
          {/*🔶Switch */}
          <div className="space-y-2 ">
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              5. Switch
            </h1>
            {/* 활성화 상태 */}
            <AckSwitch label="알림 허용" defaultChecked />
            <AckSwitch label="알림 허용" defaultChecked direction="vertical" />
            {/* 비활성화 상태 (On 상태로 고정) */}
            <AckSwitch
              label="시스템 필수 알림"
              description="이 설정은 끌 수 없습니다."
              disabled
              defaultChecked
            />

            {/* 비활성화 상태 (Off 상태로 고정) */}
            <AckSwitch
              label="프리미엄 기능"
              description="구독 후 이용 가능합니다."
              disabled
            />
            <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          </div>
          {/*🔶Select */}
          <div className="space-y-2 ">
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              6. Select
            </h1>
            {/*기본 사용 */}
            <AckSelect label="권한 설정" options={ROLE_OPTIONS} required />

            {/*에러 상태 */}
            <AckSelect
              label="이메일 도메인"
              options={DOMAIN_OPTIONS}
              placeholder="도메인 선택"
              error="도메인을 선택해야 합니다."
            />

            {/*너비 조절 및 비활성화 */}
            <AckSelect
              label="상태"
              options={[{ label: "활성", value: "active" }]}
              defaultValue="active"
              disabled
              triggerClassName="w-[120px]"
              description="(변경 불가)"
            />
            <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          </div>
          {/*🔶Select */}
          <div className="space-y-2 ">
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              7. Multi Select
            </h1>
            <AckMultiSelect
              label="기술 스택"
              options={SKILL_OPTIONS}
              value={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="사용 가능한 기술을 선택하세요"
              description="(다중 선택 가능)"
            />
            <AckMultiSelect
              label="기술 스택"
              options={SKILL_OPTIONS}
              value={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="사용 가능한 기술을 선택하세요"
              description="(다중 선택 가능)"
              disabled
              required
            />
            {/* 결과 확인용 */}
            <div className="text-sm text-muted-foreground mt-4">
              현재 선택된 값: {JSON.stringify(selectedSkills)}
            </div>
          </div>{" "}
          <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
          {/*🔶Select */}
          <div className="space-y-2 ">
            <h1 className=" text-blue-800 font-semibold text-2xl mb-2">
              8. textarea
            </h1>
            <AckTextarea
              label="상세 사유"
              placeholder="사유를 입력해 주세요."
              required
              rows={4}
            />
            <AckTextarea
              label="상세 사유"
              placeholder="사유를 입력해 주세요."
              required
              labelPlacement="left"
              rows={4}
            />
          </div>
          <div className=" border-t-purple-300 border-t-[1px] mt-3"></div>
        </div>
      </Card>
    </ContentLayout>
  );
}
