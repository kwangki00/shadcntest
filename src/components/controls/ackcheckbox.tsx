"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { AckLabel } from "./acklabel";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface AckCheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  label?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: string;
  direction?: "horizontal" | "vertical";
}

const AckCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  AckCheckboxProps
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
    ref,
  ) => {
    const generatedId = React.useId();
    const id = propsId || generatedId;

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        {/* 💡 [핵심 수정] div를 label로 변경하여 내부 모든 영역(빈 공간 포함)을 클릭 가능하게 만듦 */}
        <label
          htmlFor={id} // 라벨 전체를 클릭했을 때 체크박스가 반응하도록 연결
          className={cn(
            "flex gap-2 group", // group을 추가하여 체크박스에 hover 효과를 연동할 수도 있습니다.
            direction === "vertical"
              ? "flex-col items-start"
              : "flex-row items-start",
            disabled ? "cursor-not-allowed" : "cursor-pointer", // 💡 빈 공간에 마우스를 올려도 손가락 포인터가 나오도록
          )}
        >
          <Checkbox
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn("mt-0.5", direction === "vertical" && "mt-0")}
            {...props}
          />

          {label && (
            <AckLabel
              htmlFor={id}
              label={label}
              required={required}
              description={description}
              className={cn(
                "mb-0 font-medium select-none min-w-0 leading-normal",
                // 부모 label에서 이미 cursor를 처리하므로 여기선 상속받게 둡니다.
                disabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
            />
          )}

          {error && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="h-4 w-4 flex items-center justify-center cursor-help mt-0.5">
                    <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-destructive text-destructive-foreground border-destructive"
                >
                  <p>{error}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </label>
      </div>
    );
  },
);

AckCheckbox.displayName = "AckCheckbox";

export { AckCheckbox };
