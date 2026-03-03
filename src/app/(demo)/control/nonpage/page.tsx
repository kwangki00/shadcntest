"use client";

import * as React from "react";
import { AckDataTable } from "@/components/controls/ackdatatable";
import { paymentColumns, Payment } from "../columns";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card } from "@/components/ui/card";

// ==========================================
// 100개의 샘플 결제 데이터를 무작위로 생성하는 함수
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
  const [data, setData] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = generateMockPayments(1000);
      setData(mockData);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ContentLayout title="결제 관리 시스템">
      <Card className="h-[calc(100vh-140px)] p-6 overflow-hidden">
        <AckDataTable
          title="조회 결과"
          // 💡 description을 안 써도 "총 1,000건의 내역이 조회되었습니다."가 자동 출력됩니다.
          // 💡 만약 추가 문구가 필요하면 description="안전하게" 처럼만 보내면 됩니다.
          columns={paymentColumns}
          data={data}
          isLoading={isLoading}
          enablePagination={false}
          onRowClick={(row) => console.log(row)}
        />
      </Card>
    </ContentLayout>
  );
}
