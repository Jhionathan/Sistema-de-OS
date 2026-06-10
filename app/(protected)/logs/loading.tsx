import { Skeleton } from "@/components/ui/shared/skeleton";

export default function LogsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="rounded-xl border bg-white shadow">
        <div className="p-6 space-y-1.5 border-b">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="p-6 space-y-0">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-slate-100 last:border-0">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
