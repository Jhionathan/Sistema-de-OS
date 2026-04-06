import { LoginBanner } from "@/components/auth/login-banner";
import { LoginForm } from "@/components/auth/login-form";
import { LoginHeader } from "@/components/auth/login-header";
import { DemoCredentials } from "@/components/auth/demo-credentials";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <LoginBanner />

      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-[45%] bg-background">
        <div className="w-full max-w-sm animate-in slide-in-from-bottom-8 duration-500">
          <LoginHeader />
          <Suspense fallback={<div>Carregando formulário...</div>}>
            <LoginForm />
          </Suspense>
          <DemoCredentials />
        </div>
      </div>
    </div>
  );
}