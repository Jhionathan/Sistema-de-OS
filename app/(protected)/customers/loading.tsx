import { TablePageSkeleton } from "@/components/ui/shared/skeleton";

export default function CustomersLoading() {
  return <TablePageSkeleton rows={8} hasFilters />;
}
