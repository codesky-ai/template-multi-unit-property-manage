import { Request, Response } from 'express';
import { executeQuery, findOne, insertRecord, updateRecord, deleteRecord } from '../config/database';

interface Unit {
  id: number;
  property_id: number;
  unit_number: string;
  floor: number;
  unit_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  monthly_rent: number;
  is_available: boolean;
  current_tenant_id?: number;
  image: string;
  description: string;
  amenities: string;
  created_at: string;
  updated_at: string;
}

export class UnitController {
  // الحصول على جميع الوحدات
  static async getAllUnits(req: Request, res: Response) {
    try {
      const query = `
        SELECT
          u.*,
          p.name as property_name,
          p.address as property_address,
          t.name as tenant_name
        FROM units u
        LEFT JOIN properties p ON u.property_id = p.id
        LEFT JOIN tenants t ON u.current_tenant_id = t.id
        ORDER BY p.name, u.unit_number
      `;

      const units = await executeQuery<Unit>(query);

      const formattedUnits = units.map(unit => ({
        id: unit.id.toString(),
        propertyId: unit.property_id.toString(),
        unitNumber: unit.unit_number,
        floor: unit.floor,
        type: unit.unit_type,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area: unit.area,
        monthlyRent: unit.monthly_rent,
        isAvailable: unit.is_available,
        currentTenantId: unit.current_tenant_id?.toString(),
        image: unit.image,
        description: unit.description,
        amenities: unit.amenities ? unit.amenities.split(',') : [],
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      }));

      res.json(formattedUnits);
    } catch (error) {
      console.error('خطأ في الحصول على الوحدات:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على قائمة الوحدات'
      });
    }
  }

  // الحصول على وحدة واحدة
  static async getUnit(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = `
        SELECT
          u.*,
          p.name as property_name,
          p.address as property_address,
          t.name as tenant_name,
          t.email as tenant_email,
          t.phone as tenant_phone
        FROM units u
        LEFT JOIN properties p ON u.property_id = p.id
        LEFT JOIN tenants t ON u.current_tenant_id = t.id
        WHERE u.id = ?
      `;

      const unit = await findOne<Unit>(query, [id]);

      if (!unit) {
        return res.status(404).json({
          error: 'الوحدة غير موجودة',
          message: `لا يمكن العثور على الوحدة بالمعرف ${id}`
        });
      }

      const formattedUnit = {
        id: unit.id.toString(),
        propertyId: unit.property_id.toString(),
        unitNumber: unit.unit_number,
        floor: unit.floor,
        type: unit.unit_type,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area: unit.area,
        monthlyRent: unit.monthly_rent,
        isAvailable: unit.is_available,
        currentTenantId: unit.current_tenant_id?.toString(),
        image: unit.image,
        description: unit.description,
        amenities: unit.amenities ? unit.amenities.split(',') : [],
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      };

      res.json(formattedUnit);
    } catch (error) {
      console.error('خطأ في الحصول على الوحدة:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على بيانات الوحدة'
      });
    }
  }

  // الحصول على وحدات عقار معين
  static async getUnitsByProperty(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;

      const query = `
        SELECT
          u.*,
          t.name as tenant_name
        FROM units u
        LEFT JOIN tenants t ON u.current_tenant_id = t.id
        WHERE u.property_id = ?
        ORDER BY u.unit_number
      `;

      const units = await executeQuery<Unit>(query, [propertyId]);

      const formattedUnits = units.map(unit => ({
        id: unit.id.toString(),
        propertyId: unit.property_id.toString(),
        unitNumber: unit.unit_number,
        floor: unit.floor,
        type: unit.unit_type,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area: unit.area,
        monthlyRent: unit.monthly_rent,
        isAvailable: unit.is_available,
        currentTenantId: unit.current_tenant_id?.toString(),
        image: unit.image,
        description: unit.description,
        amenities: unit.amenities ? unit.amenities.split(',') : [],
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      }));

      res.json(formattedUnits);
    } catch (error) {
      console.error('خطأ في الحصول على وحدات العقار:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على وحدات العقار'
      });
    }
  }

  // إنشاء وحدة جديدة
  static async createUnit(req: Request, res: Response) {
    try {
      const {
        propertyId,
        unitNumber,
        floor,
        type,
        bedrooms,
        bathrooms,
        area,
        monthlyRent,
        image,
        description,
        amenities
      } = req.body;

      // التحقق من البيانات المطلوبة
      if (!propertyId || !unitNumber || !type) {
        return res.status(400).json({
          error: 'بيانات ناقصة',
          message: 'يجب توفير معرف العقار ورقم الوحدة والنوع'
        });
      }

      // التحقق من وجود العقار
      const propertyExists = await findOne('SELECT id FROM properties WHERE id = ?', [propertyId]);
      if (!propertyExists) {
        return res.status(400).json({
          error: 'العقار غير موجود',
          message: 'معرف العقار المقدم غير صحيح'
        });
      }

      // التحقق من عدم تكرار رقم الوحدة في نفس العقار
      const existingUnit = await findOne(
        'SELECT id FROM units WHERE property_id = ? AND unit_number = ?',
        [propertyId, unitNumber]
      );

      if (existingUnit) {
        return res.status(400).json({
          error: 'رقم الوحدة مكرر',
          message: 'رقم الوحدة موجود بالفعل في هذا العقار'
        });
      }

      const unitData = {
        property_id: propertyId,
        unit_number: unitNumber,
        floor: floor || 0,
        unit_type: type,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area: area || 0,
        monthly_rent: monthlyRent || 0,
        is_available: true,
        current_tenant_id: null,
        image: image || '',
        description: description || '',
        amenities: Array.isArray(amenities) ? amenities.join(',') : '',
        created_at: new Date(),
        updated_at: new Date()
      };

      const insertId = await insertRecord('units', unitData);

      // إرجاع الوحدة المنشأة
      const newUnit = await findOne<Unit>(
        'SELECT * FROM units WHERE id = ?',
        [insertId]
      );

      const formattedUnit = {
        id: newUnit!.id.toString(),
        propertyId: newUnit!.property_id.toString(),
        unitNumber: newUnit!.unit_number,
        floor: newUnit!.floor,
        type: newUnit!.unit_type,
        bedrooms: newUnit!.bedrooms,
        bathrooms: newUnit!.bathrooms,
        area: newUnit!.area,
        monthlyRent: newUnit!.monthly_rent,
        isAvailable: newUnit!.is_available,
        currentTenantId: newUnit!.current_tenant_id?.toString(),
        image: newUnit!.image,
        description: newUnit!.description,
        amenities: newUnit!.amenities ? newUnit!.amenities.split(',') : [],
        createdAt: newUnit!.created_at,
        updatedAt: newUnit!.updated_at
      };

      res.status(201).json(formattedUnit);
    } catch (error) {
      console.error('خطأ في إنشاء الوحدة:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في إنشاء الوحدة الجديدة'
      });
    }
  }

  // تحديث وحدة
  static async updateUnit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // التحقق من وجود الوحدة
      const existingUnit = await findOne('SELECT id FROM units WHERE id = ?', [id]);
      if (!existingUnit) {
        return res.status(404).json({
          error: 'الوحدة غير موجودة',
          message: `لا يمكن العثور على الوحدة بالمعرف ${id}`
        });
      }

      // تحديث البيانات
      const dataToUpdate = {
        ...updateData,
        updated_at: new Date()
      };

      // تحويل المفاتيح من camelCase إلى snake_case
      if (updateData.propertyId) {
        dataToUpdate.property_id = updateData.propertyId;
        delete dataToUpdate.propertyId;
      }

      if (updateData.unitNumber) {
        dataToUpdate.unit_number = updateData.unitNumber;
        delete dataToUpdate.unitNumber;
      }

      if (updateData.type) {
        dataToUpdate.unit_type = updateData.type;
        delete dataToUpdate.type;
      }

      if (updateData.monthlyRent) {
        dataToUpdate.monthly_rent = updateData.monthlyRent;
        delete dataToUpdate.monthlyRent;
      }

      if (updateData.isAvailable !== undefined) {
        dataToUpdate.is_available = updateData.isAvailable;
        delete dataToUpdate.isAvailable;
      }

      if (updateData.currentTenantId !== undefined) {
        dataToUpdate.current_tenant_id = updateData.currentTenantId;
        delete dataToUpdate.currentTenantId;
      }

      if (updateData.amenities) {
        dataToUpdate.amenities = Array.isArray(updateData.amenities)
          ? updateData.amenities.join(',')
          : updateData.amenities;
        delete dataToUpdate.amenities;
      }

      const updated = await updateRecord('units', parseInt(id), dataToUpdate);

      if (!updated) {
        return res.status(400).json({
          error: 'فشل في التحديث',
          message: 'لم يتم تحديث أي بيانات'
        });
      }

      // إرجاع الوحدة المحدثة
      const updatedUnit = await findOne<Unit>(
        'SELECT * FROM units WHERE id = ?',
        [id]
      );

      const formattedUnit = {
        id: updatedUnit!.id.toString(),
        propertyId: updatedUnit!.property_id.toString(),
        unitNumber: updatedUnit!.unit_number,
        floor: updatedUnit!.floor,
        type: updatedUnit!.unit_type,
        bedrooms: updatedUnit!.bedrooms,
        bathrooms: updatedUnit!.bathrooms,
        area: updatedUnit!.area,
        monthlyRent: updatedUnit!.monthly_rent,
        isAvailable: updatedUnit!.is_available,
        currentTenantId: updatedUnit!.current_tenant_id?.toString(),
        image: updatedUnit!.image,
        description: updatedUnit!.description,
        amenities: updatedUnit!.amenities ? updatedUnit!.amenities.split(',') : [],
        createdAt: updatedUnit!.created_at,
        updatedAt: updatedUnit!.updated_at
      };

      res.json(formattedUnit);
    } catch (error) {
      console.error('خطأ في تحديث الوحدة:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في تحديث الوحدة'
      });
    }
  }

  // حذف وحدة
  static async deleteUnit(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // التحقق من وجود الوحدة
      const existingUnit = await findOne('SELECT id, is_available FROM units WHERE id = ?', [id]);
      if (!existingUnit) {
        return res.status(404).json({
          error: 'الوحدة غير موجودة',
          message: `لا يمكن العثور على الوحدة بالمعرف ${id}`
        });
      }

      // التحقق من وجود عقود نشطة
      const activeContracts = await executeQuery(
        'SELECT id FROM contracts WHERE unit_id = ? AND status = "نشط"',
        [id]
      );

      if (activeContracts.length > 0) {
        return res.status(400).json({
          error: 'لا يمكن حذف الوحدة',
          message: 'توجد عقود نشطة مرتبطة بهذه الوحدة'
        });
      }

      const deleted = await deleteRecord('units', parseInt(id));

      if (!deleted) {
        return res.status(400).json({
          error: 'فشل في الحذف',
          message: 'لم يتم حذف الوحدة'
        });
      }

      res.json({
        message: 'تم حذف الوحدة بنجاح',
        id: id
      });
    } catch (error) {
      console.error('خطأ في حذف الوحدة:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في حذف الوحدة'
      });
    }
  }

  // البحث في الوحدات
  static async searchUnits(req: Request, res: Response) {
    try {
      const { q, propertyId, type, available, minRent, maxRent, minBedrooms } = req.query;

      let query = `
        SELECT
          u.*,
          p.name as property_name,
          p.address as property_address
        FROM units u
        LEFT JOIN properties p ON u.property_id = p.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (q) {
        query += ' AND (u.unit_number LIKE ? OR u.description LIKE ? OR p.name LIKE ?)';
        const searchTerm = `%${q}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (propertyId) {
        query += ' AND u.property_id = ?';
        params.push(propertyId);
      }

      if (type) {
        query += ' AND u.unit_type = ?';
        params.push(type);
      }

      if (available !== undefined) {
        query += ' AND u.is_available = ?';
        params.push(available === 'true');
      }

      if (minRent) {
        query += ' AND u.monthly_rent >= ?';
        params.push(parseInt(minRent as string));
      }

      if (maxRent) {
        query += ' AND u.monthly_rent <= ?';
        params.push(parseInt(maxRent as string));
      }

      if (minBedrooms) {
        query += ' AND u.bedrooms >= ?';
        params.push(parseInt(minBedrooms as string));
      }

      query += ' ORDER BY p.name, u.unit_number';

      const units = await executeQuery<Unit>(query, params);

      const formattedUnits = units.map(unit => ({
        id: unit.id.toString(),
        propertyId: unit.property_id.toString(),
        unitNumber: unit.unit_number,
        floor: unit.floor,
        type: unit.unit_type,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area: unit.area,
        monthlyRent: unit.monthly_rent,
        isAvailable: unit.is_available,
        currentTenantId: unit.current_tenant_id?.toString(),
        image: unit.image,
        description: unit.description,
        amenities: unit.amenities ? unit.amenities.split(',') : [],
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      }));

      res.json(formattedUnits);
    } catch (error) {
      console.error('خطأ في البحث عن الوحدات:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في البحث عن الوحدات'
      });
    }
  }
}