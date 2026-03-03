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
  PopoverTrigger
} from "@/components/ui/popover";

import {
  Calendar as CalendarIcon,
  CalendarRange,
  CheckCircle2,
  Circle
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AckLabel } from "./acklabel";

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
}

type PresetType = "today" | "week" | "month" | "year" | "all" | null;

const PRESET_OPTIONS: { key: NonNullable<PresetType>; label: string }[] = [
  { key: "today", label: "1일" },
  { key: "week", label: "1주일" },
  { key: "month", label: "1개월" },
  { key: "year", label: "1년" },
  { key: "all", label: "전체" }
];

// ==========================================
// 2. 유틸리티 함수
// ==========================================

// 날짜 비교 시 시간(시/분/초)으로 인한 오차를 방지하기 위해 00:00:00으로 정규화
const normalizeSingle = (d?: Date) => (d ? startOfDay(d) : undefined);
const normalizeRange = (r?: DateRange) => {
  if (!r) return undefined;
  return {
    from: r.from ? startOfDay(r.from) : undefined,
    to: r.to ? startOfDay(r.to) : undefined
  } satisfies DateRange;
};

// ==========================================
// 3. 캘린더 툴팁(말풍선) CSS 설정
// ==========================================
// 시작일(초록색), 종료일(보라색) 툴팁을 띄우고 2.5초간 애니메이션 적용
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
  "[&_[data-range-start=true][data-range-end=true]]:before:content-['시작/종료']"
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
  disabled = false
}: AckDatePickerProps) {
  const id = React.useId();
  const today = React.useMemo(() => startOfDay(new Date()), []);

  // --- 상태 (State) ---
  const [isMobile, setIsMobile] = React.useState(false);

  // date: 팝업 외부에서도 유지되는 확정된 날짜
  const [date, setDate] = React.useState<Date | DateRange | undefined>(
    mode === "single" ? today : undefined
  );

  // tempDate: 팝업 내부에서 달력을 클릭하며 변경하는 임시 날짜 (확인 버튼 클릭 시 date로 반영)
  const [tempDate, setTempDate] = React.useState<Date | DateRange | undefined>(
    mode === "single" ? today : undefined
  );

  // calendarMonth: 현재 달력 화면에 렌더링되고 있는 연/월 상태
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(today);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<PresetType>(null);
  const [focusTab, setFocusTab] = React.useState<"from" | "to">("from");

  // --- Effect: 반응형 및 상태 동기화 ---

  // 모바일 뷰어 감지
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 외부 프롭(mode)이 변경될 경우 내부 상태 초기화 (타입 충돌 방지)
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

  // 팝업 오픈 시 tempDate를 확정된 date 상태로 동기화 & 달력 월(Month) 스크롤 이동
  React.useEffect(() => {
    if (!isOpen) return;
    setTempDate(date);

    if (mode === "single") {
      setCalendarMonth((date as Date) || today);
    } else {
      const currentRange = (date as DateRange | undefined) || undefined;
      // 시작일만 있는 상태면 강제로 종료일 탭으로 포커스
      if (currentRange?.from && !currentRange?.to) {
        setFocusTab("to");
        setCalendarMonth(currentRange.from);
      } else {
        setFocusTab("from");
        setCalendarMonth(currentRange?.from || today);
      }
    }
  }, [isOpen, date, mode, today]);

  // 미래 날짜 선택 불가(allowFuture=false)일 경우 연도 드롭다운 제한
  const clampedToYear = React.useMemo(() => {
    const thisYear = today.getFullYear();
    const maxYear = allowFuture ? endYear : Math.min(endYear, thisYear);
    const safeFromYear = Math.min(startYear, maxYear);
    const safeToYear = Math.max(maxYear, safeFromYear);
    return { fromYear: safeFromYear, toYear: safeToYear };
  }, [allowFuture, endYear, startYear, today]);

  // --- 이벤트 핸들러 ---

  // 달력 날짜 클릭 시 처리
  const handleSelect = (selectedData: Date | DateRange | undefined) => {
    setActivePreset(null);

    // 단일 선택 모드: 즉시 반영 후 팝업 닫기
    if (mode === "single") {
      const normalized = normalizeSingle(selectedData as Date | undefined);
      setDate(normalized);
      setIsOpen(false);
      return;
    }

    // 기간 선택 모드: 현재 포커스된 탭(from/to)과 클릭된 날짜를 기반으로 기간 재계산
    const newRange = selectedData as DateRange | undefined;
    const current = normalizeRange(tempDate as DateRange | undefined) || {
      from: undefined,
      to: undefined
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

    // 시작일/종료일 역전 시 탭 및 날짜 자동 재배치
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

  // 상단 탭(시작일/종료일) 클릭 시 달력 월(Month) 스크롤 점프
  const handleTabClick = (tab: "from" | "to") => {
    setFocusTab(tab);
    const rangeDate = (tempDate as DateRange) || {};

    if (tab === "from" && rangeDate.from) {
      setCalendarMonth(rangeDate.from);
    } else if (tab === "to" && rangeDate.to) {
      setCalendarMonth(rangeDate.to);
    }
  };

  // 하단 액션 버튼 처리
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

  // 프리셋(오늘, 1주일, 1개월 등) 클릭 처리
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

    // 팝업 외부 프리셋은 클릭 즉시 반영 및 팝업 닫기
    if (!isInside) {
      setDate(newDateRange);
      setTempDate(newDateRange);
      setFocusTab("from");
      setIsOpen(false);
    }
  };

  // --- UI 렌더링 헬퍼 ---

  // 트리거 버튼(입력창) 텍스트 렌더링
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
            rangeDate?.from ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {rangeDate?.from ? format(rangeDate.from, "yyyy-MM-dd") : "시작일"}
        </span>
        <span className="text-muted-foreground text-xs">~</span>
        <span
          className={cn(
            rangeDate?.to ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {rangeDate?.to ? format(rangeDate.to, "yyyy-MM-dd") : "종료일"}
        </span>
      </div>
    );
  };

  // 기간 모드 시 팝업 상단 From-To 탭 렌더링
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
            rangeDate?.from && focusTab !== "from" && "text-foreground"
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
            rangeDate?.to && focusTab !== "to" && "text-foreground "
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
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* 툴팁 애니메이션 (2.5초 지연 후 페이드아웃) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes ack-tooltip-fade {
            0% { opacity: 0; transform: translateX(0%) translateY(4px) scale(0.9); }
            10% { opacity: 1; transform: translateX(0%) translateY(0) scale(1); }
            90% { opacity: 1; transform: translateX(0%) translateY(0) scale(1); }
            100% { opacity: 0; transform: translateX(0%) translateY(0) scale(1); }
          }
        `
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
            labelWidth && "shrink-0 flex-none"
          )}
        />
      )}

      <div className="flex flex-wrap items-center gap-1">
        <Popover open={disabled ? false : isOpen} onOpenChange={setIsOpen}>
          {/* 트리거 버튼 (클릭 시 달력 노출) */}
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={"outline"}
              disabled={disabled}
              className={cn(
                "justify-start text-left font-normal px-3 py-1 gap-2",
                mode === "range"
                  ? "w-[240px] max-sm:w-full"
                  : "w-[140px] max-sm:w-full",
                disabled && "cursor-not-allowed"
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
            {/* 단일 선택 모드 UI */}
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
              // 기간 선택 모드 UI
              <div className="flex flex-row">
                <div className="flex flex-col overflow-hidden max-w-[100vw]">
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
                        className="text-primary"
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

                {/* 우측 내부 프리셋 패널 (항상 표시) */}
                <div className="flex flex-col gap-2 p-3 bg-muted/10 border-l w-[100px] shrink-0">
                  <span className="text-xs font-bold text-center text-muted-foreground mb-1">
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
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* 하단 외부 프리셋 영역 (showPresets 옵션에 따라 제어됨) */}
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
