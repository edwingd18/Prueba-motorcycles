import axios from "axios";
import { Motorcycle, Customer, Sale, Employee, DetailSale, ApiResponse } from "@/types";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("Backend server is not running on port 8080");
    }
    return Promise.reject(error);
  }
);

// Motorcycles API
export const motorcyclesApi = {
  getAll: () => api.get<Motorcycle[]>("/motorcycles"),
  getById: (id: number) =>
    api.get<ApiResponse<Motorcycle>>(`/motorcycles/${id}`),
  create: (data: Omit<Motorcycle, "id" | "created_at" | "updated_at">) =>
    api.post<ApiResponse<Motorcycle>>("/motorcycles", data),
  update: (
    id: number,
    data: Partial<Omit<Motorcycle, "id" | "created_at" | "updated_at">>
  ) => api.put<ApiResponse<Motorcycle>>(`/motorcycles/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/motorcycles/${id}`),
  checkDependencies: async (id: number): Promise<{canDelete: boolean, message: string, dependencies: string[]}> => {
    // Verificar si la motocicleta está en alguna venta
    try {
      const salesResponse = await api.get<Sale[]>("/sales");
      const sales = Array.isArray(salesResponse.data) ? salesResponse.data : (salesResponse.data as any)?.data || [];
      
      const usedInSales = sales.filter((sale: Sale) => 
        sale.details?.some(detail => detail.motorcycle.id === id)
      );
      
      if (usedInSales.length > 0) {
        return {
          canDelete: false,
          message: `Esta motocicleta no puede eliminarse porque está siendo utilizada en ${usedInSales.length} venta(s).`,
          dependencies: usedInSales.map((sale: Sale) => `Venta ${sale.saleNumber}`)
        };
      }
      
      return {
        canDelete: true,
        message: "La motocicleta puede eliminarse de forma segura.",
        dependencies: []
      };
    } catch (error) {
      return {
        canDelete: false,
        message: "Error al verificar dependencias.",
        dependencies: []
      };
    }
  }
};

// Customers API
export const customersApi = {
  getAll: () => api.get<Customer[]>("/customers"),
  getById: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: Omit<Customer, "id" | "created_at" | "updated_at">) =>
    api.post<ApiResponse<Customer>>("/customers", data),
  update: (
    id: number,
    data: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>
  ) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/customers/${id}`),
  checkDependencies: async (id: number): Promise<{canDelete: boolean, message: string, dependencies: string[]}> => {
    // Verificar si el cliente tiene ventas
    try {
      const salesResponse = await api.get<Sale[]>("/sales");
      const sales = Array.isArray(salesResponse.data) ? salesResponse.data : (salesResponse.data as any)?.data || [];
      
      const customerSales = sales.filter((sale: Sale) => sale.customer.id === id);
      
      if (customerSales.length > 0) {
        return {
          canDelete: false,
          message: `Este cliente no puede eliminarse porque tiene ${customerSales.length} venta(s) registrada(s).`,
          dependencies: customerSales.map((sale: Sale) => `Venta ${sale.saleNumber}`)
        };
      }
      
      return {
        canDelete: true,
        message: "El cliente puede eliminarse de forma segura.",
        dependencies: []
      };
    } catch (error) {
      return {
        canDelete: false,
        message: "Error al verificar dependencias.",
        dependencies: []
      };
    }
  }
};

// Employees API
export const employeesApi = {
  getAll: () => api.get<Employee[]>("/employees"),
  getById: (id: number) => api.get<ApiResponse<Employee>>(`/employees/${id}`),
  create: (data: Omit<Employee, "id">) =>
    api.post<ApiResponse<Employee>>("/employees", data),
  update: (
    id: number,
    data: Partial<Omit<Employee, "id">>
  ) => api.put<ApiResponse<Employee>>(`/employees/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/employees/${id}`),
  checkDependencies: async (id: number): Promise<{canDelete: boolean, message: string, dependencies: string[]}> => {
    // Verificar si el empleado tiene ventas
    try {
      const salesResponse = await api.get<Sale[]>("/sales");
      const sales = Array.isArray(salesResponse.data) ? salesResponse.data : (salesResponse.data as any)?.data || [];
      
      const employeeSales = sales.filter((sale: Sale) => sale.employee.id === id);
      
      if (employeeSales.length > 0) {
        return {
          canDelete: false,
          message: `Este empleado no puede eliminarse porque tiene ${employeeSales.length} venta(s) registrada(s).`,
          dependencies: employeeSales.map((sale: Sale) => `Venta ${sale.saleNumber}`)
        };
      }
      
      return {
        canDelete: true,
        message: "El empleado puede eliminarse de forma segura.",
        dependencies: []
      };
    } catch (error) {
      return {
        canDelete: false,
        message: "Error al verificar dependencias.",
        dependencies: []
      };
    }
  }
};

// Sales API
export const salesApi = {
  getAll: () => api.get<Sale[]>("/sales"),
  getById: (id: number) => api.get<ApiResponse<Sale>>(`/sales/${id}`),
  getByIdWithDetails: (id: number) => api.get<Sale>(`/sales/${id}/details`),
  create: (data: Omit<Sale, "id" | "createdAt" | "updatedAt">) =>
    api.post<ApiResponse<Sale>>("/sales", data),
  update: (
    id: number,
    data: Partial<Omit<Sale, "id" | "createdAt" | "updatedAt">>
  ) => api.put<ApiResponse<Sale>>(`/sales/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/sales/${id}`),
};

// Detail Sales API
export const detailSalesApi = {
  getAll: () => api.get<DetailSale[]>("/detail-sales"),
  getById: (id: number) => api.get<ApiResponse<DetailSale>>(`/detail-sales/${id}`),
  getBySaleId: (saleId: number) => api.get<DetailSale[]>(`/detail-sales/sale/${saleId}`),
  create: (data: Omit<DetailSale, "id">) =>
    api.post<ApiResponse<DetailSale>>("/detail-sales", data),
  update: (
    id: number,
    data: Partial<Omit<DetailSale, "id">>
  ) => api.put<ApiResponse<DetailSale>>(`/detail-sales/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/detail-sales/${id}`),
};
