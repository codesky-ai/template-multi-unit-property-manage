import React, { useState, useEffect } from 'react';
import {
  Building2,
  Home,
  Users,
  FileText,
  CreditCard,
  Settings,
  PlusCircle,
  Search,
  BarChart3,
  MapPin,
  DollarSign
} from 'lucide-react';
import { apiService } from './services/apiService';
import { DashboardStats, Property, Unit, Tenant } from './types';
import { formatCurrencyArabic, formatNumberArabic, translateStatus } from './utils/rtl';

type TabType = 'dashboard' | 'properties' | 'units' | 'tenants' | 'contracts' | 'payments' | 'maintenance';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, propertiesData, unitsData, tenantsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getProperties(),
        apiService.getUnits(),
        apiService.getTenants()
      ]);

      setStats(dashboardStats);
      setProperties(propertiesData);
      setUnits(unitsData);
      setTenants(tenantsData);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: BarChart3 },
    { id: 'properties', name: 'العقارات', icon: Building2 },
    { id: 'units', name: 'الوحدات', icon: Home },
    { id: 'tenants', name: 'المستأجرين', icon: Users },
    { id: 'contracts', name: 'العقود', icon: FileText },
    { id: 'payments', name: 'المدفوعات', icon: CreditCard },
    { id: 'maintenance', name: 'الصيانة', icon: Settings }
  ];

  const DashboardView = () => (
    <div className="space-y-6 font-arabic">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">إجمالي العقارات</p>
              <p className="text-2xl font-bold text-blue-900">{formatNumberArabic(stats?.totalProperties || 0)}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">إجمالي الوحدات</p>
              <p className="text-2xl font-bold text-green-900">{formatNumberArabic(stats?.totalUnits || 0)}</p>
            </div>
            <Home className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">الوحدات المؤجرة</p>
              <p className="text-2xl font-bold text-orange-900">{formatNumberArabic(stats?.occupiedUnits || 0)}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">الإيرادات الشهرية</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrencyArabic(stats?.monthlyRevenue || 0)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* قائمة العقارات الحديثة */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900 font-arabic">العقارات الحديثة</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center space-x-4 space-x-reverse p-4 border rounded-lg hover:bg-gray-50">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 font-arabic">{property.name}</h3>
                  <p className="text-sm text-gray-600 font-arabic">{property.address}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-arabic">
                    {property.type}
                  </span>
                </div>
                <div className="text-left text-sm">
                  <p className="font-semibold text-gray-900 font-arabic">{formatNumberArabic(property.totalUnits)} وحدة</p>
                  <p className="text-gray-600 font-arabic">{property.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PropertiesView = () => (
    <div className="space-y-6 font-arabic">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-arabic">العقارات</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse hover:bg-blue-700 font-arabic">
          <PlusCircle className="h-5 w-5" />
          <span>إضافة عقار جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-2 font-arabic">{property.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 ml-2" />
                  <span className="text-sm font-arabic">{property.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-arabic">
                    {property.type}
                  </span>
                  <span className="text-sm text-gray-600 font-arabic">
                    {formatNumberArabic(property.totalUnits)} وحدة
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-arabic">{property.description}</p>
                <div className="pt-2">
                  <span className="text-xs text-gray-500 font-arabic">بُني في عام {formatNumberArabic(property.yearBuilt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UnitsView = () => (
    <div className="space-y-6 font-arabic">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-arabic">الوحدات</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse hover:bg-blue-700 font-arabic">
          <PlusCircle className="h-5 w-5" />
          <span>إضافة وحدة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          const property = properties.find(p => p.id === unit.propertyId);
          return (
            <div key={unit.id} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={unit.image}
                alt={unit.unitNumber}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-gray-900 font-arabic">وحدة {unit.unitNumber}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    unit.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  } font-arabic`}>
                    {unit.isAvailable ? 'متاح' : 'مؤجر'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 font-arabic">{property?.name}</p>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-arabic">النوع:</span>
                    <span className="font-arabic">{unit.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-arabic">غرف النوم:</span>
                    <span className="font-arabic">{formatNumberArabic(unit.bedrooms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-arabic">المساحة:</span>
                    <span className="font-arabic">{formatNumberArabic(unit.area)} م²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-arabic">الإيجار الشهري:</span>
                    <span className="font-bold text-green-600 font-arabic">{formatCurrencyArabic(unit.monthlyRent)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 font-arabic">المرافق:</h4>
                  <div className="flex flex-wrap gap-1">
                    {unit.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-arabic">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TenantsView = () => (
    <div className="space-y-6 font-arabic">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-arabic">المستأجرين</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse hover:bg-blue-700 font-arabic">
          <PlusCircle className="h-5 w-5" />
          <span>إضافة مستأجر جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-4 space-x-reverse mb-4">
                <img
                  src={tenant.image}
                  alt={tenant.name}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 font-arabic">{tenant.name}</h3>
                  <p className="text-gray-600 font-arabic">{tenant.employer}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-arabic">الهاتف:</span>
                  <span className="font-arabic">{tenant.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-arabic">البريد الإلكتروني:</span>
                  <span className="font-arabic">{tenant.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-arabic">الراتب الشهري:</span>
                  <span className="font-bold text-green-600 font-arabic">{formatCurrencyArabic(tenant.monthlyIncome)}</span>
                </div>
                <div className="pt-2">
                  <p className="text-gray-600 text-xs font-arabic">{tenant.currentAddress}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'properties':
        return <PropertiesView />;
      case 'units':
        return <UnitsView />;
      case 'tenants':
        return <TenantsView />;
      case 'contracts':
        return (
          <div className="text-center py-12 font-arabic">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة العقود</h2>
            <p className="text-gray-600">قريباً... إدارة شاملة لجميع العقود</p>
          </div>
        );
      case 'payments':
        return (
          <div className="text-center py-12 font-arabic">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة المدفوعات</h2>
            <p className="text-gray-600">قريباً... تتبع ومراقبة جميع المدفوعات</p>
          </div>
        );
      case 'maintenance':
        return (
          <div className="text-center py-12 font-arabic">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة الصيانة</h2>
            <p className="text-gray-600">قريباً... نظام إدارة طلبات الصيانة</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center font-arabic">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-arabic">
      {/* شريط التنقل العلوي */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-xl font-bold text-gray-900 font-arabic">نظام إدارة العقارات</h1>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <Search className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-arabic"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* الشريط الجانبي */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    } font-arabic`}
                  >
                    <Icon className="h-5 w-5 ml-3" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;