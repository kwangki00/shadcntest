"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { AckDataTableColumnHeader } from "@/components/controls/ackdatatable-column-header";

// ==========================================
// 1. 데이터 타입 정의 (20개 필드)
// ==========================================
export type Payment = {
  id: string; // ID
  status: "success" | "pending" | "processing" | "failed"; // 상태
  email: string; // 이메일
  amount: number; // 결제금액
  method: string; // 결제수단
  cardCompany: string; // 카드사
  cardNumber: string; // 카드번호
  plan: string; // 구독플랜
  region: string; // 지역
  currency: string; // 통화
  vat: number; // 부가세
  fee: number; // 수수료
  netAmount: number; // 순수익
  orderNo: string; // 주문번호
  isRefunded: boolean; // 환불여부
  customerName: string; // 고객명
  phone: string; // 연락처
  ipAddress: string; // IP주소
  userAgent: string; // 환경
  createdAt: string; // 생성일
};

// ==========================================
// 3. 컬럼 정의 배열
// ==========================================
export const paymentColumns: ColumnDef<Payment>[] = [
  // (1) 선택 체크박스
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center w-full">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="flex justify-center w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // (2) ID
  {
    accessorKey: "id",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="ID"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs">{row.getValue("id")}</div>
    ),
  },
  // (3) 결제 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="상태"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        success: "default",
        pending: "outline",
        processing: "secondary",
        failed: "destructive",
      };
      return (
        <div className="flex justify-center">
          <Badge
            variant={variants[status] || "outline"}
            className="whitespace-nowrap"
          >
            {status.toUpperCase()}
          </Badge>
        </div>
      );
    },
  },
  // (4) 고객명
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="고객명"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center ">{row.getValue("customerName")}</div>
    ),
  },
  // (5) 이메일
  {
    accessorKey: "email",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="이메일"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.getValue("email")}
      </div>
    ),
  },
  // (6) 결제 금액 (우측 정렬 필수)
  {
    accessorKey: "amount",
    enableSorting: true, // 💡 이 컬럼만 정렬을 활성화합니다.
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="결제금액"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <div className="text-right font-bold pr-2">
          {amount.toLocaleString()}원
        </div>
      );
    },
  },
  // (7) 순수익 (강조 컬러)
  {
    accessorKey: "netAmount",
    enableSorting: true, // 💡 이 컬럼만 정렬을 활성화합니다.
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="순수익"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => {
      const netAmount = parseFloat(row.getValue("netAmount"));
      return (
        <div className="text-right font-bold text-primary pr-2">
          {netAmount.toLocaleString()}원
        </div>
      );
    },
  },
  // (8) 수수료
  {
    accessorKey: "fee",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="수수료"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right text-destructive pr-2">
        -{row.original.fee.toLocaleString()}원
      </div>
    ),
  },
  // (9) 부가세
  {
    accessorKey: "vat",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="부가세"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right text-muted-foreground pr-2">
        {row.original.vat.toLocaleString()}원
      </div>
    ),
  },
  // (10) 결제수단
  {
    accessorKey: "method",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="수단"
        className="w-full justify-center min-w-[60px]"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("method")}</div>
    ),
  },
  // (11) 카드사
  {
    accessorKey: "cardCompany",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="카드사"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center whitespace-nowrap">
        {row.getValue("cardCompany")}
      </div>
    ),
  },
  // (12) 카드번호
  {
    accessorKey: "cardNumber",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="카드번호"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs text-muted-foreground italic">
        {row.getValue("cardNumber")}
      </div>
    ),
  },
  // (13) 플랜
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="구독플랜"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.getValue("plan")}</Badge>
      </div>
    ),
  },
  // (14) 주문번호
  {
    accessorKey: "orderNo",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="주문번호"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs truncate max-w-[120px]">
        {row.getValue("orderNo")}
      </div>
    ),
  },
  // (15) 지역
  {
    accessorKey: "region",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="지역"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs">{row.getValue("region")}</div>
    ),
  },
  // (16) 통화
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="통화"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.getValue("currency")}
      </div>
    ),
  },
  // (17) 연락처
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="연락처"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs">{row.getValue("phone")}</div>
    ),
  },
  // (18) IP 주소
  {
    accessorKey: "ipAddress",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="IP주소"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs text-muted-foreground">
        {row.getValue("ipAddress")}
      </div>
    ),
  },
  // (19) 기기 환경
  {
    accessorKey: "userAgent",
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="환경"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div
        className="text-center max-w-[100px] truncate text-[10px] text-muted-foreground"
        title={row.original.userAgent}
      >
        {row.getValue("userAgent")}
      </div>
    ),
  },
  // (20) 결제 일시
  {
    accessorKey: "createdAt",
    enableSorting: true, // 💡 이 컬럼만 정렬을 활성화합니다.
    header: ({ column }) => (
      <AckDataTableColumnHeader
        column={column}
        title="결제일시"
        className="w-full justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center whitespace-nowrap text-xs">
        {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm")}
      </div>
    ),
  },
];
