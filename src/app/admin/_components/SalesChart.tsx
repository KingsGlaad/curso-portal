"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// O tipo de dados que este componente espera
type SalesData = { name: string; Vendas: number };
interface SalesChartProps {
  data: {
    daily: SalesData[];
    weekly: SalesData[];
    fortnightly: SalesData[];
    monthly: SalesData[];
  };
}

export function SalesChart({ data }: SalesChartProps) {
  const [filter, setFilter] = useState<
    "daily" | "weekly" | "fortnightly" | "monthly"
  >("monthly");

  const activeData = data[filter];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Visão Geral de Vendas</CardTitle>
        <ToggleGroup
          type="single"
          defaultValue="monthly"
          className="h-8"
          onValueChange={(value) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (value) setFilter(value as any);
          }}
        >
          <ToggleGroupItem value="daily" aria-label="Filtrar por dia">
            Dia
          </ToggleGroupItem>
          <ToggleGroupItem value="weekly" aria-label="Filtrar por semana">
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem
            value="fortnightly"
            aria-label="Filtrar por quinzena"
          >
            Quinzena
          </ToggleGroupItem>
          <ToggleGroupItem value="monthly" aria-label="Filtrar por mês">
            Mês
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={activeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Line
              type="monotone"
              dataKey="Vendas"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
