"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row
} from "@tanstack/react-table";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2
} from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

// ==========================================
// 1. 타입 정의
// ==========================================
interface AckDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  className?: string; // 최상단 래퍼 스타일
  containerClassName?: string; // 테이블 스크롤 영역 스타일
  enablePagination?: boolean; // 페이징 활성화 여부
  title?: string; // 테이블 제목
  description?: string; // 추가 설명 (접두어 형태)
  selectOnRowClick?: boolean; // 행 클릭 시 선택(체크박스) 토글 여부
  enableVirtualization?: boolean; // 가상 스크롤 활성화 여부
}

// ==========================================
// 💡 [최적화] 메모이제이션된 행 컴포넌트
// React.memo를 사용하여 부모 상태가 변해도 자신과 연관된 데이터가
// 변경되지 않으면 리렌더링을 건너뜁니다. (1,000개 이상 데이터 시 필수)
// ==========================================
const AckDataTableRow = React.memo(
  ({
    row,
    onRowClick,
    selectOnRowClick,
    virtualRef,
    dataIndex,
    isSelected
  }: {
    row: Row<any>;
    onRowClick?: (row: any) => void;
    selectOnRowClick?: boolean;
    virtualRef?: (node: Element | null) => void; // 가상화 엔진이 높이를 측정하기 위한 Ref
    dataIndex?: number;
    isSelected: boolean; // 체크박스 선택 여부
  }) => {
    return (
      <TableRow
        ref={virtualRef} // 가상화 요소 추적을 위해 연결
        data-index={dataIndex}
        data-state={isSelected && "selected"}
        onClick={() => {
          // 1. 사용자가 텍스트를 드래그 복사 중일 때는 클릭 이벤트를 무시함
          const selection = window.getSelection();
          if (selection && selection.toString().length > 0) return;

          // 2. 행 클릭 시 체크박스 토글 설정이 켜져있으면 실행
          if (selectOnRowClick) {
            row.toggleSelected();
          }
          // 3. 외부에서 정의한 로우 클릭 콜백 실행
          onRowClick?.(row.original);
        }}
        className={cn(
          "transition-colors hover:bg-muted/50",
          onRowClick || selectOnRowClick ? "cursor-pointer" : "cursor-default",
          isSelected && "bg-muted/30"
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="border-r last:border-r-0 py-0 ">
            {/* TanStack Table의 유연한 렌더링 함수 사용 */}
            <div className="flex items-center justify-center w-full h-full px-2 py-1">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>{" "}
          </TableCell>
        ))}
      </TableRow>
    );
  },
  (prev, next) => {
    // 💡 [핵심] 렌더링 최적화 조건:
    // 이전 값과 다음 값의 원본 데이터 및 선택 상태가 같으면 리렌더링하지 않음
    return (
      prev.row.original === next.row.original &&
      prev.isSelected === next.isSelected &&
      prev.onRowClick === next.onRowClick &&
      prev.selectOnRowClick === next.selectOnRowClick
    );
  }
);
AckDataTableRow.displayName = "AckDataTableRow";

export function AckDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "조회된 데이터가 없습니다.",
  onRowClick,
  className,
  containerClassName,
  enablePagination = true,
  title,
  description,
  selectOnRowClick = true,
  enableVirtualization = false
}: AckDataTableProps<TData, TValue>) {
  // --- 테이블 상태 관리 (정렬, 선택) ---
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  // --- TanStack Table 초기화 엔진 ---
  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      enableSorting: false // 💡 기본적으로 모든 컬럼의 정렬을 비활성화합니다.
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // 페이징 기능을 끄면 해당 모델을 제외하여 전체 데이터를 한 번에 처리함
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection
    }
  });

  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null); // 스크롤이 발생하는 컨테이너 Ref

  // --- 가상화 엔진 설정 (TanStack Virtual) ---
  const rowVirtualizer = useVirtualizer({
    count: rows.length, // 총 행 개수
    getScrollElement: () => parentRef.current, // 스크롤 감시 대상
    estimateSize: () => 40, // 각 행의 평균 높이
    overscan: 5, // 화면 밖 위아래에 미리 그려둘 행의 수
    enabled: enableVirtualization // 옵션에 따라 가상화 켜고 끄기
  });

  return (
    <div className={cn("flex flex-col h-full space-y-2", className)}>
      {/* [헤더 영역] 제목 및 동적 총 건수 표시 */}
      {(title || data.length >= 0) && (
        <div className="flex gap-2 items-end">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {description ? `${description} ` : ""}총{" "}
            <span className="font-bold text-primary">
              {data.length.toLocaleString()}
            </span>
            건
          </p>
        </div>
      )}

      {/* [테이블 바디 영역] 고정 헤더와 가로/세로 스크롤을 관리하는 컨테이너 */}
      <div
        className={cn(
          "rounded-md border bg-card flex-1 min-h-0 relative",
          // 가상화 혹은 페이징 비활성 시 부모 높이에 꽉 차도록 설정
          (!enablePagination || enableVirtualization) &&
            "[&>div]:h-full [&>div]:overflow-auto",
          containerClassName
        )}
      >
        <div ref={parentRef} className="relative w-full overflow-auto h-full">
          <table className="w-full caption-bottom text-sm border-collapse">
            {/* Sticky Header: 상단에 고정하고 배경색을 입혀 스크롤 시 겹침 방지 */}
            <TableHeader className="sticky top-0 z-20 bg-muted shadow-[0_1px_0_0_hsl(var(--border))]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-none"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap font-semibold text-foreground bg-muted border-r last:border-r-0 text-center",
                        header.column.getCanSort() && "select-none"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                /* 로딩 스켈레톤/스피너 영역 */
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span>데이터를 불러오는 중입니다...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                enableVirtualization ? (
                  /* --- 가상화 렌더링 모드 --- */
                  <>
                    {/* 상단 빈 공간: 화면 위로 지나간 아이템들의 총 높이만큼 패딩 처리 */}
                    {rowVirtualizer.getVirtualItems().length > 0 && (
                      <tr>
                        <td
                          style={{
                            height: `${rowVirtualizer.getVirtualItems()[0].start}px`
                          }}
                        />
                      </tr>
                    )}
                    {/* 현재 눈에 보이는 행들만 렌더링 */}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index];
                      return (
                        <AckDataTableRow
                          key={row.id}
                          row={row}
                          onRowClick={onRowClick}
                          selectOnRowClick={selectOnRowClick}
                          virtualRef={rowVirtualizer.measureElement} // 행 높이 측정을 위해 엔진에 전달
                          dataIndex={virtualRow.index}
                          isSelected={row.getIsSelected()}
                        />
                      );
                    })}
                    {/* 하단 빈 공간: 아직 아래에 남아있는 아이템들의 총 높이만큼 패딩 처리 */}
                    {rowVirtualizer.getVirtualItems().length > 0 && (
                      <tr>
                        <td
                          style={{
                            height: `${
                              rowVirtualizer.getTotalSize() -
                              rowVirtualizer.getVirtualItems()[
                                rowVirtualizer.getVirtualItems().length - 1
                              ].end
                            }px`
                          }}
                        />
                      </tr>
                    )}
                  </>
                ) : (
                  /* --- 일반 렌더링 모드 (전체 데이터 노출) --- */
                  rows.map((row) => (
                    <AckDataTableRow
                      key={row.id}
                      row={row}
                      onRowClick={onRowClick}
                      selectOnRowClick={selectOnRowClick}
                      isSelected={row.getIsSelected()}
                    />
                  ))
                )
              ) : (
                /* 데이터가 없는 경우 */
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground italic"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
      </div>

      {/* [푸터 영역] 페이지네이션 버튼들 (enablePagination이 true일 때만 노출) */}
      {enablePagination && table.getPageCount() > 0 && (
        <div className="flex-none flex items-center justify-between px-2 py-1">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} 선택됨
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">
                페이지 {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </p>
            </div>
            {/* 페이지 이동 컨트롤 그룹 */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
