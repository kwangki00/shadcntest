"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { AckLabel } from "./acklabel";

interface AckTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelWidth?: string;
  labelPlacement?: "top" | "left";
  required?: boolean;
  description?: React.ReactNode;
}

export const AckTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AckTextareaProps
>(
  (
    {
      className,
      label,
      labelWidth,
      labelPlacement = "top",
      required,
      description,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isTop = labelPlacement === "top";

    return (
      <div
        className={cn(
          "flex w-full",
          // 위쪽 배치일 때는 flex-col로 쌓고 좌측 정렬(items-start) 유지
          isTop
            ? "flex-col items-start gap-1.5"
            : "sm:flex-row flex-col sm:items-start gap-1 sm:gap-2"
        )}
      >
        {label && (
          <AckLabel
            htmlFor={inputId}
            label={label}
            required={required}
            description={description}
            className={cn(
              // 좌측 배치일 때만 정렬을 위한 여백과 너비 적용
              !isTop && "sm:mt-2",
              !isTop && labelWidth,
              !isTop && labelWidth && "shrink-0 flex-none",
              // 위쪽 배치일 때는 그냥 텍스트 본연의 너비만 가짐
              isTop && "mb-0.5 text-left w-auto"
            )}
          />
        )}
        <div className="flex-1 w-full">
          <Textarea
            id={inputId}
            className={cn(
              "min-h-[80px] resize-y border-border focus-visible:ring-1 focus-visible:ring-primary",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

AckTextarea.displayName = "AckTextarea";
