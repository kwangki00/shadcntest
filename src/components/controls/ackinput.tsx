"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AckLabel } from "./acklabel";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface AckInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelWidth?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: string;
  numeric?: boolean;
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
      numeric,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const id = propsId || generatedId;

    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    // 💡 [추가] 에러 상태를 컴포넌트 내부에서 즉각적으로 제어하기 위한 로컬 상태
    const [localError, setLocalError] = React.useState<string | undefined>(
      error,
    );

    // 💡 부모로부터 새로운 에러가 들어오면 동기화
    React.useEffect(() => {
      setLocalError(error);
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // 숫자만 입력받도록 처리
      if (numeric) {
        value = value.replace(/[^0-9]/g, "");
        e.target.value = value;
      }

      // 💡 [핵심 추가] 입력값에 따른 실시간 에러 상태 토글
      // 외부에서 에러(error)가 주어졌을 때만 이 로직이 작동합니다.
      if (error) {
        if (value.length > 0) {
          // 뭔가 입력했으면 에러 숨김
          setLocalError(undefined);
        } else {
          // 다 지워서 빈칸이 되면 원래 에러 복구
          setLocalError(error);
        }
      }

      onChange?.(e);
    };

    return (
      <div
        className={cn(
          "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        {label && (
          <AckLabel
            htmlFor={id}
            label={label}
            required={required}
            description={description}
            className={cn(
              disabled && "cursor-not-allowed",
              labelWidth,
              labelWidth && "shrink-0 flex-none",
            )}
          />
        )}

        <div className="relative flex-1 w-full flex items-center">
          <Input
            type={isPasswordType && showPassword ? "text" : type}
            id={id}
            ref={ref}
            disabled={disabled}
            onChange={handleChange}
            inputMode={numeric ? "numeric" : undefined}
            className={cn(
              "w-full sm:w-[180px]",
              // 💡 error 대신 localError 기준으로 렌더링
              localError &&
                "border-destructive text-destructive focus-visible:ring-destructive",
              (localError || isPasswordType) && "pr-10",
              localError && isPasswordType && "pr-20",
              disabled && "cursor-not-allowed",
              className,
            )}
            {...props}
          />

          {/* 아이콘 영역 */}
          {(isPasswordType || localError) && (
            <div
              className={cn(
                "flex items-center justify-end",
                localError && isPasswordType ? "-ml-16" : "-ml-8",
              )}
            >
              {isPasswordType && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disabled}
                  className={cn(
                    "h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md transition-colors focus:outline-none",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* 💡 error 대신 localError 렌더링 */}
              {localError && (
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="h-8 w-8 flex items-center justify-center cursor-help">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-destructive text-destructive-foreground border-destructive"
                    >
                      <p>{localError}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

AckInput.displayName = "AckInput";

export { AckInput };
