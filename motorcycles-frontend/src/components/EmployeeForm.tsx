"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { employeesApi } from "@/services/api";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

const documentTypeOptions = [
  { value: "DNI", label: "DNI" },
  { value: "CEDULA", label: "Cédula" },
  { value: "PASSPORT", label: "Pasaporte" },
  { value: "DRIVER_LICENSE", label: "Licencia de Conducir" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "TERMINATED", label: "Terminado" },
];

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
    documentNumber: "",
    documentType: "CEDULA" as const,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    jobTitle: "",
    salary: "",
    hireDate: "",
    terminationDate: "",
    status: "ACTIVE" as const,
    notes: "",
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
        documentNumber: employee.documentNumber || "",
        documentType: employee.documentType || "CEDULA",
        address: employee.address || "",
        city: employee.city || "",
        state: employee.state || "",
        zipCode: employee.zipCode || "",
        country: employee.country || "",
        jobTitle: employee.jobTitle || "",
        salary: employee.salary?.toString() || "",
        hireDate: employee.hireDate || "",
        terminationDate: employee.terminationDate || "",
        status: employee.status || "ACTIVE",
        notes: employee.notes || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        documentNumber: "",
        documentType: "CEDULA",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        jobTitle: "",
        salary: "",
        hireDate: "",
        terminationDate: "",
        status: "ACTIVE",
        notes: "",
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Campos obligatorios
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "El nombre solo puede contener letras";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "El apellido solo puede contener letras";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "El cargo es requerido";
    } else if (formData.jobTitle.trim().length < 3) {
      newErrors.jobTitle = "El cargo debe tener al menos 3 caracteres";
    }

    // Validación de teléfono (opcional pero si se llena debe ser válido)
    if (formData.phone && formData.phone.trim()) {
      if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone.trim())) {
        newErrors.phone = "Formato de teléfono inválido";
      } else if (formData.phone.replace(/\D/g, "").length < 7) {
        newErrors.phone = "El teléfono debe tener al menos 7 dígitos";
      }
    }

    // Validación de documento
    if (formData.documentNumber && formData.documentNumber.trim()) {
      const docNumber = formData.documentNumber.trim();
      if (formData.documentType === "CEDULA") {
        if (!/^\d{6,12}$/.test(docNumber)) {
          newErrors.documentNumber =
            "La cédula debe tener entre 6 y 12 dígitos";
        }
      } else if (formData.documentType === "DNI") {
        if (!/^\d{7,9}$/.test(docNumber)) {
          newErrors.documentNumber = "El DNI debe tener entre 7 y 9 dígitos";
        }
      } else if (formData.documentType === "PASSPORT") {
        if (!/^[A-Z0-9]{6,12}$/.test(docNumber.toUpperCase())) {
          newErrors.documentNumber =
            "El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos";
        }
      } else if (formData.documentType === "DRIVER_LICENSE") {
        if (docNumber.length < 6 || docNumber.length > 15) {
          newErrors.documentNumber =
            "La licencia debe tener entre 6 y 15 caracteres";
        }
      }
    }

    // Validación de salario
    if (formData.salary && formData.salary.trim()) {
      const salary = parseFloat(formData.salary);
      if (isNaN(salary) || salary < 0) {
        newErrors.salary = "El salario debe ser un número positivo";
      } else if (salary > 999999999) {
        newErrors.salary = "El salario no puede exceder 999,999,999";
      }
    }

    // Validación de dirección
    if (
      formData.address &&
      formData.address.trim().length > 0 &&
      formData.address.trim().length < 10
    ) {
      newErrors.address = "La dirección debe tener al menos 10 caracteres";
    }

    // Validación de ciudad
    if (formData.city && formData.city.trim()) {
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.city.trim())) {
        newErrors.city = "La ciudad solo puede contener letras";
      } else if (formData.city.trim().length < 2) {
        newErrors.city = "La ciudad debe tener al menos 2 caracteres";
      }
    }

    // Validación de código postal
    if (formData.zipCode && formData.zipCode.trim()) {
      if (!/^\d{4,6}$/.test(formData.zipCode.trim())) {
        newErrors.zipCode = "El código postal debe tener entre 4 y 6 dígitos";
      }
    }

    // Validación de fechas
    if (formData.hireDate) {
      const hireDate = new Date(formData.hireDate);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 50); // No más de 50 años atrás

      if (hireDate > today) {
        newErrors.hireDate = "La fecha de contratación no puede ser futura";
      } else if (hireDate < oneYearAgo) {
        newErrors.hireDate =
          "La fecha de contratación no puede ser anterior a 50 años";
      }
    }

    if (formData.terminationDate) {
      if (!formData.hireDate) {
        newErrors.terminationDate =
          "Debe especificar una fecha de contratación primero";
      } else {
        const hireDate = new Date(formData.hireDate);
        const terminationDate = new Date(formData.terminationDate);
        const today = new Date();

        if (terminationDate < hireDate) {
          newErrors.terminationDate =
            "La fecha de terminación debe ser posterior a la fecha de contratación";
        } else if (terminationDate > today) {
          newErrors.terminationDate =
            "La fecha de terminación no puede ser futura";
        }
      }
    }

    // Validación condicional: si el estado es TERMINATED, requiere fecha de terminación
    if (formData.status === "TERMINATED" && !formData.terminationDate) {
      newErrors.terminationDate =
        "La fecha de terminación es requerida para empleados terminados";
    }

    // Validación de notas
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Las notas no pueden exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        phone: formData.phone || undefined,
        documentNumber: formData.documentNumber || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined,
        hireDate: formData.hireDate || undefined,
        terminationDate: formData.terminationDate || undefined,
        notes: formData.notes || undefined,
      };

      console.log("Employee data to send:", dataToSend);

      // Llamar a la API para crear o actualizar el empleado
      if (employee) {
        await employeesApi.update(employee.id, dataToSend);
      } else {
        await employeesApi.create(dataToSend);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información Personal */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors.firstName}
              placeholder="Ej: Juan"
              required
            />

            <Input
              label="Apellido"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors.lastName}
              placeholder="Ej: Pérez"
              required
            />

            <Input
              label="Email"
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

            <Select
              label="Tipo de Documento"
              value={formData.documentType}
              onChange={(e) => handleChange("documentType", e.target.value)}
              options={documentTypeOptions}
            />

            <Input
              label="Número de Documento"
              value={formData.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              error={errors.documentNumber}
              placeholder="Ej: 12345678"
            />
          </div>
        </div>

        {/* Información Laboral */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información Laboral
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Cargo"
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              error={errors.jobTitle}
              placeholder="Ej: Vendedor"
              required
            />

            <Input
              label="Salario (COP)"
              type="number"
              step="0.01"
              value={formData.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
              error={errors.salary}
              placeholder="Ej: 2500000"
              min="0"
            />

            <Input
              label="Fecha de Contratación"
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleChange("hireDate", e.target.value)}
              error={errors.hireDate}
            />

            <Select
              label="Estado"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={statusOptions}
            />

            {formData.status === "TERMINATED" && (
              <Input
                label="Fecha de Terminación"
                type="date"
                value={formData.terminationDate}
                onChange={(e) =>
                  handleChange("terminationDate", e.target.value)
                }
                error={errors.terminationDate}
              />
            )}
          </div>
        </div>

        {/* Información de Dirección */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información de Dirección
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              placeholder="Ej: Calle Principal 123"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Notas adicionales sobre el empleado..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {employee ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
