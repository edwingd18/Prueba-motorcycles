export interface Motorcycle {
  id: number;
  code: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  engine_capacity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber?: string;
  documentType?: "DNI" | "CEDULA" | "PASSPORT" | "DRIVER_LICENSE";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  birthDate?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sale {
  id: number;
  saleNumber: string;
  customer: Customer;
  employee: Employee;
  saleDate: string;
  status: string;
  total: number;
  paymentMethod?:
    | "CASH"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "BANK_TRANSFER"
    | "FINANCING";
  details?: DetailSale[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  documentType?: "DNI" | "CEDULA" | "PASSPORT" | "DRIVER_LICENSE";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  jobTitle: string;
  salary?: number;
  hireDate?: string;
  terminationDate?: string;
  status?: "ACTIVE" | "INACTIVE" | "TERMINATED";
  notes?: string;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DetailSale {
  id: number;
  motorcycle: Motorcycle;
  quantity: number;
  unitPrice: number;
  discount?: number;
  subtotal: number;
  notes?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

// Para cuando la respuesta es directamente un array
export type ApiArrayResponse<T> = T[] | ApiResponse<T[]>;
