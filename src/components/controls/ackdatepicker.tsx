"use client";

import * as React from "react";
import { format, subDays, subMonths, subYears, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Calendar as CalendarIcon,
  CalendarRange,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AckLabel } from "./acklabel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ==========================================
// 1. 타입 및 인터페이스
// ==========================================

interface AckDatePickerProps {
  mode?: "single" | "range"; // 달력 모드 (단일 날짜 or 기간 선택)
  startYear?: number; // 선택 가능한 최소 연도 (기본: 10년 전)
  endYear?: number; // 선택 가능한 최대 연도 (기본: 10년 후)
  showPresets?: boolean; // 외부(입력창 하단) 프리셋 버튼 표시 여부
  label?: string; // 상단 라벨 텍스트
  labelWidth?: string; // 라벨 너비 제어
  required?: boolean; // 필수 입력 표시 (*)
  description?: React.ReactNode; // 라벨 하단 설명 텍스트
  placeholder?: string; // 값이 없을 때 표시될 텍스트
  disabled?: boolean; // 폼 컨트롤 전체 비활성화 여부
  allowFuture?: boolean; // 미래 날짜 선택 허용 여부
  error?: string; // 에러 메시지
}

type PresetType = "today" | "week" | "month" | "year" | "all" | null;

const PRESET_OPTIONS: { key: NonNullable<PresetType>; label: string }[] = [
  { key: "today", label: "1일" },
  { key: "week", label: "1주일" },
  { key: "month", label: "1개월" },
  { key: "year", label: "1년" },
  { key: "all", label: "전체" },
];

// ==========================================
// 2. 유틸리티 함수
// ==========================================

const normalizeSingle = (d?: Date) => (d ? startOfDay(d) : undefined);
const normalizeRange = (r?: DateRange) => {
  if (!r) return undefined;
  return {
    from: r.from ? startOfDay(r.from) : undefined,
    to: r.to ? startOfDay(r.to) : undefined,
  } satisfies DateRange;
};

// ==========================================
// 3. 캘린더 툴팁(말풍선) CSS 설정
// ==========================================
const CALENDAR_TOOLTIP_CLASSES = cn(
  // 공통 툴팁 레이아웃 및 폰트 설정
  "[&_[data-range-start=true]]:before:absolute [&_[data-range-end=true]]:before:absolute [&_[data-selected-single=true]]:before:absolute",
  "[&_[data-range-start=true]]:before:bottom-full [&_[data-range-end=true]]:before:bottom-full [&_[data-selected-single=true]]:before:bottom-full",
  "[&_[data-range-start=true]]:before:mb-1.5 [&_[data-range-end=true]]:before:mb-1.5 [&_[data-selected-single=true]]:before:mb-1.5",
  "[&_[data-range-start=true]]:before:z-50 [&_[data-range-end=true]]:before:z-50 [&_[data-selected-single=true]]:before:z-50",
  "[&_[data-range-start=true]]:before:px-2 [&_[data-range-end=true]]:before:px-2 [&_[data-selected-single=true]]:before:px-2",
  "[&_[data-range-start=true]]:before:py-0.5 [&_[data-range-end=true]]:before:py-0.5 [&_[data-selected-single=true]]:before:py-0.5",
  "[&_[data-range-start=true]]:before:text-white [&_[data-range-end=true]]:before:text-white [&_[data-selected-single=true]]:before:text-white",
  "[&_[data-range-start=true]]:before:text-[10px] [&_[data-range-end=true]]:before:text-[10px] [&_[data-selected-single=true]]:before:text-[10px]",
  "[&_[data-range-start=true]]:before:font-bold [&_[data-range-end=true]]:before:font-bold [&_[data-selected-single=true]]:before:font-bold",
  "[&_[data-range-start=true]]:before:rounded [&_[data-range-end=true]]:before:rounded [&_[data-selected-single=true]]:before:rounded",
  "[&_[data-range-start=true]]:before:whitespace-nowrap [&_[data-range-end=true]]:before:whitespace-nowrap [&_[data-selected-single=true]]:before:whitespace-nowrap",
  "[&_[data-range-start=true]]:before:pointer-events-none [&_[data-range-end=true]]:before:pointer-events-none [&_[data-selected-single=true]]:before:pointer-events-none",
  "[&_[data-range-start=true]]:before:shadow-md [&_[data-range-end=true]]:before:shadow-md [&_[data-selected-single=true]]:before:shadow-md",

  // 툴팁 역삼각형 꼬리 설정
  "[&_[data-range-start=true]]:after:absolute [&_[data-range-end=true]]:after:absolute [&_[data-selected-single=true]]:after:absolute",
  "[&_[data-range-start=true]]:after:bottom-full [&_[data-range-end=true]]:after:bottom-full [&_[data-selected-single=true]]:after:bottom-full",
  "[&_[data-range-start=true]]:after:border-[4px] [&_[data-range-end=true]]:after:border-[4px] [&_[data-selected-single=true]]:after:border-[4px]",
  "[&_[data-range-start=true]]:after:border-transparent [&_[data-range-end=true]]:after:border-transparent [&_[data-selected-single=true]]:after:border-transparent",
  "[&_[data-range-start=true]]:after:z-40 [&_[data-range-end=true]]:after:z-40 [&_[data-selected-single=true]]:after:z-40",
  "[&_[data-range-start=true]]:after:pointer-events-none [&_[data-range-end=true]]:after:pointer-events-none [&_[data-selected-single=true]]:after:pointer-events-none",

  // 페이드 아웃 애니메이션 연동
  "[&_[data-range-start=true]]:before:animate-[ack-tooltip-fade_2.5s_ease-in-out_forwards]",
  "[&_[data-range-end=true]]:before:animate-[ack-tooltip-fade_2.5s_ease-in-out_forwards]",
  "[&_[data-selected-single=true]]:before:animate-[ack-tooltip-fade_2.5s_ease-in-out_forwards]",
  "[&_[data-range-start=true]]:after:animate-[ack-tooltip-fade_2.5s_ease-in-out_forwards]",
  "[&_[data-range-end=true]]:after:animate-[ack-tooltip-fade_2.5s_ease-in-out_forwards]",
  "[&_[data-selected-single=true]]:after:animate-[ack-tooltip-fade_2.5s_ease-in-out_forwards]",

  // 시작일 색상 및 텍스트
  "[&_[data-range-start=true]]:before:bg-emerald-500 [&_[data-selected-single=true]]:before:bg-emerald-500",
  "[&_[data-range-start=true]]:after:border-t-emerald-500 [&_[data-selected-single=true]]:after:border-t-emerald-500",
  "[&_[data-range-start=true]]:before:content-['시작일'] [&_[data-selected-single=true]]:before:content-['시작일']",

  // 종료일 색상 및 텍스트
  "[&_[data-range-end=true]]:before:bg-violet-500",
  "[&_[data-range-end=true]]:after:border-t-violet-500",
  "[&_[data-range-end=true]]:before:content-['종료일']",

  // 시작/종료일 동일 시 색상 및 텍스트
  "[&_[data-range-start=true][data-range-end=true]]:before:bg-emerald-500",
  "[&_[data-range-start=true][data-range-end=true]]:after:border-t-emerald-500",
  "[&_[data-range-start=true][data-range-end=true]]:before:content-['시작/종료']",
);

// ==========================================
// 4. 메인 컴포넌트
// ==========================================
export function AckDatePicker({
  mode = "single",
  startYear = new Date().getFullYear() - 10,
  endYear = new Date().getFullYear() + 10,
  showPresets = true,
  label,
  labelWidth,
  required,
  description,
  placeholder = "날짜를 선택하세요",
  allowFuture = false,
  disabled = false,
  error,
}: AckDatePickerProps) {
  const id = React.useId();
  const today = React.useMemo(() => startOfDay(new Date()), []);

  // --- 상태 (State) ---
  const [isMobile, setIsMobile] = React.useState(false);

  const [date, setDate] = React.useState<Date | DateRange | undefined>(
    mode === "single" ? today : undefined,
  );

  const [tempDate, setTempDate] = React.useState<Date | DateRange | undefined>(
    mode === "single" ? today : undefined,
  );

  const [calendarMonth, setCalendarMonth] = React.useState<Date>(today);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<PresetType>(null);
  const [focusTab, setFocusTab] = React.useState<"from" | "to">("from");

  // --- Effect: 반응형 및 상태 동기화 ---
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
    setActivePreset(null);
    setFocusTab("from");

    if (mode === "single") {
      setDate(today);
      setTempDate(today);
      setCalendarMonth(today);
    } else {
      setDate(undefined);
      setTempDate(undefined);
      setCalendarMonth(today);
    }
  }, [mode, today]);

  React.useEffect(() => {
    if (!isOpen) return;
    setTempDate(date);

    if (mode === "single") {
      setCalendarMonth((date as Date) || today);
    } else {
      const currentRange = (date as DateRange | undefined) || undefined;
      if (currentRange?.from && !currentRange?.to) {
        setFocusTab("to");
        setCalendarMonth(currentRange.from);
      } else {
        setFocusTab("from");
        setCalendarMonth(currentRange?.from || today);
      }
    }
  }, [isOpen, date, mode, today]);

  const clampedToYear = React.useMemo(() => {
    const thisYear = today.getFullYear();
    const maxYear = allowFuture ? endYear : Math.min(endYear, thisYear);
    const safeFromYear = Math.min(startYear, maxYear);
    const safeToYear = Math.max(maxYear, safeFromYear);
    return { fromYear: safeFromYear, toYear: safeToYear };
  }, [allowFuture, endYear, startYear, today]);

  // 💡 에러 표시 여부 계산: 에러 메시지가 있고, 선택된 날짜가 없을 때만 표시
  const isErrorVisible = React.useMemo(() => {
    if (!error) return false;
    if (mode === "single") {
      return !date;
    } else {
      // range 모드일 경우 from 날짜가 없으면 에러 표시
      return !(date as DateRange)?.from;
    }
  }, [error, date, mode]);

  // --- 이벤트 핸들러 ---
  const handleSelect = (selectedData: Date | DateRange | undefined) => {
    setActivePreset(null);

    if (mode === "single") {
      const normalized = normalizeSingle(selectedData as Date | undefined);
      setDate(normalized);
      setIsOpen(false);
      return;
    }

    const newRange = selectedData as DateRange | undefined;
    const current = normalizeRange(tempDate as DateRange | undefined) || {
      from: undefined,
      to: undefined,
    };

    let clickedDate: Date | undefined;
    if (
      newRange?.from &&
      (!current.from || newRange.from.getTime() !== current.from.getTime())
    ) {
      clickedDate = newRange.from;
    } else if (
      newRange?.to &&
      (!current.to || newRange.to.getTime() !== current.to.getTime())
    ) {
      clickedDate = newRange.to;
    } else if (!newRange) {
      clickedDate = current.from;
    } else {
      clickedDate = newRange?.from || newRange?.to;
    }

    if (!clickedDate) return;
    const normalizedClicked = startOfDay(clickedDate);

    if (focusTab === "from") {
      if (current.to && normalizedClicked > current.to) {
        setTempDate({ from: normalizedClicked, to: undefined });
      } else {
        setTempDate({ from: normalizedClicked, to: current.to });
      }
      setFocusTab("to");
    } else {
      if (current.from && normalizedClicked < current.from) {
        setTempDate({ from: normalizedClicked, to: undefined });
        setFocusTab("to");
      } else {
        setTempDate({ from: current.from, to: normalizedClicked });
        setFocusTab("from");
      }
    }
  };

  const handleTabClick = (tab: "from" | "to") => {
    setFocusTab(tab);
    const rangeDate = (tempDate as DateRange) || {};

    if (tab === "from" && rangeDate.from) {
      setCalendarMonth(rangeDate.from);
    } else if (tab === "to" && rangeDate.to) {
      setCalendarMonth(rangeDate.to);
    }
  };

  const handleConfirm = () => {
    if (mode === "single")
      setDate(normalizeSingle(tempDate as Date | undefined));
    else setDate(normalizeRange(tempDate as DateRange | undefined));
    setIsOpen(false);
  };

  const handleCancel = () => setIsOpen(false);

  const handleReset = () => {
    setTempDate(undefined);
    setActivePreset(null);
    setFocusTab("from");
    setCalendarMonth(today);
  };

  const handlePreset = (preset: PresetType, isInside: boolean) => {
    if (!preset) return;

    const now = startOfDay(new Date());
    let fromDate = now;

    switch (preset) {
      case "today":
        fromDate = now;
        break;
      case "week":
        fromDate = subDays(now, 7);
        break;
      case "month":
        fromDate = subMonths(now, 1);
        break;
      case "year":
        fromDate = subYears(now, 1);
        break;
      case "all":
        fromDate = startOfDay(new Date(startYear, 0, 1));
        break;
    }

    const newDateRange: DateRange = { from: fromDate, to: now };
    setTempDate(newDateRange);
    setActivePreset(preset);
    setCalendarMonth(fromDate);

    if (!isInside) {
      setDate(newDateRange);
      setTempDate(newDateRange);
      setFocusTab("from");
      setIsOpen(false);
    }
  };

  // --- UI 렌더링 헬퍼 ---
  const renderDateText = () => {
    if (mode === "single") {
      if (!date)
        return <span className="text-muted-foreground">{placeholder}</span>;
      return format(date as Date, "yyyy-MM-dd", { locale: ko });
    }

    const rangeDate = (date as DateRange) || {};
    return (
      <div className="flex items-center gap-1">
        <span
          className={cn(
            rangeDate?.from ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {rangeDate?.from ? format(rangeDate.from, "yyyy-MM-dd") : "시작일"}
        </span>
        <span className="text-muted-foreground text-xs">~</span>
        <span
          className={cn(
            rangeDate?.to ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {rangeDate?.to ? format(rangeDate.to, "yyyy-MM-dd") : "종료일"}
        </span>
      </div>
    );
  };

  const renderTempDateText = () => {
    if (mode !== "range") return null;
    const rangeDate = (tempDate as DateRange) || {};

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-3 w-full px-1 sm:px-2">
        <div
          onClick={() => handleTabClick("from")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3 py-2 text-center rounded-md border text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap",
            focusTab === "from"
              ? "border-primary ring-primary bg-primary/10 text-primary font-semibold shadow-sm"
              : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            rangeDate?.from && focusTab !== "from" && "text-foreground",
          )}
        >
          {focusTab === "from" ? (
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-40" />
          )}
          <span className="tracking-tighter sm:tracking-normal">
            {rangeDate?.from
              ? format(rangeDate.from, "yyyy-MM-dd")
              : "시작일 선택"}
          </span>
        </div>

        <span className="text-muted-foreground font-light shrink-0">~</span>

        <div
          onClick={() => handleTabClick("to")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3 py-2 text-center rounded-md border text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap",
            focusTab === "to"
              ? "border-primary ring-primary bg-primary/10 text-primary font-semibold shadow-sm"
              : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            rangeDate?.to && focusTab !== "to" && "text-foreground ",
          )}
        >
          {focusTab === "to" ? (
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-40" />
          )}
          <span className="tracking-tighter sm:tracking-normal">
            {rangeDate?.to ? format(rangeDate.to, "yyyy-MM-dd") : "종료일 선택"}
          </span>
        </div>
      </div>
    );
  };

  // ==========================================
  // 5. JSX 리턴
  // ==========================================

  return (
    <div
      className={cn(
        "flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes ack-tooltip-fade {
            0% { opacity: 0; transform: translateX(0%) translateY(4px) scale(0.9); }
            10% { opacity: 1; transform: translateX(0%) translateY(0) scale(1); }
            90% { opacity: 1; transform: translateX(0%) translateY(0) scale(1); }
            100% { opacity: 0; transform: translateX(0%) translateY(0) scale(1); }
          }
        `,
        }}
      />

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

      <div className="flex flex-wrap items-center gap-1">
        <div
          className={cn(
            "relative",
            mode === "range"
              ? "w-[240px] max-sm:w-full"
              : "w-[140px] max-sm:w-full",
          )}
        >
          <Popover open={disabled ? false : isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant={"outline"}
                disabled={disabled}
                className={cn(
                  "justify-start text-left font-normal px-3 py-1 gap-2",
                  "w-full",
                  disabled && "cursor-not-allowed",
                  isErrorVisible &&
                    "border-destructive focus-visible:ring-destructive pr-10",
                )}
              >
                {mode === "range" ? (
                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                )}
                {renderDateText()}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0 border-border shadow-lg max-w-[95vw] overflow-hidden"
              align="start"
            >
              {mode === "single" ? (
                <div className="flex flex-col">
                  <Calendar
                    mode="single"
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    selected={date as Date | undefined}
                    onSelect={handleSelect}
                    initialFocus
                    locale={ko}
                    captionLayout="dropdown"
                    fromYear={clampedToYear.fromYear}
                    toYear={clampedToYear.toYear}
                    toMonth={allowFuture ? undefined : today}
                    disabled={allowFuture ? undefined : { after: today }}
                  />
                  <div className="p-2 border-t text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={() => {
                        setDate(today);
                        setIsOpen(false);
                      }}
                    >
                      오늘 날짜 선택
                    </Button>
                  </div>
                </div>
              ) : (
                // 💡 모바일은 flex-col(위아래 배치), 데스크탑은 flex-row(좌우 배치)로 동작하도록 수정
                <div className="flex flex-col sm:flex-row">
                  {/* 💡 빠른 선택 패널 (모바일: 상단, 데스크탑: 우측 고정) */}
                  <div className="order-1 sm:order-2 flex flex-row sm:flex-col max-sm:gap-0 gap-2 p-3 bg-muted/10 border-b sm:border-b-0 sm:border-l w-full sm:w-[100px] shrink-0 overflow-x-auto scrollbar-hide">
                    <span className="hidden sm:block text-xs font-bold text-center text-muted-foreground mb-1">
                      빠른 선택
                    </span>
                    {PRESET_OPTIONS.map((preset) => (
                      <Button
                        key={preset.key}
                        variant={
                          activePreset === preset.key ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePreset(preset.key, true)}
                        className="shrink-0 sm:w-full whitespace-nowrap"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>

                  {/* 달력 영역 (모바일: 하단, 데스크탑: 좌측) */}
                  <div className="order-2 sm:order-1 flex flex-col overflow-hidden max-w-[100vw]">
                    <div className="px-4 py-3 border-b bg-muted/30 text-center">
                      {renderTempDateText()}
                    </div>

                    <Calendar
                      mode="range"
                      className={CALENDAR_TOOLTIP_CLASSES}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      selected={tempDate as DateRange | undefined}
                      onSelect={handleSelect}
                      initialFocus
                      locale={ko}
                      numberOfMonths={isMobile ? 1 : 2}
                      captionLayout="dropdown"
                      fromYear={clampedToYear.fromYear}
                      toYear={clampedToYear.toYear}
                      toMonth={allowFuture ? undefined : today}
                      disabled={allowFuture ? undefined : { after: today }}
                    />

                    {/* 하단 제어 버튼 모음 */}
                    <div className="flex items-center justify-between p-3 border-t gap-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={handleReset}>
                          초기화
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary max-sm:hidden"
                          onClick={() => setCalendarMonth(today)}
                        >
                          오늘로 이동
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          취소
                        </Button>
                        <Button size="sm" onClick={handleConfirm}>
                          확인
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {isErrorVisible && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
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
            </div>
          )}
        </div>

        {showPresets && mode === "range" && (
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md overflow-x-auto max-w-full">
            {PRESET_OPTIONS.map((preset) => (
              <Button
                key={preset.key}
                variant={activePreset === preset.key ? "default" : "ghost"}
                size="sm"
                disabled={disabled}
                className="whitespace-nowrap"
                onClick={() => handlePreset(preset.key, false)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
