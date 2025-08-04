"use client";

import { useState, useEffect } from "react";
import { customersApi } from "@/services/api";
import { Customer } from "@/types";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

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
    documentType: "DNI" as "DNI" | "CEDULA" | "PASSPORT" | "DRIVER_LICENSE",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
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
        documentType: (customer.documentType as "DNI" | "CEDULA" | "PASSPORT" | "DRIVER_LICENSE") || "DNI",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zipCode || "",
        country: customer.country || "",
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
      });
    }
    setErrors({});
  }, [customer, isOpen]);

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

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = "El teléfono debe tener al menos 7 dígitos";
    }

    // Validaciones opcionales pero importantes
    if (formData.documentNumber.trim() && formData.documentNumber.length < 5) {
      newErrors.documentNumber = "El número de documento debe tener al menos 5 caracteres";
    }

    if (formData.address.trim() && formData.address.length < 5) {
      newErrors.address = "La dirección debe tener al menos 5 caracteres";
    }

    if (formData.city.trim() && formData.city.length < 2) {
      newErrors.city = "La ciudad debe tener al menos 2 caracteres";
    }

    if (formData.zipCode.trim() && !/^[\d\-\s]+$/.test(formData.zipCode)) {
      newErrors.zipCode = "Código postal inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (customer) {
        await customersApi.update(customer.id, formData);
      } else {
        await customersApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
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
              placeholder="Ej: juan@ejemplo.com"
              required
            />
            <Input
              label="Teléfono *"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="Ej: +34 123 456 789"
              required
            />
          </div>
        </div>

        {/* Documento de Identidad */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documento de Identidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de Documento"
              value={formData.documentType}
              onChange={(e) => handleChange("documentType", e.target.value)}
            >
              <option value="DNI">DNI</option>
              <option value="CEDULA">Cédula</option>
              <option value="PASSPORT">Pasaporte</option>
              <option value="DRIVER_LICENSE">Licencia de Conducir</option>
            </Select>
            <Input
              label="Número de Documento"
              value={formData.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              error={errors.documentNumber}
              placeholder="Ej: 12345678A"
            />
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

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {customer ? "Actualizar" : "Crear"} Cliente
          </Button>
        </div>
      </form>
    </Modal>
  );
}
