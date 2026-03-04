"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AckLabel } from "./acklabel"; // AckLabel 경로 확인
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onValueChange, // 💡 props에서 onValueChange 추출
  ...props
}: AckSelectProps) {
  const generatedId = React.useId();
  const id = props.name || generatedId;

  // 💡 [핵심 추가] 에러를 컴포넌트 내부에서 즉각적으로 해제하기 위한 로컬 상태
  const [localError, setLocalError] = React.useState<string | undefined>(error);

  // 💡 외부에서 error 프롭이 들어오거나 바뀔 때마다 로컬 상태와 동기화
  React.useEffect(() => {
    setLocalError(error);
  }, [error]);

  // 💡 아이템이 선택되었을 때 실행될 커스텀 핸들러
  const handleValueChange = (value: string) => {
    if (localError) {
      setLocalError(undefined); // 선택하는 순간 에러 UI 즉시 해제
    }

    // 부모 컴포넌트에서 전달한 원래의 onValueChange가 있다면 실행해줌
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div
      className={cn(
        "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
        disabled && "opacity-50 pointer-events-none",
        className,
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
      <div className="relative flex-1 max-w-full">
        <Select
          disabled={disabled}
          onValueChange={handleValueChange} // 💡 커스텀 핸들러 부착
          {...props}
        >
          <SelectTrigger
            id={id}
            className={cn(
              "w-full sm:w-[180px]",

              // 💡 1. 정상 상태 (에러가 없을 때만 파란색 링 적용)
              !localError &&
                "data-[state=open]:ring-1 data-[state=open]:ring-ring",

              // 💡 2. 에러 상태 (빨간색 테두리 + 열렸을 때도 빨간색 링 유지)
              localError &&
                "border-destructive text-destructive focus:ring-destructive data-[state=open]:ring-1 data-[state=open]:ring-destructive",

              disabled && "cursor-not-allowed",
              triggerClassName,
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 mr-1">
              <span className="truncate flex-1 text-left">
                <SelectValue placeholder={placeholder} />
              </span>

              {/* 💡 error 대신 localError 사용 */}
              {localError && (
                <div onClick={(e) => e.stopPropagation()}>
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div className="h-4 w-4 flex items-center justify-center cursor-help">
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
                </div>
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
