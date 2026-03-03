"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AckLabel } from "./acklabel"; // AckLabel 경로 확인
export interface AckSelectOption {
  label: string;
  value: string;
}

export interface AckSelectProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
> {
  /** 라벨 텍스트 */
  label?: string;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 라벨 옆 추가 설명 */
  description?: React.ReactNode;
  /** 에러 메시지 */
  error?: string;
  /** 선택 전 보여줄 기본 문구 */
  placeholder?: string;
  /** 드롭다운 옵션 배열 */
  options: AckSelectOption[];
  /** Select Trigger(버튼)의 추가 클래스 (너비 조절용 등) */
  triggerClassName?: string;
  /** 최상위 컨테이너 클래스 */
  className?: string;
}

export function AckSelect({
  label,
  required,
  description,
  error,
  placeholder = "선택해주세요",
  options,
  disabled,
  className,
  triggerClassName,
  ...props
}: AckSelectProps) {
  const generatedId = React.useId();
  const id = props.name || generatedId; // name 속성이 있으면 id로 우선 사용

  return (
    <div
      className={cn(
        "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
        disabled && "opacity-50 pointer-events-none", // 💡 비활성화 시 흐리게 및 이벤트 차단
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
          className={cn("mb-0", disabled ? "cursor-not-allowed" : "")}
        />
      )}

      {/* 2. select 본체 및 에러 영역 */}
      <div className="flex flex-col flex-1 max-w-full">
        <Select disabled={disabled} {...props}>
          <SelectTrigger
            id={id}
            className={cn(
              "w-full sm:w-[180px]", // 기본 너비 설정 (triggerClassName으로 덮어쓰기 가능)
              error && "border-destructive focus:ring-destructive",
              disabled && "cursor-not-allowed",
              triggerClassName
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 3. 에러 메시지 */}
        {error && (
          <p className="text-[0.8rem] font-medium text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
