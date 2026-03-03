"use client";

import * as React from "react";
import { AckDataTable } from "@/components/controls/ackdatatable";
import { paymentColumns, Payment } from "./columns";

// ==========================================
// 💡 [추가] 100개의 샘플 결제 데이터를 무작위로 생성하는 함수
// ==========================================
function generateMockPayments(count: number): Payment[] {
  return Array.from({ length: count }, (_, index) => {
    const amount = Math.floor(Math.random() * 100) * 1000 + 10000;
    const vat = Math.floor(amount * 0.1);
    const fee = Math.floor(amount * 0.03);

    return {
      id: `pay-${index + 1000}`,
      status: Math.random() > 0.1 ? "success" : "failed",
      email: `user${index}@example.com`,
      customerName: `고객${index}`,
      amount,
      vat,
      fee,
      netAmount: amount - vat - fee,
      method: "신용카드",
      cardCompany: "현대카드",
      cardNumber: "****-****-1234-5678",
      plan: "Premium",
      region: "Seoul, KR",
      currency: "KRW",
      orderNo: `ORD-${Date.now()}-${index}`,
      isRefunded: false,
      phone: "010-1234-5678",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36",
      createdAt: new Date().toISOString()
    };
  });
}

// ==========================================
// 메인 페이지 컴포넌트
// ==========================================
export default function PaymentPage() {
  // 상태 관리: 빈 배열로 시작하여 1초 뒤에 100개 데이터가 채워집니다.
  const [data, setData] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // 실제 서버 API(fetch)를 호출하는 것처럼 1초(1000ms)의 지연 시간을 줍니다.
    const timer = setTimeout(() => {
      // 💡 100 -> 1000으로 변경! (1000개의 가짜 데이터 생성)
      const mockData = generateMockPayments(1000);
      setData(mockData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* 헤더 영역 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">결제 내역 관리</h1>
        <p className="text-muted-foreground mt-2">
          총 {data.length}건의 결제 내역이 조회되었습니다.
        </p>
      </div>

      {/* 💡 우리가 만든 만능 데이터 테이블 호출! */}
      <AckDataTable
        columns={paymentColumns}
        data={data}
        isLoading={isLoading}
        emptyMessage="최근 결제 내역이 없습니다."
        onRowClick={(row) => console.log("클릭된 결제 데이터:", row)}
      />
    </div>
  );
}
