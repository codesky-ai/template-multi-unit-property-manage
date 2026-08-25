import { Request, Response } from 'express';
import { executeQuery, findOne } from '../config/database';

export class TenantController {
  static async getAllTenants(req: Request, res: Response) {
    try {
      const tenants = await executeQuery(
        `SELECT id, name, email, phone, national_id, current_address, employer,
         monthly_income, image, emergency_contact_name, emergency_contact_phone,
         emergency_contact_relation, created_at, updated_at
         FROM tenants ORDER BY name`
      );

      const formattedTenants = tenants.map((tenant: any) => ({
        id: tenant.id.toString(),
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        nationalId: tenant.national_id,
        currentAddress: tenant.current_address,
        employer: tenant.employer,
        monthlyIncome: tenant.monthly_income,
        image: tenant.image,
        emergencyContact: {
          name: tenant.emergency_contact_name,
          phone: tenant.emergency_contact_phone,
          relation: tenant.emergency_contact_relation
        },
        createdAt: tenant.created_at,
        updatedAt: tenant.updated_at
      }));

      res.json(formattedTenants);
    } catch (error) {
      console.error('خطأ في الحصول على المستأجرين:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على قائمة المستأجرين'
      });
    }
  }

  static async getTenant(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tenant = await findOne(
        'SELECT * FROM tenants WHERE id = ?',
        [id]
      );

      if (!tenant) {
        return res.status(404).json({
          error: 'المستأجر غير موجود',
          message: `لا يمكن العثور على المستأجر بالمعرف ${id}`
        });
      }

      res.json({
        id: tenant.id.toString(),
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        nationalId: tenant.national_id,
        currentAddress: tenant.current_address,
        employer: tenant.employer,
        monthlyIncome: tenant.monthly_income,
        image: tenant.image,
        emergencyContact: {
          name: tenant.emergency_contact_name,
          phone: tenant.emergency_contact_phone,
          relation: tenant.emergency_contact_relation
        },
        createdAt: tenant.created_at,
        updatedAt: tenant.updated_at
      });
    } catch (error) {
      console.error('خطأ في الحصول على المستأجر:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على بيانات المستأجر'
      });
    }
  }
}