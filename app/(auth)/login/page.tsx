"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("admin@sistema.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Entrar</h1>
        <p className="mt-2 text-sm text-slate-600">
          Acesse o sistema de visitas técnicas
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          <p><strong>Admin:</strong> admin@sistema.com / 123456</p>
          <p><strong>Manager:</strong> manager@sistema.com / 123456</p>
          <p><strong>Técnico:</strong> tecnico@sistema.com / 123456</p>
        </div>
      </div>
    </div>
  );
}