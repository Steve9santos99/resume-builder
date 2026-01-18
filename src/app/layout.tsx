import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Builder - Gerador de Currículos Profissionais",
  description: "Crie currículos profissionais em PDF gratuitamente. Editor em tempo real com múltiplos templates e temas.",
  keywords: ["currículo", "resume", "cv", "gerador", "pdf", "profissional"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      localization={ptBR}
      appearance={{
        variables: {
          colorPrimary: '#7c3aed',
          colorText: '#1e293b',
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#1e293b',
          borderRadius: '12px',
        },
        elements: {
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30',
          card: 'shadow-2xl shadow-slate-400/20 border border-slate-200',
          headerTitle: 'text-slate-800 font-bold',
          headerSubtitle: 'text-slate-500',
          socialButtonsBlockButton: 'border border-slate-200 hover:bg-slate-50',
          formFieldInput: 'border-slate-200 focus:border-purple-500 focus:ring-purple-500/20',
          footerActionLink: 'text-purple-600 hover:text-purple-700',
        }
      }}
    >
      <html lang="pt-BR">
        <body className={`${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
