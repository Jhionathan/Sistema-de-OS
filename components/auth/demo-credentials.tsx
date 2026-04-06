export function DemoCredentials() {
  return (
    <div className="mt-8 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground border border-border/40 hover:border-border transition-colors">
      <div className="flex flex-col gap-2">
        <p className="flex justify-between items-center"><strong className="text-foreground/80 font-semibold">Admin:</strong> <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50">admin@sistema.com</span></p>
        <p className="flex justify-between items-center"><strong className="text-foreground/80 font-semibold">Manager:</strong> <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50">manager@sistema.com</span></p>
        <p className="flex justify-between items-center"><strong className="text-foreground/80 font-semibold">Técnico:</strong> <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50">tecnico@sistema.com</span></p>
        <p className="text-center text-xs mt-2 opacity-60">Senha universal: 123456</p>
      </div>
    </div>
  );
}
