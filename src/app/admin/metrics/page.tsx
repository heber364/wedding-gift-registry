"use client";

import React, { useMemo } from "react";
import { useGiftsMetrics } from "@/hooks/useGiftsMetrics";
import { formatCurrency } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  PieChart as PieChartIcon,
  Gift,
  ShoppingBag,
  LayoutList,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Area,
  AreaChart,
  Cell,
} from "recharts";

// ─── Chart configs ─────────────────────────────────────────────────────────────

const statusConfig = {
  disponivel: { label: "Disponível", color: "hsl(var(--muted-foreground))" },
  reservado: { label: "Reservado", color: "hsl(var(--primary))" },
  comprado: { label: "Comprado", color: "hsl(var(--chart-2))" },
};

const categoryCountConfig = {
  itensDisponiveis: { label: "Disponíveis", color: "hsl(var(--muted-foreground))" },
  itensReservados: { label: "Reservados", color: "hsl(var(--primary))" },
  itensComprados: { label: "Comprados", color: "hsl(var(--chart-2))" },
};

const categoryValueConfig = {
  valorTotal: { label: "Valor Total", color: "hsl(var(--muted-foreground))" },
  valorAdotado: { label: "Valor Adotado", color: "hsl(var(--chart-1))" },
};

const timeConfig = {
  count: { label: "Reservas", color: "hsl(var(--chart-4))" },
};

// ─── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function KpiCard({ title, value, description, icon, highlight }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold font-serif ${highlight ? "text-primary" : ""
            }`}
        >
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MetricsDashboard() {
  const { data: metrics, isLoading } = useGiftsMetrics();

  const statusData = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        status: "Disponível",
        count: metrics.totalAvailable,
        fill: "var(--color-disponivel)",
      },
      {
        status: "Reservado",
        count: metrics.totalReserved,
        fill: "var(--color-reservado)",
      },
      {
        status: "Comprado",
        count: metrics.totalPurchased,
        fill: "var(--color-comprado)",
      },
    ];
  }, [metrics]);

  // Truncate long category names for chart axis
  const categoryData = useMemo(() => {
    if (!metrics) return [];
    return metrics.categories.map((c) => ({
      ...c,
      categoryLabel:
        c.category.length > 12 ? c.category.slice(0, 12) + "…" : c.category,
    }));
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando métricas...
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Nenhum dado disponível.
      </div>
    );
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
              <h1 className="text-3xl font-serif font-normal">
                Métricas e Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Acompanhe o desempenho da sua lista de presentes.
              </p>
            </div>
          </div>
        </div>

        {/* KPIs — row 1: visão geral da lista */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Visão Geral da Lista
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <KpiCard
              title="Total Cadastrado"
              value={String(metrics.totalRegistered)}
              description="Presentes ativos na lista"
              icon={<LayoutList className="h-4 w-4" />}
            />
            <KpiCard
              title="Disponíveis"
              value={String(metrics.totalAvailable)}
              description="Aguardando um padrinho"
              icon={<Gift className="h-4 w-4" />}
            />
            <KpiCard
              title="Valor Total da Lista"
              value={formatCurrency(metrics.totalListValue)}
              description="Soma de todos os presentes ativos"
              icon={<Wallet className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* KPIs — row 2: adoção */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Adoção e Arrecadação
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <KpiCard
              title="Valor Total Reservado"
              value={formatCurrency(metrics.reservedValue)}
              description="Aguardando confirmação ou compra"
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <KpiCard
              title="Valor Total Comprado"
              value={formatCurrency(metrics.purchasedValue)}
              description="Presentes já garantidos"
              icon={<CreditCard className="h-4 w-4" />}
              highlight
            />
            <KpiCard
              title="Taxa de Adoção"
              value={`${metrics.adoptionRate.toFixed(1)}%`}
              description="Dos presentes foram escolhidos"
              icon={<PieChartIcon className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Status Donut */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Status da Lista</CardTitle>
              <CardDescription>
                Proporção de presentes disponíveis, reservados e comprados.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex pb-0">
              <ChartContainer
                config={statusConfig}
                className="mx-auto aspect-square max-h-[300px] pb-4"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                  >
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
              <CardDescription>
                Quantidade de reservas feitas por dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={timeConfig}
                className="aspect-auto h-[250px]"
              >
                <AreaChart
                  data={metrics.reservationsByDay}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-count)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-count)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
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

          {/* Category Stacked Bar — all items */}
          <Card>
            <CardHeader>
              <CardTitle>Presentes por Categoria</CardTitle>
              <CardDescription>
                Todos os itens cadastrados, separados por status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={categoryCountConfig}
                className="aspect-auto h-[280px]"
              >
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="categoryLabel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="availableItems"
                    stackId="a"
                    fill="var(--color-itensDisponiveis)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="reservedItems"
                    stackId="a"
                    fill="var(--color-itensReservados)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="purchasedItems"
                    stackId="a"
                    fill="var(--color-itensComprados)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Category Value Grouped Bar — total vs adopted */}
          <Card>
            <CardHeader>
              <CardTitle>Valor Total vs. Adotado por Categoria</CardTitle>
              <CardDescription>
                Potencial total (R$) de cada categoria versus o já adotado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={categoryValueConfig}
                className="aspect-auto h-[280px]"
              >
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="categoryLabel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
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
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="totalValue"
                    fill="var(--color-valorTotal)"
                    radius={4}
                  />
                  <Bar
                    dataKey="adoptedValue"
                    fill="var(--color-valorAdotado)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

        </div>

        {/* Progress por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso de Adoção por Categoria</CardTitle>
            <CardDescription>
              Percentual de itens já escolhidos (reservados + comprados) em cada
              categoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {metrics.categories.map((cat) => {
                const adoptedCount = cat.reservedItems + cat.purchasedItems;
                const pct =
                  cat.totalItems > 0
                    ? Math.round((adoptedCount / cat.totalItems) * 100)
                    : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {cat.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({adoptedCount}/{cat.totalItems} itens)
                        </span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>
                        {cat.reservedItems} reservado
                        {cat.reservedItems !== 1 ? "s" : ""} ·{" "}
                        {cat.purchasedItems} comprado
                        {cat.purchasedItems !== 1 ? "s" : ""}
                      </span>
                      <span>
                        {formatCurrency(cat.adoptedValue)} /{" "}
                        {formatCurrency(cat.totalValue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
