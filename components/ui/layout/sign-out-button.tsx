import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 ${className ?? ""}`}
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </form>
  );
}