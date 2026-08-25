export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'سكني' | 'تجاري' | 'مكتبي' | 'صناعي';
  totalUnits: number;
  ownerId: string;
  image: string;
  description: string;
  yearBuilt: number;
  city: string;
  district: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  type: 'شقة' | 'مكتب' | 'متجر' | 'مستودع';
  bedrooms: number;
  bathrooms: number;
  area: number;
  monthlyRent: number;
  isAvailable: boolean;
  currentTenantId?: string;
  image: string;
  description: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  address: string;
  image: string;
  properties: Property[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  currentAddress: string;
  employer: string;
  monthlyIncome: number;
  image: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'نشط' | 'منتهي' | 'معلق' | 'ملغي';
  paymentTerms: string;
  specialTerms?: string;
  signedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'مدفوع' | 'معلق' | 'متأخر';
  paymentMethod: 'نقدي' | 'تحويل بنكي' | 'شيك' | 'بطاقة ائتمان';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'عاجل' | 'متوسط' | 'منخفض';
  status: 'جديد' | 'قيد الصيانة' | 'مكتمل' | 'مؤجل';
  cost?: number;
  assignedTo?: string;
  completedDate?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingMaintenanceRequests: number;
  overduePayments: number;
}