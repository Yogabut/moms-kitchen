// src/pages/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/Dashboard/DashboardSidebar";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { MenuManagement } from "@/components/Dashboard/MenuManagement";
import  {OrderManagement}  from "@/components/Dashboard/OrderManagement";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"menu" | "order">("menu");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("total_amount, status");

    if (ordersData) {
      const totalRevenue = ordersData.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      );
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(
        (o) => o.status === "pending"
      ).length;
      setStats({ totalRevenue, totalOrders, pendingOrders });
    }
  };

  if (roleLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <DashboardStats stats={stats} />
        {activeTab === "menu" ? (
          <MenuManagement toast={toast} />
        ) : (
          <OrderManagement toast={toast} fetchStats={fetchStats} />
        )}
      </main>
    </div>
  );
}
