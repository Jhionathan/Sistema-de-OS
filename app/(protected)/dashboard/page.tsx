

import { SignOutButton } from "@/components/ui/forms/singoutbutton";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Olá, {session?.user?.name}
      </h1>
      <p className="mt-2 text-slate-600">
        Perfil: {session?.user?.role}
      </p>
      <SignOutButton/>   
    </div>
  );
}