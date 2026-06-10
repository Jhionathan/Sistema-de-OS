import { TablePageSkeleton } from "@/components/ui/shared/skeleton";

export default function VisitsLoading() {
  return <TablePageSkeleton rows={8} hasFilters />;
}
