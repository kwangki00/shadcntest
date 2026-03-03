import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // 💡 shadcn/ui 기본 인풋 임포트
import { AckLabel } from "./acklabel";

export interface AckInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; /** 라벨 텍스트 */
  labelWidth?: string; //  라벨 너비 (예: "w-[80px]", "w-24" 등)
  required?: boolean; /** 필수 입력 여부 */
  description?: React.ReactNode; /** 라벨 옆 추가 설명 */

  error?: string; /** 에러 메시지 */
}

const AckInput = React.forwardRef<HTMLInputElement, AckInputProps>(
  (
    {
      className,
      type,
      label,
      required,
      description,
      error,
      labelWidth,
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
          "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        {/* 통합된 라벨 영역 */}
        {label && (
          <AckLabel
            htmlFor={id}
            label={label}
            required={required}
            description={description}
            className={cn(
              disabled && "cursor-not-allowed",
              labelWidth,
              labelWidth && "shrink-0 flex-none"
            )}
          />
        )}

        {/* 💡 에러 메시지를 포함한 인풋 컨테이너 (세로 정렬용) */}
        <div className="flex flex-col gap-1 flex-1 w-full">
          <Input
            type={type}
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full sm:w-[180px]",
              error && "border-destructive focus-visible:ring-destructive",
              disabled && "cursor-not-allowed",
              className
            )}
            {...props}
          />

          {/* 에러 메시지 출력 */}
          {error && (
            <p className="text-[0.8rem] font-medium text-destructive mt-0.5">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AckInput.displayName = "AckInput";

export { AckInput };
