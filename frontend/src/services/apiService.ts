import { apiClient } from '../api/client';
import { mockData } from '../api/mockData';
import { Property, Unit, Owner, Tenant, Contract, Payment, MaintenanceRequest, DashboardStats } from '../types';

// تحديد ما إذا كان سيتم استخدام البيانات التجريبية أم لا
const USE_MOCK_DATA = false;

class ApiService {
  private async callApi<T>(endpoint: string, fallbackData: T): Promise<T> {
    if (USE_MOCK_DATA) {
      console.log(`استخدام البيانات التجريبية لـ ${endpoint}`);
      await new Promise(resolve => setTimeout(resolve, 300)); // محاكاة زمن الاستجابة
      return fallbackData;
    }

    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.warn(`فشل الاتصال بـ ${endpoint}، استخدام البيانات التجريبية:`, error);
      return fallbackData;
    }
  }

  // إحصائيات لوحة التحكم
  async getDashboardStats(): Promise<DashboardStats> {
    return this.callApi('/dashboard/stats', mockData.dashboardStats);
  }

  // العقارات
  async getProperties(): Promise<Property[]> {
    return this.callApi('/properties', mockData.properties);
  }

  async getProperty(id: string): Promise<Property | null> {
    const properties = await this.getProperties();
    return properties.find(p => p.id === id) || null;
  }

  async createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    if (USE_MOCK_DATA) {
      const newProperty: Property = {
        ...property,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockData.properties.push(newProperty);
      return newProperty;
    }

    try {
      const response = await apiClient.post('/properties', property);
      return response.data;
    } catch (error) {
      console.error('فشل في إنشاء العقار:', error);
      throw error;
    }
  }

  // الوحدات
  async getUnits(): Promise<Unit[]> {
    return this.callApi('/units', mockData.units);
  }

  async getUnitsByProperty(propertyId: string): Promise<Unit[]> {
    const units = await this.getUnits();
    return units.filter(u => u.propertyId === propertyId);
  }

  async getUnit(id: string): Promise<Unit | null> {
    const units = await this.getUnits();
    return units.find(u => u.id === id) || null;
  }

  async createUnit(unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
    if (USE_MOCK_DATA) {
      const newUnit: Unit = {
        ...unit,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockData.units.push(newUnit);
      return newUnit;
    }

    try {
      const response = await apiClient.post('/units', unit);
      return response.data;
    } catch (error) {
      console.error('فشل في إنشاء الوحدة:', error);
      throw error;
    }
  }

  // المالكين
  async getOwners(): Promise<Owner[]> {
    return this.callApi('/owners', mockData.owners);
  }

  async getOwner(id: string): Promise<Owner | null> {
    const owners = await this.getOwners();
    return owners.find(o => o.id === id) || null;
  }

  // المستأجرين
  async getTenants(): Promise<Tenant[]> {
    return this.callApi('/tenants', mockData.tenants);
  }

  async getTenant(id: string): Promise<Tenant | null> {
    const tenants = await this.getTenants();
    return tenants.find(t => t.id === id) || null;
  }

  async createTenant(tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    if (USE_MOCK_DATA) {
      const newTenant: Tenant = {
        ...tenant,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockData.tenants.push(newTenant);
      return newTenant;
    }

    try {
      const response = await apiClient.post('/tenants', tenant);
      return response.data;
    } catch (error) {
      console.error('فشل في إنشاء المستأجر:', error);
      throw error;
    }
  }

  // العقود
  async getContracts(): Promise<Contract[]> {
    return this.callApi('/contracts', mockData.contracts);
  }

  async getContract(id: string): Promise<Contract | null> {
    const contracts = await this.getContracts();
    return contracts.find(c => c.id === id) || null;
  }

  async createContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    if (USE_MOCK_DATA) {
      const newContract: Contract = {
        ...contract,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockData.contracts.push(newContract);
      return newContract;
    }

    try {
      const response = await apiClient.post('/contracts', contract);
      return response.data;
    } catch (error) {
      console.error('فشل في إنشاء العقد:', error);
      throw error;
    }
  }

  // الدفعات
  async getPayments(): Promise<Payment[]> {
    return this.callApi('/payments', mockData.payments);
  }

  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    const payments = await this.getPayments();
    return payments.filter(p => p.contractId === contractId);
  }

  // طلبات الصيانة
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return this.callApi('/maintenance-requests', mockData.maintenanceRequests);
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | null> {
    const requests = await this.getMaintenanceRequests();
    return requests.find(r => r.id === id) || null;
  }

  async createMaintenanceRequest(request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRequest> {
    if (USE_MOCK_DATA) {
      const newRequest: MaintenanceRequest = {
        ...request,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockData.maintenanceRequests.push(newRequest);
      return newRequest;
    }

    try {
      const response = await apiClient.post('/maintenance-requests', request);
      return response.data;
    } catch (error) {
      console.error('فشل في إنشاء طلب الصيانة:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();