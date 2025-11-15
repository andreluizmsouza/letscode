-- CreateTable
CREATE TABLE "Pasta" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "quantidadeDocumentos" INTEGER NOT NULL,
    "observacoes" TEXT,
    "dataSaida" TIMESTAMP(3) NOT NULL,
    "responsavelSaida" TEXT NOT NULL,
    "dataRecebimento" TIMESTAMP(3),
    "responsavelRecebimento" TEXT,
    "dataRetorno" TIMESTAMP(3),
    "responsavelRetorno" TEXT,
    "observacoesRetorno" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ENVIADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pasta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pasta_numero_key" ON "Pasta"("numero");
