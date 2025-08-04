"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motorcyclesApi } from "@/services/api";
import { Motorcycle } from "@/types";
import Table from "@/components/Table";
import Button from "@/components/Button";
import MotorcycleForm from "@/components/MotorcycleForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { formatCurrency } from "@/lib/utils";

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] =
    useState<Motorcycle | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState<Motorcycle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const response = await motorcyclesApi.getAll();
      console.log("API Response:", response.data); // Debug log
      // Si la respuesta es directamente un array, usarlo; si no, buscar en data
      const motorcyclesData = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || [];
      setMotorcycles(motorcyclesData);
    } catch (error) {
      console.error("Error fetching motorcycles:", error);
      setMotorcycles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (motorcycle: Motorcycle) => {
    setMotorcycleToDelete(motorcycle);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!motorcycleToDelete) return;
    
    setDeleteLoading(true);
    try {
      await motorcyclesApi.delete(motorcycleToDelete.id);
      await fetchMotorcycles();
      setDeleteModalOpen(false);
      setMotorcycleToDelete(null);
    } catch (error) {
      console.error("Error deleting motorcycle:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setMotorcycleToDelete(null);
  };

  const handleEdit = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedMotorcycle(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMotorcycle(null);
  };

  const handleFormSuccess = () => {
    fetchMotorcycles();
  };

  const columns = [
    {
      key: "id",
      header: "ID",
    },
    {
      key: "code",
      header: "Código",
    },
    {
      key: "name",
      header: "Nombre",
    },
    {
      key: "brand",
      header: "Marca",
    },
    {
      key: "description",
      header: "Descripción",
      render: (motorcycle: Motorcycle) => (
        <div className="max-w-xs truncate" title={motorcycle.description}>
          {motorcycle.description}
        </div>
      ),
    },
    {
      key: "year",
      header: "Año",
      render: (motorcycle: Motorcycle) => motorcycle.year || "-",
    },
    {
      key: "price",
      header: "Precio",
      render: (motorcycle: Motorcycle) =>
        motorcycle.price ? formatCurrency(motorcycle.price) : "-",
    },
    {
      key: "actions",
      header: "Acciones",
      render: (motorcycle: Motorcycle) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(motorcycle)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(motorcycle)}
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
          <h1 className="text-3xl font-bold text-gray-900">Motocicletas</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el inventario de motocicletas
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Motocicleta
        </Button>
      </div>

      <Table
        data={motorcycles}
        columns={columns}
        loading={loading}
        emptyMessage="No hay motocicletas registradas"
      />

      <MotorcycleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        motorcycle={selectedMotorcycle}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Motocicleta"
        message="¿Estás seguro de que deseas eliminar esta motocicleta?"
        itemName={motorcycleToDelete ? `${motorcycleToDelete.brand} ${motorcycleToDelete.model}` : ""}
        loading={deleteLoading}
        checkDependencies={motorcycleToDelete ? () => motorcyclesApi.checkDependencies(motorcycleToDelete.id) : undefined}
      />
    </div>
  );
}
