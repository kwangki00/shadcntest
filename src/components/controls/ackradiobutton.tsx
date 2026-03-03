"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AckLabel } from "./acklabel"; // AckLabel 파일 경로를 확인하세요.

/** * 라디오 옵션 아이템 인터페이스
 */
export interface AckRadioOption {
  label: string;
  value: string;
  description?: string;
}

/** * AckRadio 컴포넌트 Props 인터페이스
 */
export interface AckRadioProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
  /** 그룹 상단에 표시될 메인 라벨 */
  label?: string;
  /** 필수 여부 표시 (*) */
  required?: boolean;
  /** 라벨 옆 추가 설명 */
  labelDescription?: React.ReactNode;
  /** 라디오 옵션 배열 */
  options: AckRadioOption[];
  /** 배치 방향 (가로: horizontal, 세로: vertical) */
  orientation?: "horizontal" | "vertical";
  /** 에러 메시지 */
  error?: string;
}
const AckRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  AckRadioProps
>(
  (
    {
      className,
      label,
      required,
      labelDescription,
      options,
      orientation = "horizontal",
      error,
      disabled, // 💡 disabled 속성 추출
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();

    return (
      <div
        className={cn(
          "flex gap-1 sm:gap-2",
          // 💡 orientation이 vertical이면 무조건 세로 배치(flex-col)
          // 💡 horizontal이면 데스크톱에서 가로(sm:flex-row), 모바일에서 세로(flex-col)
          orientation === "vertical"
            ? "flex-col items-start"
            : "flex-col sm:flex-row sm:items-center",
          disabled && "opacity-50 pointer-events-none", // 💡 비활성화 시 전체 흐리게 및 이벤트 방지
          className
        )}
      >
        {/* 1. 메인 라벨 영역 */}
        {label && (
          <AckLabel
            label={label}
            required={required}
            description={labelDescription}
            className={cn("mb-0", disabled && "cursor-not-allowed")} // 💡 메인 라벨 커서 변경
          />
        )}

        {/* 2. 라디오 그룹 본체 */}
        <div className="flex flex-col">
          <RadioGroup
            ref={ref}
            disabled={disabled} // 💡 shadcn/ui RadioGroup에 disabled 전달
            className={cn(
              "flex gap-4 pt-1",
              orientation === "vertical"
                ? "flex-col gap-2"
                : "flex-row flex-wrap"
            )}
            {...props}
          >
            {options.map((option: AckRadioOption, index: number) => {
              const itemId = `${generatedId}-${index}`;
              return (
                <div
                  key={option.value}
                  className="flex items-center gap-2 group"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={itemId}
                    disabled={disabled}
                  />{" "}
                  {/* 💡 개별 아이템에도 disabled 전달 (안전장치) */}
                  <label
                    htmlFor={itemId}
                    className={cn(
                      "text-sm font-medium leading-none select-none transition-colors",
                      // 💡 비활성화 시 커서 변경, 활성화 시에만 hover 효과 적용
                      disabled
                        ? "cursor-not-allowed"
                        : "cursor-pointer group-hover:text-primary",
                      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    )}
                  >
                    {option.label}
                    {option.description && (
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
          </RadioGroup>

          {/* 3. 에러 메시지 출력 (그룹 아래에 위치) */}
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

AckRadio.displayName = "AckRadio";

export { AckRadio };
