import { db, pool } from "../src/db/index.ts";
import { giftsTable } from "../src/db/schema/gifts.ts";
import fs from "fs";
import path from "path";

async function main() {
  const jsonPath = path.resolve(process.cwd(), "gifts.json");
  console.log(`Lendo dados de ${jsonPath}...`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Erro: O arquivo ${jsonPath} não foi encontrado.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const gifts = JSON.parse(rawData);

  console.log(`Encontrados ${gifts.length} presentes para importar.`);

  // Mapeamento dos campos do JSON para o formato do banco de dados (camelCase / snake_case mapping do drizzle)
  const formattedGifts = gifts.map((gift: any) => ({
    id: gift.id,
    name: gift.name,
    description: gift.description || null,
    imageUrl: gift.image_url || null,
    price: gift.price,
    pixChargeType: gift.pix_charge_type || "LINK",
    pixLink: gift.pix_link || null,
    pixKey: gift.pix_key || null,
    creditLink: gift.credit_link || null,
    productLink: gift.product_link || null,
    category: gift.category || null,
    isReserved: gift.is_reserved ?? false,
    reservedBy: gift.reserved_by || null,
    reservedByPhone: gift.reserved_by_phone || null,
    reservedAt: gift.reserved_at ? new Date(gift.reserved_at) : null,
    isActive: gift.is_active ?? true,
    createdAt: gift.created_at ? new Date(gift.created_at) : new Date(),
  }));

  console.log("Inserindo presentes no banco de dados...");
  
  for (const gift of formattedGifts) {
    await db
      .insert(giftsTable)
      .values(gift)
      .onConflictDoUpdate({
        target: giftsTable.id,
        set: {
          name: gift.name,
          description: gift.description,
          imageUrl: gift.imageUrl,
          price: gift.price,
          pixChargeType: gift.pixChargeType,
          pixLink: gift.pixLink,
          pixKey: gift.pixKey,
          creditLink: gift.creditLink,
          productLink: gift.productLink,
          category: gift.category,
          isReserved: gift.isReserved,
          reservedBy: gift.reservedBy,
          reservedByPhone: gift.reservedByPhone,
          reservedAt: gift.reservedAt,
          isActive: gift.isActive,
          createdAt: gift.createdAt,
        },
      });
  }

  console.log("Importação concluída com sucesso!");
  await pool.end();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("Erro durante a importação:", err);
  await pool.end();
  process.exit(1);
});
