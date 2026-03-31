"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("admin@sistema.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl,
      });

      if (result?.error) {
        toast.error("E-mail ou senha inválidos.", {
          description: "Verifique suas credenciais e tente novamente."
        });
        setLoading(false);
        return;
      }

      toast.success("Login efetuado com sucesso!", {
        description: "Redirecionando você para o painel..."
      });
      
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Erro interno", {
        description: "Não foi possível conectar ao servidor."
      });
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Lado Esquerdo - Banner Decorativo */}
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-muted lg:flex">
        <Image
          src="/images/login-bg.png"
          alt="Serviços Técnicos Premium"
          fill
          priority
          className="object-cover transition-transform duration-1000 animate-in zoom-in-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        
        <div className="relative z-10 p-12 text-white mt-auto animate-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">
              SISTEMA<span className="text-white/60">.OS</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold font-heading text-white max-w-lg mb-4 leading-tight drop-shadow-md">
            Gestão inteligente de visitas técnicas.
          </h1>
          <p className="text-lg text-white/80 max-w-md drop-shadow-sm font-medium">
            Otimize o fluxo de ordens de serviço, agende técnicos com facilidade e eleve a satisfação dos seus clientes.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-[45%] bg-background">
        <div className="w-full max-w-sm animate-in slide-in-from-bottom-8 duration-500">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                E-mail
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-accent/50 focus:bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@empresa.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Senha
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-accent/50 focus:bg-background"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-80 disabled:cursor-wait bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                "Entrar na plataforma"
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground border border-border/40 hover:border-border transition-colors">
            <div className="flex flex-col gap-2">
              <p className="flex justify-between items-center"><strong className="text-foreground/80 font-semibold">Admin:</strong> <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50">admin@sistema.com</span></p>
              <p className="flex justify-between items-center"><strong className="text-foreground/80 font-semibold">Manager:</strong> <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50">manager@sistema.com</span></p>
              <p className="flex justify-between items-center"><strong className="text-foreground/80 font-semibold">Técnico:</strong> <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50">tecnico@sistema.com</span></p>
              <p className="text-center text-xs mt-2 opacity-60">Senha universal: 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}