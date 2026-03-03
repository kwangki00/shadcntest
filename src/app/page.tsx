import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            로그인
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            아이디와 비밀번호를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">비밀번호</Label>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
              >
                비밀번호 찾기
              </a>
            </div>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-2">
          <Button variant="default" asChild>
            <Link href="/dashboard" className="w-full md:w-auto">
              로그인
              <ArrowRightIcon className="ml-2" />
            </Link>
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            아직 계정이 없으신가요?
            <a href="#" className="font-semibold text-primary hover:underline">
              회원가입
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
