"use client";

import { useState, useEffect } from "react";
import { salesApi, customersApi, employeesApi, motorcyclesApi } from "@/services/api";
import { Sale, Customer, Employee, Motorcycle } from "@/types";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";
import { Plus, Trash2 } from "lucide-react";

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sale?: Sale | null;
}

interface SaleDetailForm {
  motorcycle: Motorcycle | null;
  quantity: number;
  discount: number;
}

export default function SaleModal({
  isOpen,
  onClose,
  onSuccess,
  sale,
}: SaleModalProps) {
  const [formData, setFormData] = useState({
    saleNumber: "",
    customer: null as Customer | null,
    employee: null as Employee | null,
    saleDate: new Date().toISOString().split("T")[0],
    status: "PENDING",
    total: 0,
    paymentMethod: "CASH" as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "FINANCING",
  });
  
  const [details, setDetails] = useState<SaleDetailForm[]>([{
    motorcycle: null,
    quantity: 1,
    discount: 0,
  }]);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (sale) {
      setFormData({
        saleNumber: sale.saleNumber,
        customer: sale.customer,
        employee: sale.employee,
        saleDate: sale.saleDate.split("T")[0],
        status: sale.status,
        total: sale.total,
        paymentMethod: sale.paymentMethod || "CASH",
      });
      
      if (sale.details && sale.details.length > 0) {
        setDetails(sale.details.map(detail => ({
          motorcycle: detail.motorcycle,
          quantity: detail.quantity,
          discount: detail.discount || 0,
        })));
      }
    } else {
      setFormData({
        saleNumber: `SALE-${Date.now()}`,
        customer: null,
        employee: null,
        saleDate: new Date().toISOString().split("T")[0],
        status: "PENDING",
        total: 0,
        paymentMethod: "CASH",
      });
      setDetails([{
        motorcycle: null,
        quantity: 1,
        discount: 0,
      }]);
    }
    setErrors({});
  }, [sale, isOpen]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [customersRes, employeesRes, motorcyclesRes] = await Promise.all([
        customersApi.getAll(),
        employeesApi.getAll(),
        motorcyclesApi.getAll(),
      ]);
      
      const customersData = Array.isArray(customersRes.data) ? customersRes.data : (customersRes.data as any)?.data || [];
      const employeesData = Array.isArray(employeesRes.data) ? employeesRes.data : (employeesRes.data as any)?.data || [];
      const motorcyclesData = Array.isArray(motorcyclesRes.data) ? motorcyclesRes.data : (motorcyclesRes.data as any)?.data || [];
      
      setCustomers(customersData);
      setEmployees(employeesData);
      setMotorcycles(motorcyclesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateTotal = () => {
    return details.reduce((total, detail) => {
      if (detail.motorcycle) {
        const subtotal = (detail.motorcycle.price * detail.quantity) - detail.discount;
        return total + subtotal;
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal();
    setFormData(prev => ({ ...prev, total }));
  }, [details]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validación número de venta
    if (!formData.saleNumber.trim()) {
      newErrors.saleNumber = "El número de venta es requerido";
    } else if (formData.saleNumber.length < 3) {
      newErrors.saleNumber = "El número de venta debe tener al menos 3 caracteres";
    }

    // Validación cliente
    if (!formData.customer) {
      newErrors.customer = "Selecciona un cliente";
    }

    // Validación empleado
    if (!formData.employee) {
      newErrors.employee = "Selecciona un empleado";
    }

    // Validación fecha
    if (!formData.saleDate) {
      newErrors.saleDate = "La fecha es requerida";
    } else {
      const saleDate = new Date(formData.saleDate);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 30); // Máximo 30 días en el futuro
      
      if (saleDate > maxDate) {
        newErrors.saleDate = "La fecha no puede ser más de 30 días en el futuro";
      }
    }

    // Validación detalles
    if (details.length === 0 || !details.some(d => d.motorcycle)) {
      newErrors.details = "Agrega al menos un detalle de venta";
    } else {
      // Validar cada detalle
      details.forEach((detail, index) => {
        if (detail.motorcycle) {
          if (detail.quantity <= 0) {
            newErrors[`detail_${index}_quantity`] = `Cantidad debe ser mayor a 0 en el detalle ${index + 1}`;
          }
          if (detail.discount < 0) {
            newErrors[`detail_${index}_discount`] = `Descuento no puede ser negativo en el detalle ${index + 1}`;
          }
          if (detail.discount >= detail.motorcycle.price * detail.quantity) {
            newErrors[`detail_${index}_discount`] = `Descuento no puede ser mayor o igual al precio total en el detalle ${index + 1}`;
          }
        }
      });
    }

    // Validación total
    if (formData.total <= 0) {
      newErrors.total = "El total debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Preparar los detalles de la venta
      const saleDetails = details
        .filter(detail => detail.motorcycle !== null)
        .map(detail => ({
          motorcycle: detail.motorcycle!,
          quantity: detail.quantity,
          unitPrice: detail.motorcycle!.price,
          discount: detail.discount,
          subtotal: (detail.motorcycle!.price * detail.quantity) - detail.discount,
        }));

      const saleData: any = {
        saleNumber: formData.saleNumber,
        customer: formData.customer!,
        employee: formData.employee!,
        saleDate: new Date(formData.saleDate).toISOString(),
        status: formData.status,
        total: formData.total,
        paymentMethod: formData.paymentMethod,
        details: saleDetails,
      };

      console.log("Enviando datos de venta:", saleData);
      console.log("Detalles de venta:", saleDetails);

      if (sale) {
        await salesApi.update(sale.id, saleData);
      } else {
        await salesApi.create(saleData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const addDetail = () => {
    setDetails([...details, {
      motorcycle: null,
      quantity: 1,
      discount: 0,
    }]);
  };

  const removeDetail = (index: number) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const updateDetail = (index: number, field: keyof SaleDetailForm, value: any) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDetails(newDetails);
  };

  if (loadingData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={sale ? "Editar Venta" : "Nueva Venta"}
        size="xl"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-gray-600 font-medium">Cargando datos...</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sale ? "Editar Venta" : "Nueva Venta"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número de Venta"
            value={formData.saleNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, saleNumber: e.target.value }))}
            error={errors.saleNumber}
            placeholder="SALE-0001"
          />
          
          <Input
            label="Fecha de Venta"
            type="date"
            value={formData.saleDate}
            onChange={(e) => setFormData(prev => ({ ...prev, saleDate: e.target.value }))}
            error={errors.saleDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Cliente"
            value={formData.customer?.id || ""}
            onChange={(e) => {
              const customer = customers.find(c => c.id === parseInt(e.target.value)) || null;
              setFormData(prev => ({ ...prev, customer }));
            }}
            error={errors.customer}
          >
            <option value="">Selecciona un cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName} - {customer.email}
              </option>
            ))}
          </Select>

          <Select
            label="Empleado"
            value={formData.employee?.id || ""}
            onChange={(e) => {
              const employee = employees.find(emp => emp.id === parseInt(e.target.value)) || null;
              setFormData(prev => ({ ...prev, employee }));
            }}
            error={errors.employee}
          >
            <option value="">Selecciona un empleado</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} {employee.position && `(${employee.position})`}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="PENDING">Pendiente</option>
            <option value="COMPLETED">Completada</option>
            <option value="CANCELLED">Cancelada</option>
          </Select>

          <Select
            label="Método de Pago"
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
          >
            <option value="CASH">Efectivo</option>
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
            <option value="DEBIT_CARD">Tarjeta de Débito</option>
            <option value="BANK_TRANSFER">Transferencia Bancaria</option>
            <option value="FINANCING">Financiamiento</option>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Detalles de la Venta</h3>
            <Button type="button" variant="secondary" size="sm" onClick={addDetail}>
              <Plus className="h-4 w-4 mr-1" />
              Agregar Detalle
            </Button>
          </div>
          
          {errors.details && <p className="text-sm text-red-600">{errors.details}</p>}

          {details.map((detail, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Detalle {index + 1}</h4>
                {details.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDetail(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Select
                    label="Motocicleta"
                    value={detail.motorcycle?.id || ""}
                    onChange={(e) => {
                      const motorcycle = motorcycles.find(m => m.id === parseInt(e.target.value)) || null;
                      updateDetail(index, "motorcycle", motorcycle);
                    }}
                  >
                    <option value="">Selecciona una motocicleta</option>
                    {motorcycles.map((motorcycle) => (
                      <option key={motorcycle.id} value={motorcycle.id}>
                        {motorcycle.brand} {motorcycle.model} ({motorcycle.year}) - ${motorcycle.price}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Input
                    label="Cantidad"
                    type="number"
                    min="1"
                    max="100"
                    value={detail.quantity}
                    onChange={(e) => updateDetail(index, "quantity", parseInt(e.target.value) || 1)}
                    placeholder="Cantidad"
                    error={errors[`detail_${index}_quantity`]}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Descuento ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    max={detail.motorcycle ? (detail.motorcycle.price * detail.quantity * 0.99).toString() : undefined}
                    value={detail.discount}
                    onChange={(e) => updateDetail(index, "discount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    error={errors[`detail_${index}_discount`]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
                  <input
                    type="text"
                    value={detail.motorcycle ? `$${detail.motorcycle.price.toFixed(2)}` : "-"}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                  <input
                    type="text"
                    value={detail.motorcycle ? `$${((detail.motorcycle.price * detail.quantity) - detail.discount).toFixed(2)}` : "-"}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Total:</span>
            <span className="text-2xl font-bold text-green-600">${formData.total.toFixed(2)}</span>
          </div>
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
            {sale ? "Actualizar" : "Crear"} Venta
          </Button>
        </div>
      </form>
    </Modal>
  );
}