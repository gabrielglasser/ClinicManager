-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "Medico" DROP CONSTRAINT "Medico_especialidadeId_fkey";

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
