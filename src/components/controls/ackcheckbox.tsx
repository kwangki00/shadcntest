import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"; // 💡 타입 참조를 위해 추가
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { AckLabel } from "./acklabel";

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
      disabled, // 💡 disabled 속성을 명시적으로 추출
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = propsId || generatedId;

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          disabled && "opacity-50 pointer-events-none", // 💡 비활성화 시 전체 흐리게 및 마우스 이벤트 방지
          className
        )}
      >
        <div
          className={cn(
            "flex gap-2",
            direction === "vertical"
              ? "flex-col items-start"
              : "flex-row items-start"
          )}
        >
          {/* 💡 shadcn/ui Checkbox에 disabled 속성 전달 */}
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
              // 💡 체크박스 옆에서는 양끝 정렬 클래스를 무효화하기 위해 min-width를 해제합니다.
              // 💡 disabled 상태에 따라 커서 모양을 동적으로 변경합니다.
              className={cn(
                "mb-0 font-medium select-none min-w-0 leading-normal",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
            />
          )}
        </div>

        {error && (
          <p className="text-[0.8rem] font-medium text-destructive mt-0.5 ml-6">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AckCheckbox.displayName = "AckCheckbox";

export { AckCheckbox };
