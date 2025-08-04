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
    year: new Date().getFullYear(),
    engine_capacity: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (motorcycle) {
      setFormData({
        code: motorcycle.code,
        name: motorcycle.name,
        description: motorcycle.description,
        brand: motorcycle.brand,
        model: motorcycle.model,
        year: motorcycle.year,
        engine_capacity: motorcycle.engine_capacity,
        price: motorcycle.price,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        engine_capacity: 0,
        price: 0,
      });
    }
    setErrors({});
  }, [motorcycle, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "El código es requerido";
    } else if (formData.code.length < 3) {
      newErrors.code = "El código debe tener al menos 3 caracteres";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (formData.description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es requerida";
    } else if (formData.brand.length < 2) {
      newErrors.brand = "La marca debe tener al menos 2 caracteres";
    }

    if (!formData.model.trim()) {
      newErrors.model = "El modelo es requerido";
    } else if (formData.model.length < 2) {
      newErrors.model = "El modelo debe tener al menos 2 caracteres";
    }

    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = `Año debe estar entre 1900 y ${new Date().getFullYear() + 1}`;
    }

    if (formData.engine_capacity <= 0) {
      newErrors.engine_capacity = "La cilindrada debe ser mayor a 0";
    } else if (formData.engine_capacity > 3000) {
      newErrors.engine_capacity = "La cilindrada no puede exceder 3000cc";
    }

    if (formData.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    } else if (formData.price > 1000000) {
      newErrors.price = "El precio no puede exceder €1,000,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (motorcycle) {
        await motorcyclesApi.update(motorcycle.id, formData);
      } else {
        await motorcyclesApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving motorcycle:", error);
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
      title={motorcycle ? "Editar Motocicleta" : "Nueva Motocicleta"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Código"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            error={errors.code}
            placeholder="Ej: KAW001, HON002"
            required
          />

          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="Ej: Ninja 300, CB190R"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
            rows={3}
            placeholder="Describe las características principales de la motocicleta..."
            required
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Marca"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            error={errors.brand}
            placeholder="Ej: Honda, Yamaha, Kawasaki"
            required
          />

          <Input
            label="Modelo"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            error={errors.model}
            placeholder="Ej: CBR600RR, YZF-R1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Año"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange("year", parseInt(e.target.value) || new Date().getFullYear())}
            error={errors.year}
            min="1900"
            max={new Date().getFullYear() + 1}
            placeholder={new Date().getFullYear().toString()}
            required
          />

          <Input
            label="Cilindrada (cc)"
            type="number"
            value={formData.engine_capacity}
            onChange={(e) =>
              handleChange("engine_capacity", parseInt(e.target.value) || 0)
            }
            error={errors.engine_capacity}
            min="1"
            max="3000"
            placeholder="Ej: 600, 1000"
            required
          />

          <Input
            label="Precio (€)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
            error={errors.price}
            min="0.01"
            max="1000000"
            placeholder="Ej: 15000.00"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 mt-8">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            className="order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            className="order-1 sm:order-2"
          >
            {motorcycle ? "Actualizar" : "Crear"} Motocicleta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
