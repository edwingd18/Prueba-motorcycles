"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { customersApi } from "@/services/api";
import { Customer } from "@/types";
import Table from "@/components/Table";
import Button from "@/components/Button";
import CustomerForm from "@/components/CustomerForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersApi.getAll();
      console.log("Customers API Response:", response.data); // Debug log
      // Si la respuesta es directamente un array, usarlo; si no, buscar en data
      const customersData = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || [];
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    
    setDeleteLoading(true);
    try {
      await customersApi.delete(customerToDelete.id);
      await fetchCustomers();
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleFormSuccess = () => {
    fetchCustomers();
  };

  const columns = [
    {
      key: "id",
      header: "ID",
    },
    {
      key: "name",
      header: "Nombre",
      render: (customer: Customer) =>
        `${customer.firstName} ${customer.lastName}`,
    },
    {
      key: "email",
      header: "Email",
      render: (customer: Customer) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <a
            href={`mailto:${customer.email}`}
            className="text-blue-600 hover:underline"
          >
            {customer.email}
          </a>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Teléfono",
      render: (customer: Customer) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <a
            href={`tel:${customer.phone}`}
            className="text-blue-600 hover:underline"
          >
            {customer.phone}
          </a>
        </div>
      ),
    },
    {
      key: "documentNumber",
      header: "Documento",
      render: (customer: Customer) =>
        customer.documentNumber
          ? `${customer.documentType || ""} ${customer.documentNumber}`
          : "-",
    },
    {
      key: "city",
      header: "Ciudad",
      render: (customer: Customer) => customer.city || "-",
    },
    {
      key: "status",
      header: "Estado",
      render: (customer: Customer) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            customer.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : customer.status === "INACTIVE"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {customer.status || "ACTIVE"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (customer: Customer) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(customer)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(customer)}
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">
            Administra la información de los clientes
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <Table
        data={customers}
        columns={columns}
        loading={loading}
        emptyMessage="No hay clientes registrados"
      />

      <CustomerForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        customer={selectedCustomer}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente?"
        itemName={customerToDelete ? `${customerToDelete.firstName} ${customerToDelete.lastName}` : ""}
        loading={deleteLoading}
        checkDependencies={customerToDelete ? () => customersApi.checkDependencies(customerToDelete.id) : undefined}
      />
    </div>
  );
}
