"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Calendar, Eye } from "lucide-react";
import { salesApi } from "@/services/api";
import { Sale } from "@/types";
import Table from "@/components/Table";
import Button from "@/components/Button";
import SaleModal from "@/components/SaleModal";
import SaleDetailModal from "@/components/SaleDetailModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAll();
      console.log("Sales API Response:", response.data); // Debug log
      // Si la respuesta es directamente un array, usarlo; si no, buscar en data
      const salesData = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || [];
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSale) return;
    
    setDeleteLoading(true);
    try {
      await salesApi.delete(selectedSale.id);
      await fetchSales();
      setIsDeleteOpen(false);
      setSelectedSale(null);
    } catch (error) {
      console.error("Error deleting sale:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedSale(null);
    setIsFormOpen(true);
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedSale(null);
  };

  const handleFormSuccess = () => {
    fetchSales();
  };

  const columns = [
    {
      key: "saleNumber",
      header: "Número",
    },
    {
      key: "customer",
      header: "Cliente",
      render: (sale: Sale) => (
        <div>
          <p className="font-medium">
            {sale.customer
              ? `${sale.customer.firstName} ${sale.customer.lastName}`
              : "-"}
          </p>
        </div>
      ),
    },
    {
      key: "employee",
      header: "Empleado",
      render: (sale: Sale) => (
        <p className="font-medium">
          {sale.employee
            ? `${sale.employee.firstName} ${sale.employee.lastName}`
            : "-"}
        </p>
      ),
    },
    {
      key: "saleDate",
      header: "Fecha",
      render: (sale: Sale) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          {formatDate(sale.saleDate)}
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (sale: Sale) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(sale.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (sale: Sale) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            sale.status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : sale.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {sale.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (sale: Sale) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleView(sale)} title="Ver detalles">
            <Eye className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(sale)} title="Editar">
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(sale)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-600 mt-2">
            Registra y consulta las ventas realizadas
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      <Table
        data={sales}
        columns={columns}
        loading={loading}
        emptyMessage="No hay ventas registradas"
      />

      {/* Sale Form Modal */}
      <SaleModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        sale={selectedSale}
      />

      {/* Sale Detail Modal */}
      <SaleDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedSale(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Venta"
        message="¿Estás seguro de que quieres eliminar esta venta?"
        itemName={selectedSale ? `Venta ${selectedSale.saleNumber}` : ""}
        loading={deleteLoading}
      />
    </div>
  );
}
