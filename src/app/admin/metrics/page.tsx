"use client";

import React, { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/services/api/client";
import { formatCurrency } from "@/lib/formatters";
import type { Gift } from "@/hooks/useGifts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Wallet, CreditCard, PieChart as PieChartIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Area, AreaChart, Cell } from "recharts";
import { useRouter } from "next/navigation";

const statusConfig = {
  disponivel: { label: "Disponível", color: "hsl(var(--muted-foreground))" },
  reservado: { label: "Reservado", color: "hsl(var(--primary))" },
  comprado: { label: "Comprado", color: "hsl(var(--chart-2))" },
};

const categoryConfig = {
  count: { label: "Quantidade", color: "hsl(var(--chart-1))" },
  value: { label: "Valor", color: "hsl(var(--chart-3))" },
};

const timeConfig = {
  count: { label: "Reservas", color: "hsl(var(--chart-4))" },
};

export default function MetricsDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("adminAuth")) {
      router.push("/admin/login");
    }
  }, [router]);

  const { data: gifts, isLoading } = useQuery({
    queryKey: ["admin-gifts"],
    queryFn: () => customFetch<Gift[]>("/api/gifts/admin"),
  });

  const kpis = useMemo(() => {
    if (!gifts) return { totalReservado: 0, totalComprado: 0, taxaAdocao: 0 };
    let reservedVal = 0;
    let purchasedVal = 0;
    let adoptedCount = 0;
    
    gifts.forEach(g => {
      if (g.isPurchased) {
        purchasedVal += Number(g.price);
        adoptedCount++;
      } else if (g.isReserved) {
        reservedVal += Number(g.price);
        adoptedCount++;
      }
    });

    return {
      totalReservado: reservedVal,
      totalComprado: purchasedVal,
      taxaAdocao: gifts.length > 0 ? (adoptedCount / gifts.length) * 100 : 0
    };
  }, [gifts]);

  const statusData = useMemo(() => {
    if (!gifts) return [];
    let d = 0, r = 0, c = 0;
    gifts.forEach(g => {
      if (g.isPurchased) c++;
      else if (g.isReserved) r++;
      else d++;
    });
    return [
      { status: "Disponível", count: d, fill: "var(--color-disponivel)" },
      { status: "Reservado", count: r, fill: "var(--color-reservado)" },
      { status: "Comprado", count: c, fill: "var(--color-comprado)" },
    ];
  }, [gifts]);

  const categoryData = useMemo(() => {
    if (!gifts) return [];
    const catMap = new Map<string, { count: number; value: number }>();
    gifts.forEach(g => {
      if (g.isPurchased || g.isReserved) {
        const cat = g.category || "Sem Categoria";
        const current = catMap.get(cat) || { count: 0, value: 0 };
        current.count += 1;
        current.value += Number(g.price);
        catMap.set(cat, current);
      }
    });
    return Array.from(catMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      value: stats.value,
    })).sort((a, b) => b.value - a.value);
  }, [gifts]);

  const timeData = useMemo(() => {
    if (!gifts) return [];
    const dates = new Map<string, number>();
    gifts.forEach(g => {
      if ((g.isReserved || g.isPurchased) && g.reservedAt) {
        const dateStr = new Date(g.reservedAt).toLocaleDateString('pt-BR');
        dates.set(dateStr, (dates.get(dateStr) || 0) + 1);
      }
    });
    return Array.from(dates.entries())
      .map(([date, count]) => ({ date, count }));
  }, [gifts]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando métricas...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-normal">Métricas e Dashboard</h1>
              <p className="text-muted-foreground mt-1">Acompanhe o desempenho da sua lista de presentes.</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total Reservado</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">{formatCurrency(kpis.totalReservado)}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando confirmação ou compra</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total Comprado</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif text-primary">{formatCurrency(kpis.totalComprado)}</div>
              <p className="text-xs text-muted-foreground mt-1">Presentes já garantidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Adoção</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">{kpis.taxaAdocao.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Dos presentes foram escolhidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Status Donut */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Status da Lista</CardTitle>
              <CardDescription>Proporção de presentes disponíveis, reservados e comprados.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex pb-0">
              <ChartContainer config={statusConfig} className="mx-auto aspect-square max-h-[300px] pb-4">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Time Area */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Reservas</CardTitle>
              <CardDescription>Quantidade de reservas feitas por dia.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={timeConfig} className="aspect-auto h-[250px]">
                <AreaChart data={timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="count"
                    type="monotone"
                    fill="url(#fillCount)"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Categories Count Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Presentes por Categoria</CardTitle>
              <CardDescription>Quantidade de itens escolhidos em cada área.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={categoryConfig} className="aspect-auto h-[250px]">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Categories Value Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Valor Arrecadado por Categoria</CardTitle>
              <CardDescription>Total financeiro (R$) escolhido por área.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={categoryConfig} className="aspect-auto h-[250px]">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <ChartTooltip 
                    cursor={false} 
                    content={
                      <ChartTooltipContent 
                        hideLabel 
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    } 
                  />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
