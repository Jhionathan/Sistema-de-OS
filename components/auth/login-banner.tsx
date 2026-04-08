import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export function LoginBanner() {
  return (
    <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-muted lg:flex">
      <Image
        src="/images/login-bg.jpg"
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
          <span className="text-xl font-bold tracking-wider text-gray-500">
            H4C<span className="text-gray-500/60">Distribuição</span>
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
  );
}
