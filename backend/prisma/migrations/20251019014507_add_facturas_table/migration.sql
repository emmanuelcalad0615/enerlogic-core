/*
  Warnings:

  - You are about to drop the column `numero` on the `Factura` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referentePago]` on the table `Factura` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referentePago` to the `Factura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "numero",
ADD COLUMN     "contrato" TEXT NOT NULL DEFAULT 'TEMP',
ADD COLUMN     "referentePago" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Factura_referentePago_key" ON "Factura"("referentePago");
