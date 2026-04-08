import { getMe } from "@/server/queries/user-queries";
import { ProfileDetails } from "@/components/ui/profile/profile-details";
import { PasswordForm } from "@/components/ui/profile/password-form";
import { notFound } from "next/navigation";
import { UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const user = await getMe();

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
          <UserCircle className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            Meu Perfil
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie suas informações pessoais e credenciais de acesso.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <ProfileDetails user={user} />
        
        <div className="max-w-2xl">
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
