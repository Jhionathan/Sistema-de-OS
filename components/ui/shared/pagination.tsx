"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
}

export function Pagination({ totalItems, pageSize, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-slate-500 whitespace-nowrap">
        Mostrando <span className="font-medium text-slate-900">{(currentPage - 1) * pageSize + 1}</span> a{" "}
        <span className="font-medium text-slate-900">{Math.min(currentPage * pageSize, totalItems)}</span> de{" "}
        <span className="font-medium text-slate-900">{totalItems}</span> resultados
      </div>

      <nav className="flex items-center gap-1">
        <Link
          href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 ${
            currentPage <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="inline-flex h-9 w-9 items-center justify-center text-slate-400">
                  ...
                </span>
              ) : (
                <Link
                  href={createPageURL(page)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {page}
                </Link>
              )}
            </div>
          ))}
        </div>

        <Link
          href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 ${
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}
