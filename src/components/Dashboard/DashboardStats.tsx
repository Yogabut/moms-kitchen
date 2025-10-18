// src/components/Dashboard/DashboardStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
        </CardContent>
      </Card>
    </div>
  );
}
