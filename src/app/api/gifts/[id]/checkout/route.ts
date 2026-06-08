import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const currentUrl = body.currentUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const [gift] = await db.select().from(giftsTable).where(eq(giftsTable.id, parseInt(id)));

    if (!gift) {
      return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Integração do Mercado Pago não configurada." }, { status: 500 });
    }

    let absoluteImageUrl = "";
    if (gift.imageUrl) {
      const baseUrl = new URL(currentUrl).origin;
      absoluteImageUrl = gift.imageUrl.startsWith("http")
        ? gift.imageUrl
        : `${baseUrl}${gift.imageUrl.startsWith("/") ? "" : "/"}${gift.imageUrl}`;
    }

    const preferenceData: any = {
      items: [
        {
          id: gift.id.toString(),
          title: `Presente: ${gift.name}`,
          description: gift.description || `Presente de casamento: ${gift.name}`,
          picture_url: absoluteImageUrl,
          quantity: 1,
          currency_id: "BRL",
          unit_price: parseFloat(gift.price as unknown as string),
        },
      ],
      back_urls: {
        success: currentUrl,
        failure: currentUrl,
        pending: currentUrl,
      },
      external_reference: `GIFT-${gift.id}`,
    };

    if (currentUrl.startsWith("https://")) {
      preferenceData.auto_return = "approved";
    }

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpRes.ok) {
      const errorData = await mpRes.text();
      console.error("Erro no Mercado Pago:", errorData);
      return NextResponse.json({ error: "Falha ao gerar link do Mercado Pago." }, { status: 500 });
    }

    const mpData = await mpRes.json();

    return NextResponse.json({ url: mpData.init_point });
  } catch (err) {
    console.error("Erro na rota de checkout:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
