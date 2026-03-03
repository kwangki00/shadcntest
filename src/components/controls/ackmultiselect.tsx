"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AckLabel } from "./acklabel";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// 💡 팝오버: 클릭 시 화면 위에 뜨는 작은 창 레이아웃을 담당
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

// 💡 Command (cmdk): 내부적으로 검색 기능과 키보드 네비게이션을 지원하는 리스트 컴포넌트
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";

// ==========================================
// 1. 타입 및 인터페이스 정의
// ==========================================

export interface AckMultiSelectOption {
  label: string; // 화면에 보여질 텍스트 (예: "관리자")
  value: string; // 실제 데이터로 다룰 값 (예: "admin")
}

export interface AckMultiSelectProps {
  label?: string; // 상단 라벨 텍스트
  required?: boolean; // 필수 입력 여부 (* 표시)
  description?: React.ReactNode; // 라벨 옆 추가 설명
  error?: string; // 에러 발생 시 출력할 메시지
  placeholder?: string; // 아무것도 선택되지 않았을 때 표시할 문구
  options: AckMultiSelectOption[]; // 선택 가능한 옵션 배열
  value?: string[]; // 현재 선택된 값들의 배열
  onChange?: (value: string[]) => void; // 값이 변경될 때 호출되는 콜백 함수
  disabled?: boolean; // 컴포넌트 전체 비활성화 여부
  className?: string; // 최상위 컨테이너 커스텀 클래스
  triggerClassName?: string; // 셀렉트 버튼(Trigger) 커스텀 클래스
  maxCount?: number; // 선택된 항목을 보여줄 최대 개수 (기본 2개, 이후는 '외 N개' 처리)
  showSelectAll?: boolean; // '전체 선택' 항목 표시 여부
}

// ==========================================
// 2. 메인 컴포넌트
// ==========================================

// 💡 forwardRef 적용: react-hook-form 등 폼 라이브러리에서 에러 발생 시 포커스를 맞출 수 있도록 호환성 확보
export const AckMultiSelect = React.forwardRef<
  HTMLButtonElement,
  AckMultiSelectProps
>(
  (
    {
      label,
      required,
      description,
      error,
      placeholder = "옵션을 선택하세요",
      options,
      value = [], // 값이 없을 경우 기본값으로 빈 배열 지정
      onChange,
      disabled = false,
      className,
      triggerClassName,
      maxCount = 2, // 기본값 2 설정
      showSelectAll = true
    },
    ref
  ) => {
    const id = React.useId(); // 웹 접근성(a11y)을 위한 고유 ID 생성
    const [open, setOpen] = React.useState(false); // 팝오버 열림/닫힘 상태

    // 💡 파생 상태(Derived State): 별도의 useState 없이 렌더링 시점에 전체 선택 여부 계산 (상태 꼬임 방지)
    const isAllSelected = options.length > 0 && value.length === options.length;

    // --- 핸들러 함수 ---

    // 개별 항목 선택/해제 토글
    const handleSelect = (currentValue: string) => {
      if (!onChange) return;
      // 이미 선택된 값이면 배열에서 빼고, 아니면 배열에 추가
      const newValue = value.includes(currentValue)
        ? value.filter((v) => v !== currentValue)
        : [...value, currentValue];
      onChange(newValue);
    };

    // 전체 선택/해제 토글
    const handleSelectAll = () => {
      if (!onChange) return;
      if (isAllSelected) {
        onChange([]); // 이미 모두 선택되어 있으면 전부 비우기
      } else {
        onChange(options.map((opt) => opt.value)); // 아니면 모든 option의 value를 배열로 묶어서 전달
      }
    };

    // 화면에 그릴 목적으로, 선택된 value들에 해당하는 label 문자열만 추출
    const selectedLabels = options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label);

    // ==========================================
    // 3. 렌더링 (JSX)
    // ==========================================

    return (
      <div
        className={cn(
          "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
          disabled && "opacity-50 pointer-events-none", // 💡 비활성화 시 전체 반투명화 및 클릭/호버 이벤트 완전 차단
          className
        )}
      >
        {/* 1. 라벨 영역 */}
        {label && (
          <AckLabel
            htmlFor={id}
            label={label}
            required={required}
            description={description}
            className={cn(
              "mb-0",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          />
        )}

        {/* 2. 셀렉트(콤보박스) 영역 */}
        <div className="flex flex-col flex-1 max-w-full overflow-hidden">
          {/* disabled 상태면 팝오버가 절대 열리지 않도록 강제 제어 */}
          <Popover open={disabled ? false : open} onOpenChange={setOpen}>
            {/* 팝오버를 여는 트리거 버튼 */}
            <PopoverTrigger asChild>
              <Button
                id={id}
                ref={ref} // 💡 폼 라이브러리 연동을 위해 ref 전달
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className={cn(
                  "w-full sm:w-[200px] justify-between h-9 px-3 font-normal",
                  error && "border-destructive focus:ring-destructive", // 에러 발생 시 빨간색 테두리
                  disabled && "cursor-not-allowed",
                  !isAllSelected && !value.length && "text-muted-foreground", // 선택값이 없을 때만 placeholder 색상 (회색)
                  triggerClassName
                )}
              >
                {/* 내부 텍스트 렌더링 영역 */}
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap w-full">
                  {isAllSelected ? (
                    // 1) 모두 선택된 경우
                    <span className="truncate w-full text-left">전체</span>
                  ) : value.length > 0 ? (
                    // 2) 일부만 선택된 경우 (설정된 개수까지만 보여주고 나머지는 '외 N개')
                    <div className="flex items-center w-full overflow-hidden">
                      <span className="truncate text-left">
                        {selectedLabels.slice(0, maxCount).join(", ")}
                      </span>
                      {value.length > maxCount && (
                        // shrink-0 속성으로 공간이 좁아져도 이 텍스트는 찌그러지거나 잘리지 않음
                        <span className="shrink-0 ml-1 text-muted-foreground text-xs">
                          외 {value.length - maxCount}개
                        </span>
                      )}
                    </div>
                  ) : (
                    // 3) 아무것도 선택되지 않은 경우 (Placeholder 렌더링)
                    <span className="truncate w-full text-left">
                      {placeholder}
                    </span>
                  )}
                </div>
                {/* 우측 하단 화살표 아이콘 */}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            {/* 팝오버 내부 목록 창 */}
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0" // 트리거 버튼과 너비 동일하게 맞춤
              align="start"
            >
              <Command>
                {/* 검색 입력창 */}
                <CommandInput placeholder="검색어 입력..." className="h-9" />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {/* 전체 선택 옵션 렌더링 */}
                    {showSelectAll && options.length > 0 && (
                      <>
                        <CommandItem
                          value="select-all" // 💡 고유 value를 주어야 cmdk 내부 에러/경고 방지
                          onSelect={handleSelectAll}
                          className="font-medium cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary transition-opacity",
                              isAllSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          전체 선택
                        </CommandItem>
                        {/* 전체선택과 일반 항목 사이의 구분선 */}
                        <CommandSeparator className="mb-1" />
                      </>
                    )}

                    {/* 개별 옵션 렌더링 */}
                    {options.map((option) => {
                      const isSelected = value.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          // 💡 핵심 디테일: value가 고유 ID(예: "user_1")라도 라벨명(예: "홍길동")으로 검색이 가능하도록 keywords 배열에 라벨 주입
                          keywords={[option.label]}
                          onSelect={() => handleSelect(option.value)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary transition-opacity",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* 3. 에러 메시지 렌더링 */}
          {error && (
            <p className="text-[0.8rem] font-medium text-destructive mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AckMultiSelect.displayName = "AckMultiSelect";
