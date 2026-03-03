"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { AckLabel } from "./acklabel";
export interface AckSwitchProps extends React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> {
  /** 상단 또는 좌측에 표시될 라벨 */
  label?: string;
  /** 필수 여부 표시 */
  required?: boolean;
  /** 라벨 옆 추가 설명 */
  description?: React.ReactNode;
  /** 에러 메시지 */
  error?: string;
  /** 라벨과 스위치의 배치 방향 (기본값 horizontal) */
  direction?: "horizontal" | "vertical";
}
export const AckSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  AckSwitchProps
>(
  (
    {
      className,
      label,
      required,
      description,
      error,
      direction = "horizontal",
      id: propsId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = propsId || generatedId;

    return (
      <div
        className={cn(
          "flex gap-1 sm:gap-2",
          direction === "vertical"
            ? "flex-col items-start"
            : "flex-row items-center sm:flex-row sm:items-center",
          // 💡 전체 컨테이너에 비활성화 스타일 적용
          disabled && "opacity-50 cursor-not-allowed",
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
            // 💡 비활성화 시 커서 모양 변경 및 클릭 방지
            className={cn(
              "mb-0",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          />
        )}

        {/* 2. 스위치 본체 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center h-9">
            <Switch
              id={id}
              ref={ref}
              disabled={disabled} // 💡 shadcn Switch에 disabled 전달
              {...props}
            />
          </div>

          {error && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AckSwitch.displayName = "AckSwitch";
