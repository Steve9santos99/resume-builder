'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setEmailSent(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: { longMessage?: string }[] };
      setError(clerkError.errors?.[0]?.longMessage || "Não foi possível enviar o e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tela de Sucesso - E-mail Enviado
  if (emailSent) {
    return (
      <div className="relative min-h-screen bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
        {/* Gradiente de fundo verde (sucesso) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/15 blur-[120px] rounded-full" />

        <div className="relative z-10 w-full max-w-[400px] bg-white rounded-[28px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center">
          {/* Ícone de Sucesso */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm text-4xl animate-bounce-short">
            📩
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">E-mail enviado!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Enviamos um link de recuperação para <strong className="text-slate-700">{email}</strong>. 
            Verifique sua caixa de entrada e também a pasta de spam.
          </p>

          <div className="space-y-4">
            <a 
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              📧 Abrir E-mail
            </a>

            <button 
              onClick={() => setEmailSent(false)}
              className="w-full text-sm text-purple-600 font-bold hover:text-purple-700 transition-colors"
            >
              Não recebeu? Reenviar código
            </button>
          </div>

          <Link 
            href="/sign-in" 
            className="block text-sm text-slate-400 mt-6 hover:text-slate-600 transition-colors"
          >
            ← Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  // Tela de Recuperação de Senha
  return (
    <div className="relative min-h-screen bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
      {/* Mesh Gradient de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/15 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-[28px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-3xl shadow-sm">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Recuperar senha</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Enviaremos um código para o seu e-mail para redefinir sua conta.
          </p>
        </div>

        {/* Banner de Erro */}
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="input-label">E-mail de cadastro</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
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
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Instruções"
            )}
          </button>
          
          <Link 
            href="/sign-in"
            className="w-full block text-center text-sm text-slate-400 font-medium hover:text-slate-600 transition-colors"
          >
            ← Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  );
}
