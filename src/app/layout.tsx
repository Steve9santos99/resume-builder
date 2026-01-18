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
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={`${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
