"use client";

import { useState, useEffect } from "react";
import { motorcyclesApi } from "@/services/api";
import { Motorcycle } from "@/types";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

interface MotorcycleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  motorcycle?: Motorcycle | null;
}

export default function MotorcycleForm({
  isOpen,
  onClose,
  onSuccess,
  motorcycle,
}: MotorcycleFormProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    engine_capacity: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (motorcycle) {
      setFormData({
        code: motorcycle.code || "",
        name: motorcycle.name || "",
        description: motorcycle.description || "",
        brand: motorcycle.brand || "",
        model: motorcycle.model || "",
        year: motorcycle.year?.toString() || "",
        engine_capacity: motorcycle.engine_capacity?.toString() || "",
        price: motorcycle.price?.toString() || "",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        brand: "",
        model: "",
        year: "",
        engine_capacity: "",
        price: "",
      });
    }
    setErrors({});
  }, [motorcycle, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "El código es requerido";
    }
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es requerida";
    }
    if (!formData.model.trim()) {
      newErrors.model = "El modelo es requerido";
    }
    if (!formData.year.trim()) {
      newErrors.year = "El año es requerido";
    } else {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.year = `El año debe estar entre 1900 y ${currentYear + 1}`;
      }
    }
    if (!formData.engine_capacity.trim()) {
      newErrors.engine_capacity = "La cilindrada es requerida";
    } else {
      const capacity = parseInt(formData.engine_capacity);
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.engine_capacity = "La cilindrada debe ser un número positivo";
      }
    }
    if (!formData.price.trim()) {
      newErrors.price = "El precio es requerido";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "El precio debe ser un número positivo";
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
      // Convertir strings a números donde sea necesario
      const dataToSend = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        engine_capacity: parseInt(formData.engine_capacity),
        price: parseFloat(formData.price),
      };

      if (motorcycle) {
        await motorcyclesApi.update(motorcycle.id, dataToSend);
      } else {
        await motorcyclesApi.create(dataToSend);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving motorcycle:", error);
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
      title={motorcycle ? "Editar Motocicleta" : "Nueva Motocicleta"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información Básica */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información Básica
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              error={errors.code}
              placeholder="Ej: KAW001"
              required
            />

            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              placeholder="Ej: Ninja 300"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Descripción de la motocicleta..."
            />
          </div>
        </div>

        {/* Especificaciones */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Especificaciones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Marca"
              value={formData.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              error={errors.brand}
              placeholder="Ej: Kawasaki"
              required
            />

            <Input
              label="Modelo"
              value={formData.model}
              onChange={(e) => handleChange("model", e.target.value)}
              error={errors.model}
              placeholder="Ej: Ninja"
              required
            />

            <Input
              label="Año"
              type="number"
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              error={errors.year}
              placeholder="Ej: 2024"
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />

            <Input
              label="Cilindrada (cc)"
              type="number"
              value={formData.engine_capacity}
              onChange={(e) => handleChange("engine_capacity", e.target.value)}
              error={errors.engine_capacity}
              placeholder="Ej: 300"
              min="1"
              required
            />
          </div>
        </div>

        {/* Precio */}
        <div>
          <Input
            label="Precio (€)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            error={errors.price}
            placeholder="Ej: 5999.99"
            min="0"
            required
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {motorcycle ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
