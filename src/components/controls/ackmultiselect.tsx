"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AckLabel } from "./acklabel";
import { Check, ChevronDown, AlertCircle } from "lucide-react";
// 💡 Button 임포트는 제거했습니다.

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export interface AckMultiSelectOption {
  label: string;
  value: string;
}

export interface AckMultiSelectProps {
  label?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: string;
  placeholder?: string;
  options: AckMultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  maxCount?: number;
  showSelectAll?: boolean;
}

export const AckMultiSelect = React.forwardRef<
  HTMLButtonElement,
  AckMultiSelectProps
>(
  (
    {
      label,
      required,
      description,
      error,
      placeholder = "옵션을 선택하세요",
      options,
      value = [],
      onChange,
      disabled = false,
      className,
      triggerClassName,
      maxCount = 2,
      showSelectAll = true,
    },
    ref,
  ) => {
    const id = React.useId();
    const [open, setOpen] = React.useState(false);

    const [selectedValues, setSelectedValues] = React.useState<string[]>(value);
    const [localError, setLocalError] = React.useState<string | undefined>(
      error,
    );

    React.useEffect(() => {
      setSelectedValues(value);
    }, [value]);

    React.useEffect(() => {
      setLocalError(error);
    }, [error]);

    const isAllSelected =
      options.length > 0 && selectedValues.length === options.length;

    const handleSelect = (currentValue: string) => {
      // 1. 새롭게 선택될 값들의 배열을 먼저 계산합니다.
      const newValues = selectedValues.includes(currentValue)
        ? selectedValues.filter((v) => v !== currentValue)
        : [...selectedValues, currentValue];

      // 💡 [핵심 추가] 부모로부터 에러가 주어졌을 때 실시간 상태 토글
      if (error) {
        if (newValues.length > 0) {
          setLocalError(undefined); // 하나라도 선택하면 에러 숨김
        } else {
          setLocalError(error); // 다 지워서 0개가 되면 원래 에러 복구
        }
      }

      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };

    const handleSelectAll = () => {
      // 1. 새롭게 선택될 값들의 배열을 계산합니다 (전체 선택 or 전체 해제).
      let newValues: string[] = [];
      if (!isAllSelected) {
        newValues = options.map((opt) => opt.value);
      }

      // 💡 [핵심 추가] 전체 해제로 0개가 되면 에러 복구, 전체 선택하면 에러 숨김
      if (error) {
        if (newValues.length > 0) {
          setLocalError(undefined);
        } else {
          setLocalError(error);
        }
      }

      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };
    const selectedLabels = options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label);

    return (
      <div
        className={cn(
          "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        {label && (
          <AckLabel
            htmlFor={id}
            label={label}
            required={required}
            description={description}
            className={cn(
              "mb-0",
              disabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          />
        )}

        <div className="flex flex-col flex-1 max-w-full min-w-0">
          {" "}
          <Popover
            open={disabled ? false : open}
            onOpenChange={(newOpen) => {
              setOpen(newOpen);
              // 창이 닫힐 때(newOpen === false), 허공(body)을 클릭해 닫은 거라면 포커스를 버튼으로 돌려줍니다.
              if (!newOpen) {
                setTimeout(() => {
                  if (document.activeElement === document.body) {
                    document.getElementById(id)?.focus();
                  }
                }, 0);
              }
            }}
          >
            <PopoverTrigger asChild>
              <button
                id={id}
                ref={ref}
                type="button"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className={cn(
                  "flex h-9 w-full sm:w-[200px] items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",

                  // 💡 1. 정상 상태 (에러가 없을 때만 파란색 링 적용)
                  !localError && "focus:ring-ring",
                  !localError && open && "ring-1 ring-ring",

                  // 💡 2. 에러 상태 (테두리/글씨 빨간색 + 포커스 및 열렸을 때도 빨간색 링 유지)
                  localError &&
                    "border-destructive text-destructive focus:ring-destructive",
                  localError && open && "ring-1 ring-destructive",

                  !isAllSelected &&
                    !selectedValues.length &&
                    "text-muted-foreground",
                  triggerClassName,
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap flex-1">
                    {isAllSelected ? (
                      <span className="truncate w-full text-left">전체</span>
                    ) : selectedValues.length > 0 ? (
                      <div className="flex items-center w-full overflow-hidden">
                        <span className="truncate text-left">
                          {selectedLabels.slice(0, maxCount).join(", ")}
                        </span>
                        {selectedValues.length > maxCount && (
                          <span className="shrink-0 ml-1 text-muted-foreground text-xs">
                            외 {selectedValues.length - maxCount}개
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="truncate w-full text-left">
                        {placeholder}
                      </span>
                    )}
                  </div>

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
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              // 💡 PopoverContent에도 shadow-md를 명시적으로 주어 드롭다운의 입체감을 살림
              className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border rounded-md"
              align="start"
              sideOffset={4} // 셀렉트 박스와 드롭다운 사이의 간격 조정
            >
              <Command>
                <CommandInput placeholder="검색어 입력..." className="h-9" />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {showSelectAll && options.length > 0 && (
                      <>
                        <CommandItem
                          value="전체 선택"
                          onSelect={handleSelectAll}
                          className="font-medium cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary transition-opacity",
                              isAllSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          전체 선택
                        </CommandItem>
                        <CommandSeparator className="mb-1" />
                      </>
                    )}

                    {options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => handleSelect(option.value)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary transition-opacity",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  },
);

AckMultiSelect.displayName = "AckMultiSelect";
