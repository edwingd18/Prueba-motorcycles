"use client";

import { useState, useEffect } from "react";
import { employeesApi } from "@/services/api";
import { Employee } from "@/types";
import Table from "@/components/Table";
import Button from "@/components/Button";
import EmployeeForm from "@/components/EmployeeForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeesApi.getAll();
      // Handle different response structures
      const employeesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.data || [];
      
      console.log("Employees data received:", employeesData);
      console.log("First employee:", employeesData[0]);
      
      setEmployees(employeesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Error al cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    
    setDeleteLoading(true);
    try {
      await employeesApi.delete(employeeToDelete.id);
      await fetchEmployees();
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Error al eliminar el empleado");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleFormSuccess = () => {
    fetchEmployees();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-yellow-100 text-yellow-800",
      TERMINATED: "bg-red-100 text-red-800",
    };
    
    const statusLabels = {
      ACTIVE: "Activo",
      INACTIVE: "Inactivo", 
      TERMINATED: "Terminado",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const columns = [
    { 
      key: "firstName", 
      header: "Nombre",
      render: (employee: Employee) => employee.firstName || "-"
    },
    { 
      key: "lastName", 
      header: "Apellido",
      render: (employee: Employee) => employee.lastName || "-"
    },
    { 
      key: "email", 
      header: "Email",
      render: (employee: Employee) => employee.email || "-"
    },
    { 
      key: "jobTitle", 
      header: "Cargo",
      render: (employee: Employee) => employee.jobTitle || "-"
    },
    { 
      key: "phone", 
      header: "Teléfono",
      render: (employee: Employee) => employee.phone || "-"
    },
    { 
      key: "status", 
      header: "Estado",
      render: (employee: Employee) => getStatusBadge(employee.status)
    },
    {
      key: "actions",
      header: "Acciones",
      render: (employee: Employee) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(employee)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(employee)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Cargando empleados...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          data={employees}
          columns={columns}
          emptyMessage="No hay empleados registrados"
        />
      </div>

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        employee={selectedEmployee}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Empleado"
        message="¿Estás seguro de que deseas eliminar este empleado?"
        itemName={employeeToDelete ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}` : ""}
        loading={deleteLoading}
        checkDependencies={employeeToDelete ? () => employeesApi.checkDependencies(employeeToDelete.id) : undefined}
      />
    </div>
  );
}