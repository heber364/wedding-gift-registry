import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const currentUrl = body.currentUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const unitPrice = parseFloat(body.unit_price);
    const message = body.message || "Presente de Casamento";

    if (isNaN(unitPrice) || unitPrice < 1) {
      return NextResponse.json({ error: "O valor mínimo é de R$ 1,00." }, { status: 400 });
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Integração do Mercado Pago não configurada." }, { status: 500 });
    }

    const preferenceData: any = {
      items: [
        {
          id: "FREE-VALUE",
          title: `Presente Livre`,
          description: message,
          quantity: 1,
          currency_id: "BRL",
          unit_price: unitPrice,
        },
      ],
      back_urls: {
        success: currentUrl,
        failure: currentUrl,
        pending: currentUrl,
      },
      external_reference: `FREE-VALUE-${Date.now()}`,
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
      console.error("Erro no Mercado Pago (Free Value):", errorData);
      return NextResponse.json({ error: "Falha ao gerar link do Mercado Pago." }, { status: 500 });
    }

    const mpData = await mpRes.json();

    return NextResponse.json({ url: mpData.init_point });
  } catch (err) {
    console.error("Erro na rota de checkout (Free Value):", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
