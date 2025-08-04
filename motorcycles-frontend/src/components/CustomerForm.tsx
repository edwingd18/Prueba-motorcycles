"use client";

import { useState, useEffect } from "react";
import { customersApi } from "@/services/api";
import { Customer } from "@/types";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
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
  { value: "BLOCKED", label: "Bloqueado" },
];

export default function CustomerForm({
  isOpen,
  onClose,
  onSuccess,
  customer,
}: CustomerFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentNumber: "",
    documentType: "DNI" as const,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    birthDate: "",
    status: "ACTIVE" as const,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        documentNumber: customer.documentNumber || "",
        documentType: customer.documentType || "DNI",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zipCode || "",
        country: customer.country || "",
        birthDate: customer.birthDate || "",
        status: customer.status || "ACTIVE",
        notes: customer.notes || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        documentNumber: "",
        documentType: "DNI",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        birthDate: "",
        status: "ACTIVE",
        notes: "",
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Campos obligatorios según el backend
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    // Validación de fecha de nacimiento
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = "La fecha de nacimiento no puede ser futura";
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
      // Preparar datos para enviar (remover campos vacíos opcionales)
      const dataToSend = {
        ...formData,
        documentNumber: formData.documentNumber || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined,
        birthDate: formData.birthDate || undefined,
        notes: formData.notes || undefined,
      };

      if (customer) {
        await customersApi.update(customer.id, dataToSend);
      } else {
        await customersApi.create(dataToSend);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
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
      title={customer ? "Editar Cliente" : "Nuevo Cliente"}
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
              placeholder="Ej: juan@ejemplo.com"
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="Ej: +34 123 456 789"
              required
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

            <Input
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              error={errors.birthDate}
            />

            <Select
              label="Estado"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={statusOptions}
            />
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
            placeholder="Notas adicionales sobre el cliente..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {customer ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
