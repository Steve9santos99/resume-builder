'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        // Precisa de verificação adicional (senha/código)
        console.log(result);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { longMessage?: string }[] };
      setError(clerkError.errors?.[0]?.longMessage || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
      {/* Mesh Gradient de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        
        {/* Header do Card */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4 shadow-lg shadow-purple-500/20">
            CV
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Bem-vindo de volta</h2>
          <p className="text-slate-500 mt-2">Crie currículos que abrem portas</p>
        </div>

        {/* Banner de Erro */}
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Login Social - Google */}
        <button 
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-700 mb-6 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </button>

        {/* Divisor */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-semibold">ou use seu e-mail</span>
          </div>
        </div>

        {/* Formulário Manual */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="input-label">Endereço de E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              "Continuar para o Builder"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Não tem uma conta?{" "}
          <Link href="/sign-up" className="text-purple-600 font-bold hover:underline">
            Registre-se grátis
          </Link>
        </p>

        <p className="text-center text-xs text-slate-400 mt-4">
          <Link href="/forgot-password" className="hover:text-purple-600 transition-colors">
            Esqueceu sua senha?
          </Link>
        </p>
      </div>
    </div>
  );
}
