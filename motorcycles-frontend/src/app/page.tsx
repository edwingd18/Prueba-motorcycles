"use client";

import { useEffect, useState } from "react";
import { Bike, Users, ShoppingCart, TrendingUp, UserCheck } from "lucide-react";
import { motorcyclesApi, customersApi, salesApi, employeesApi } from "@/services/api";

interface DashboardStats {
  totalMotorcycles: number;
  totalCustomers: number;
  totalEmployees: number;
  totalSales: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMotorcycles: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [motorcyclesRes, customersRes, employeesRes, salesRes] = await Promise.all([
          motorcyclesApi.getAll(),
          customersApi.getAll(),
          employeesApi.getAll(),
          salesApi.getAll(),
        ]);

        const motorcycles = Array.isArray(motorcyclesRes.data)
          ? motorcyclesRes.data
          : (motorcyclesRes.data as any)?.data || [];
        const customers = Array.isArray(customersRes.data)
          ? customersRes.data
          : (customersRes.data as any)?.data || [];
        const employees = Array.isArray(employeesRes.data)
          ? employeesRes.data
          : (employeesRes.data as any)?.data || [];
        const sales = Array.isArray(salesRes.data)
          ? salesRes.data
          : (salesRes.data as any)?.data || [];

        const totalRevenue = sales.reduce(
          (sum: number, sale: any) => sum + (sale.total || 0),
          0
        );

        setStats({
          totalMotorcycles: motorcycles.length,
          totalCustomers: customers.length,
          totalEmployees: employees.length,
          totalSales: sales.length,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          totalMotorcycles: 0,
          totalCustomers: 0,
          totalEmployees: 0,
          totalSales: 0,
          totalRevenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Motocicletas",
      value: stats.totalMotorcycles,
      icon: Bike,
      color: "bg-blue-500",
    },
    {
      title: "Total Clientes",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Total Empleados",
      value: stats.totalEmployees,
      icon: UserCheck,
      color: "bg-indigo-500",
    },
    {
      title: "Total Ventas",
      value: stats.totalSales,
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      title: "Ingresos Totales",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Resumen general del sistema de motocicletas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Bienvenido al Sistema de Gestión
        </h2>
        <p className="text-gray-600">
          Utiliza el menú lateral para navegar entre las diferentes secciones:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>
            • <strong>Motocicletas:</strong> Gestiona el inventario de
            motocicletas
          </li>
          <li>
            • <strong>Clientes:</strong> Administra la información de los
            clientes
          </li>
          <li>
            • <strong>Ventas:</strong> Registra y consulta las ventas realizadas
          </li>
        </ul>
      </div>
    </div>
  );
}
