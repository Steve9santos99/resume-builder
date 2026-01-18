-- CreateTable
CREATE TABLE "Curriculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "corPrincipal" TEXT NOT NULL DEFAULT '#2c3e50',
    "fotoUrl" TEXT,
    "conteudo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Curriculo_userId_key" ON "Curriculo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculo_slug_key" ON "Curriculo"("slug");
