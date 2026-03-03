import * as React from "react";
import { cn } from "@/lib/utils";

export interface AckLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label?: string;
  required?: boolean;
  description?: React.ReactNode;
  // 💡 size 타입을 정확히 정의합니다.
  size?: "sm" | "md" | "lg";
}

export function AckLabel({
  label,
  required,
  description,
  size = "md",
  className,
  children,
  htmlFor,
  ...props
}: AckLabelProps) {
  // 💡 객체의 타입을 Record를 사용하여 명시적으로 정의하면 인덱싱 에러가 해결됩니다.
  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    sm: "text-xs",
    md: "text-sm ",
    lg: "text-base"
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={htmlFor}
        className={cn(
          "font-medium min-w-[3.3rem] text-foreground sm:text-justify-space flex items-center gap-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {label || children}

        {required && (
          <span className="text-destructive font-bold ml-0.5" title="필수 입력">
            *
          </span>
        )}

        {description && (
          <span className="text-xs font-normal text-muted-foreground ml-1">
            {description}
          </span>
        )}
      </label>
    </div>
  );
}
