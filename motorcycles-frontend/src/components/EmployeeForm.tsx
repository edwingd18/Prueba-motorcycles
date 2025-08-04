"use client";

import { useState, useEffect } from "react";
import { employeesApi } from "@/services/api";
import { Employee } from "@/types";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

export default function EmployeeForm({
  isOpen,
  onClose,
  onSuccess,
  employee,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    salary: 0,
    hireDate: new Date().toISOString().split("T")[0],
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "TERMINATED",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    notes: "",
    terminationDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        jobTitle: employee.jobTitle || "",
        salary: employee.salary || 0,
        hireDate: employee.hireDate ? employee.hireDate.split("T")[0] : new Date().toISOString().split("T")[0],
        status: (employee.status as "ACTIVE" | "INACTIVE" | "TERMINATED") || "ACTIVE",
        address: employee.address || "",
        city: employee.city || "",
        state: employee.state || "",
        zipCode: employee.zipCode || "",
        country: employee.country || "",
        notes: employee.notes || "",
        terminationDate: employee.terminationDate ? employee.terminationDate.split("T")[0] : "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        salary: 0,
        hireDate: new Date().toISOString().split("T")[0],
        status: "ACTIVE",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        notes: "",
        terminationDate: "",
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Campos requeridos
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "El nombre solo puede contener letras";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "El apellido solo puede contener letras";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "El cargo es requerido";
    } else if (formData.jobTitle.length < 2) {
      newErrors.jobTitle = "El cargo debe tener al menos 2 caracteres";
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "La fecha de contratación es requerida";
    } else {
      const hireDate = new Date(formData.hireDate);
      const today = new Date();
      if (hireDate > today) {
        newErrors.hireDate = "La fecha de contratación no puede ser en el futuro";
      }
    }

    // Validaciones opcionales
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    if (formData.salary !== null && formData.salary !== undefined && formData.salary < 0) {
      newErrors.salary = "El salario no puede ser negativo";
    }

    if (formData.salary !== null && formData.salary !== undefined && formData.salary > 10000000) {
      newErrors.salary = "El salario no puede exceder $10,000,000";
    }

    if (formData.address && formData.address.length < 5) {
      newErrors.address = "La dirección debe tener al menos 5 caracteres";
    }

    if (formData.city && formData.city.length < 2) {
      newErrors.city = "La ciudad debe tener al menos 2 caracteres";
    }

    if (formData.zipCode && !/^[\d\-\s]+$/.test(formData.zipCode)) {
      newErrors.zipCode = "Código postal inválido";
    }

    // Validar fecha de terminación si el estado es TERMINATED
    if (formData.status === "TERMINATED") {
      if (!formData.terminationDate) {
        newErrors.terminationDate = "La fecha de terminación es requerida para empleados terminados";
      } else {
        const terminationDate = new Date(formData.terminationDate);
        const hireDate = new Date(formData.hireDate);
        if (terminationDate <= hireDate) {
          newErrors.terminationDate = "La fecha de terminación debe ser posterior a la fecha de contratación";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        hireDate: new Date(formData.hireDate).toISOString(),
        terminationDate: formData.terminationDate ? new Date(formData.terminationDate).toISOString() : undefined,
        salary: formData.salary || undefined,
      };

      if (employee) {
        await employeesApi.update(employee.id, employeeData);
      } else {
        await employeesApi.create(employeeData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Editar Empleado" : "Nuevo Empleado"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors.firstName}
              placeholder="Ej: Juan"
              required
            />
            <Input
              label="Apellido *"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors.lastName}
              placeholder="Ej: Pérez"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="Ej: juan@empresa.com"
              required
            />
            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="Ej: +34 123 456 789"
            />
          </div>
        </div>

        {/* Información Laboral */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Laboral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Cargo *"
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              error={errors.jobTitle}
              placeholder="Ej: Vendedor, Gerente, Mecánico"
              required
            />
            <Input
              label="Salario"
              type="number"
              step="0.01"
              min="0"
              max="10000000"
              value={formData.salary}
              onChange={(e) => handleChange("salary", parseFloat(e.target.value) || 0)}
              error={errors.salary}
              placeholder="Ej: 50000.00"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input
              label="Fecha de Contratación *"
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleChange("hireDate", e.target.value)}
              error={errors.hireDate}
              required
            />
            
            <Select
              label="Estado *"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="TERMINATED">Terminado</option>
            </Select>

            {formData.status === "TERMINATED" && (
              <Input
                label="Fecha de Terminación *"
                type="date"
                value={formData.terminationDate}
                onChange={(e) => handleChange("terminationDate", e.target.value)}
                error={errors.terminationDate}
                required
              />
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección</h3>
          <div className="space-y-4">
            <Input
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              placeholder="Ej: Calle Principal 123, Piso 2A"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Ciudad"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                error={errors.city}
                placeholder="Ej: Madrid"
              />
              <Input
                label="Estado/Provincia"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                error={errors.state}
                placeholder="Ej: Madrid"
              />
              <Input
                label="Código Postal"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                error={errors.zipCode}
                placeholder="Ej: 28001"
              />
            </div>
            
            <Input
              label="País"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              error={errors.country}
              placeholder="Ej: España"
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notas Adicionales</h3>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
              rows={3}
              placeholder="Comentarios adicionales sobre el empleado..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {employee ? "Actualizar" : "Crear"} Empleado
          </Button>
        </div>
      </form>
    </Modal>
  );
}