# Resume Builder SaaS

Gerador de currículos profissionais com preview PDF em tempo real.

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **PDF**: @react-pdf/renderer
- **Banco**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma 6
- **Auth**: Clerk

## 📦 Instalação

```bash
npm install
npx prisma generate
npx prisma db push
```

## 🔧 Configuração

Crie `.env.local` com:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
DATABASE_URL="file:./prisma/dev.db"
```

## 🏃 Desenvolvimento

```bash
npm run dev
```

## 🌐 Deploy (Vercel)

1. Conecte o repositório GitHub
2. Configure variáveis de ambiente no painel
3. Build automático!

## 📋 Funcionalidades

- ✅ Editor split-screen + PDF preview
- ✅ Listas dinâmicas + reordenação
- ✅ 6 temas de cores
- ✅ Upload de foto
- ✅ Autenticação (Clerk)
- ✅ Links públicos (/u/[slug])
- ✅ SEO (sitemap + robots.txt)
