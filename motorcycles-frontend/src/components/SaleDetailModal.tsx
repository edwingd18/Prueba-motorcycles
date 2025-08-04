"use client";

import { useState, useEffect } from "react";
import { Sale } from "@/types";
import { salesApi } from "@/services/api";
import Modal from "./Modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, User, Briefcase, CreditCard, Package } from "lucide-react";

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export default function SaleDetailModal({
  isOpen,
  onClose,
  sale,
}: SaleDetailModalProps) {
  const [saleWithDetails, setSaleWithDetails] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sale) {
      fetchSaleDetails();
    }
  }, [isOpen, sale]);

  const fetchSaleDetails = async () => {
    if (!sale) return;
    
    setLoading(true);
    try {
      const response = await salesApi.getByIdWithDetails(sale.id);
      console.log("Sale details response:", response.data);
      setSaleWithDetails(response.data);
    } catch (error) {
      console.error("Error fetching sale details:", error);
      setSaleWithDetails(sale); // Fallback to original sale
    } finally {
      setLoading(false);
    }
  };

  if (!sale) return null;

  const currentSale = saleWithDetails || sale;

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    
    const statusLabels = {
      COMPLETED: "Completada",
      PENDING: "Pendiente",
      CANCELLED: "Cancelada",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      CASH: "Efectivo",
      CREDIT_CARD: "Tarjeta de Crédito",
      DEBIT_CARD: "Tarjeta de Débito",
      BANK_TRANSFER: "Transferencia Bancaria",
      FINANCING: "Financiamiento",
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Venta ${currentSale.saleNumber}`}
      size="lg"
    >
      <div className="space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <span className="text-gray-600 font-medium">Cargando detalles...</span>
          </div>
        )}
        
        {!loading && (
          <>
            {/* Header Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                Información General
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Venta</p>
                    <p className="font-medium">{formatDate(currentSale.saleDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <div className="mt-1">{getStatusBadge(currentSale.status)}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Método de Pago</p>
                    <p className="font-medium">{getPaymentMethodLabel(currentSale.paymentMethod || "")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-green-600 mr-2" />
                Personas Involucradas
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium">
                      {currentSale.customer ? `${currentSale.customer.firstName} ${currentSale.customer.lastName}` : "-"}
                    </p>
                    {currentSale.customer?.email && (
                      <p className="text-sm text-gray-500">{currentSale.customer.email}</p>
                    )}
                    {currentSale.customer?.phone && (
                      <p className="text-sm text-gray-500">{currentSale.customer.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Empleado</p>
                    <p className="font-medium">
                      {currentSale.employee ? `${currentSale.employee.firstName} ${currentSale.employee.lastName}` : "-"}
                    </p>
                    {currentSale.employee?.position && (
                      <p className="text-sm text-gray-500">{currentSale.employee.position}</p>
                    )}
                    {currentSale.employee?.email && (
                      <p className="text-sm text-gray-500">{currentSale.employee.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sale Details */}
        {currentSale.details && currentSale.details.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
              Detalles de la Venta
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motocicleta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descuento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSale.details.map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {detail.motorcycle.brand} {detail.motorcycle.model}
                            </p>
                            <p className="text-sm text-gray-500">
                              {detail.motorcycle.year} - {detail.motorcycle.code}
                            </p>
                            {detail.notes && (
                              <p className="text-xs text-gray-400 mt-1">{detail.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detail.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(detail.unitPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detail.discount ? formatCurrency(detail.discount) : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(detail.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-sm text-gray-600 font-medium">
                {currentSale.details?.length || 0} item(s) en esta venta
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total de la Venta</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {formatCurrency(currentSale.total)}
              </p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </Modal>
  );
}