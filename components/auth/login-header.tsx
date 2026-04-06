import { ShieldCheck } from "lucide-react";

export function LoginHeader() {
  return (
    <>
      <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-wider text-foreground">
          SISTEMA<span className="text-primary/70">.OS</span>
        </span>
      </div>
      
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">Bem-vindo de volta</h2>
        <p className="text-muted-foreground">
          Faça login na sua conta para acessar o painel.
        </p>
      </div>
    </>
  );
}
