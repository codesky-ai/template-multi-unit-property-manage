import { Property, Unit, Owner, Tenant, Contract, Payment, MaintenanceRequest, DashboardStats } from '../types';

export const mockData = {
  // المالكين
  owners: [
    {
      id: '1',
      name: 'أحمد محمد العلي',
      email: 'ahmed.ali@example.com',
      phone: '+966501234567',
      nationalId: '1234567890',
      address: 'الرياض، حي النرجس، شارع الملك فهد',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      properties: [],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'فاطمة سعد الخالد',
      email: 'fatima.khaled@example.com',
      phone: '+966509876543',
      nationalId: '0987654321',
      address: 'جدة، حي الحمراء، شارع فلسطين',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      properties: [],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    }
  ] as Owner[],

  // العقارات
  properties: [
    {
      id: '1',
      name: 'مجمع النرجس السكني',
      address: 'الرياض، حي النرجس، شارع الملك فهد',
      type: 'سكني' as const,
      totalUnits: 20,
      ownerId: '1',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      description: 'مجمع سكني راقي يتكون من 20 وحدة سكنية مع جميع الخدمات والمرافق الحديثة',
      yearBuilt: 2020,
      city: 'الرياض',
      district: 'النرجس',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'برج الحمراء التجاري',
      address: 'جدة، حي الحمراء، شارع فلسطين',
      type: 'تجاري' as const,
      totalUnits: 15,
      ownerId: '2',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      description: 'برج تجاري حديث في قلب مدينة جدة مع إطلالة رائعة على البحر الأحمر',
      yearBuilt: 2022,
      city: 'جدة',
      district: 'الحمراء',
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '3',
      name: 'مجمع الياسمين للشقق المفروشة',
      address: 'الدمام، حي الضاحية، شارع الأمير محمد بن فهد',
      type: 'سكني' as const,
      totalUnits: 12,
      ownerId: '1',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
      description: 'شقق مفروشة بالكامل مع جميع المرافق والخدمات للإقامة القصيرة والطويلة',
      yearBuilt: 2021,
      city: 'الدمام',
      district: 'الضاحية',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    }
  ] as Property[],

  // الوحدات
  units: [
    {
      id: '1',
      propertyId: '1',
      unitNumber: 'A101',
      floor: 1,
      type: 'شقة' as const,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      monthlyRent: 4500,
      isAvailable: false,
      currentTenantId: '1',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      description: 'شقة واسعة مكونة من 3 غرف نوم مع صالة كبيرة ومطبخ مجهز',
      amenities: ['مكيف', 'مطبخ مجهز', 'موقف سيارة', 'أمن 24 ساعة'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      propertyId: '1',
      unitNumber: 'A102',
      floor: 1,
      type: 'شقة' as const,
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      monthlyRent: 3500,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      description: 'شقة مريحة مكونة من غرفتين نوم مع إطلالة جميلة على الحديقة',
      amenities: ['مكيف', 'مطبخ مجهز', 'شرفة', 'أمن 24 ساعة'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '3',
      propertyId: '2',
      unitNumber: 'B201',
      floor: 2,
      type: 'مكتب' as const,
      bedrooms: 0,
      bathrooms: 1,
      area: 80,
      monthlyRent: 6000,
      isAvailable: false,
      currentTenantId: '2',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      description: 'مكتب تجاري حديث مع إطلالة رائعة ومرافق متقدمة',
      amenities: ['مكيف مركزي', 'إنترنت فائق السرعة', 'موقف سيارات', 'أمن متقدم'],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '4',
      propertyId: '3',
      unitNumber: 'C301',
      floor: 3,
      type: 'شقة' as const,
      bedrooms: 1,
      bathrooms: 1,
      area: 60,
      monthlyRent: 2800,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
      description: 'استوديو مفروش بالكامل مثالي للأفراد أو الأزواج الجدد',
      amenities: ['مفروش بالكامل', 'مكيف', 'إنترنت مجاني', 'خدمة تنظيف'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    }
  ] as Unit[],

  // المستأجرين
  tenants: [
    {
      id: '1',
      name: 'خالد أحمد المطيري',
      email: 'khalid.mutairi@example.com',
      phone: '+966555123456',
      nationalId: '1122334455',
      currentAddress: 'الرياض، النرجس، مجمع النرجس السكني، A101',
      employer: 'شركة أرامكو السعودية',
      monthlyIncome: 15000,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      emergencyContact: {
        name: 'سارة المطيري',
        phone: '+966501234567',
        relation: 'زوجة'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'نورا عبدالله الزهراني',
      email: 'nora.zahrani@example.com',
      phone: '+966566789012',
      nationalId: '9988776655',
      currentAddress: 'جدة، الحمراء، برج الحمراء التجاري، B201',
      employer: 'مستشفى الملك فيصل التخصصي',
      monthlyIncome: 12000,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      emergencyContact: {
        name: 'محمد الزهراني',
        phone: '+966509876543',
        relation: 'أخ'
      },
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    }
  ] as Tenant[],

  // العقود
  contracts: [
    {
      id: '1',
      unitId: '1',
      tenantId: '1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 4500,
      securityDeposit: 9000,
      status: 'نشط' as const,
      paymentTerms: 'دفع شهري في اليوم الأول من كل شهر',
      specialTerms: 'منع التدخين داخل الوحدة، عدم السماح بالحيوانات الأليفة',
      signedDate: '2023-12-15',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      unitId: '3',
      tenantId: '2',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      monthlyRent: 6000,
      securityDeposit: 12000,
      status: 'نشط' as const,
      paymentTerms: 'دفع ربع سنوي مقدماً',
      signedDate: '2024-01-20',
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    }
  ] as Contract[],

  // الدفعات
  payments: [
    {
      id: '1',
      contractId: '1',
      amount: 4500,
      dueDate: '2024-04-01',
      paidDate: '2024-04-01',
      status: 'مدفوع' as const,
      paymentMethod: 'تحويل بنكي' as const,
      notes: 'دفع في الموعد المحدد',
      createdAt: '2024-04-01T10:00:00Z',
      updatedAt: '2024-04-01T10:00:00Z'
    },
    {
      id: '2',
      contractId: '1',
      amount: 4500,
      dueDate: '2024-05-01',
      status: 'معلق' as const,
      paymentMethod: 'تحويل بنكي' as const,
      createdAt: '2024-04-01T10:00:00Z',
      updatedAt: '2024-04-01T10:00:00Z'
    },
    {
      id: '3',
      contractId: '2',
      amount: 18000,
      dueDate: '2024-05-01',
      paidDate: '2024-04-30',
      status: 'مدفوع' as const,
      paymentMethod: 'شيك' as const,
      notes: 'دفع ربع سنوي للربع الثاني',
      createdAt: '2024-04-30T10:00:00Z',
      updatedAt: '2024-04-30T10:00:00Z'
    }
  ] as Payment[],

  // طلبات الصيانة
  maintenanceRequests: [
    {
      id: '1',
      unitId: '1',
      tenantId: '1',
      title: 'إصلاح تسريب في الحمام',
      description: 'يوجد تسريب في أنبوب الماء تحت المغسلة في الحمام الرئيسي',
      priority: 'عاجل' as const,
      status: 'قيد الصيانة' as const,
      cost: 350,
      assignedTo: 'شركة الصيانة الذهبية',
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
      ],
      createdAt: '2024-03-25T09:00:00Z',
      updatedAt: '2024-04-01T14:30:00Z'
    },
    {
      id: '2',
      unitId: '3',
      tenantId: '2',
      title: 'عطل في نظام التكييف',
      description: 'المكيف لا يبرد بشكل مناسب في المكتب، قد تحتاج لتنظيف أو إصلاح',
      priority: 'متوسط' as const,
      status: 'جديد' as const,
      images: [
        'https://images.unsplash.com/photo-1631545807609-c9be5bd1bb7c?w=400'
      ],
      createdAt: '2024-04-05T11:20:00Z',
      updatedAt: '2024-04-05T11:20:00Z'
    }
  ] as MaintenanceRequest[],

  // إحصائيات لوحة التحكم
  dashboardStats: {
    totalProperties: 3,
    totalUnits: 4,
    occupiedUnits: 2,
    availableUnits: 2,
    totalTenants: 2,
    monthlyRevenue: 28500,
    pendingMaintenanceRequests: 1,
    overduePayments: 0
  } as DashboardStats
};