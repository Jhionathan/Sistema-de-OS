import { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: number;
  description: string;
  icon?: ReactNode;
};

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 group">
      {/* Decorative gradient background */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </p>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10 transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
        
        <p className="mt-4 text-4xl font-bold tracking-tight text-foreground font-heading">
          {value}
        </p>
        <p className="mt-2 text-xs font-medium text-muted-foreground/80">
          {description}
        </p>
      </div>
    </div>
  );
}