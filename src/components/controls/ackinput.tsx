import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // 💡 shadcn/ui 기본 인풋 임포트
import { AckLabel } from "./acklabel";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface AckInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; /** 라벨 텍스트 */
  labelWidth?: string; //  라벨 너비 (예: "w-[80px]", "w-24" 등)
  required?: boolean; /** 필수 입력 여부 */
  description?: React.ReactNode; /** 라벨 옆 추가 설명 */

  error?: string; /** 에러 메시지 */
  numeric?: boolean; /** 숫자만 입력 가능 여부 */
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

    // 💡 비밀번호 토글 상태 관리
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    // 💡 숫자만 입력받도록 처리하는 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numeric) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
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
              labelWidth && "shrink-0 flex-none",
            )}
          />
        )}

        {/* 💡 에러 메시지를 포함한 인풋 컨테이너 (세로 정렬용) */}
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
              error && "border-destructive focus-visible:ring-destructive",
              // 💡 아이콘 공간 확보 (패스워드 토글 + 에러 아이콘 고려)
              (error || isPasswordType) && "pr-10",
              error && isPasswordType && "pr-20",
              disabled && "cursor-not-allowed",
              className,
            )}
            {...props}
          />

          {/* 💡 아이콘 영역 (비밀번호 토글 & 에러 메시지) */}
          {(isPasswordType || error) && (
            <div
              className={cn(
                "flex items-center justify-end",
                // 아이콘 개수에 따라 왼쪽으로 당기는 위치 조정 (Input 내부로 배치)
                error && isPasswordType ? "-ml-16" : "-ml-8",
              )}
            >
              {/* 1. 비밀번호 토글 버튼 */}
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

              {/* 2. 에러 메시지 툴팁 */}
              {error && (
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
                      <p>{error}</p>
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
