import { Request, Response } from 'express';
import { executeQuery, findOne, insertRecord, updateRecord, deleteRecord } from '../config/database';

interface Property {
  id: number;
  name: string;
  address: string;
  property_type: string;
  total_units: number;
  owner_id: number;
  image: string;
  description: string;
  year_built: number;
  city: string;
  district: string;
  created_at: string;
  updated_at: string;
}

export class PropertyController {
  // الحصول على جميع العقارات
  static async getAllProperties(req: Request, res: Response) {
    try {
      const query = `
        SELECT
          p.*,
          o.name as owner_name,
          (SELECT COUNT(*) FROM units u WHERE u.property_id = p.id) as actual_units,
          (SELECT COUNT(*) FROM units u WHERE u.property_id = p.id AND u.is_available = true) as available_units
        FROM properties p
        LEFT JOIN owners o ON p.owner_id = o.id
        ORDER BY p.created_at DESC
      `;

      const properties = await executeQuery<Property>(query);

      const formattedProperties = properties.map(property => ({
        id: property.id.toString(),
        name: property.name,
        address: property.address,
        type: property.property_type,
        totalUnits: property.total_units,
        ownerId: property.owner_id.toString(),
        image: property.image,
        description: property.description,
        yearBuilt: property.year_built,
        city: property.city,
        district: property.district,
        createdAt: property.created_at,
        updatedAt: property.updated_at
      }));

      res.json(formattedProperties);
    } catch (error) {
      console.error('خطأ في الحصول على العقارات:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على قائمة العقارات'
      });
    }
  }

  // الحصول على عقار واحد
  static async getProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = `
        SELECT
          p.*,
          o.name as owner_name,
          o.email as owner_email,
          o.phone as owner_phone
        FROM properties p
        LEFT JOIN owners o ON p.owner_id = o.id
        WHERE p.id = ?
      `;

      const property = await findOne<Property>(query, [id]);

      if (!property) {
        return res.status(404).json({
          error: 'العقار غير موجود',
          message: `لا يمكن العثور على العقار بالمعرف ${id}`
        });
      }

      const formattedProperty = {
        id: property.id.toString(),
        name: property.name,
        address: property.address,
        type: property.property_type,
        totalUnits: property.total_units,
        ownerId: property.owner_id.toString(),
        image: property.image,
        description: property.description,
        yearBuilt: property.year_built,
        city: property.city,
        district: property.district,
        createdAt: property.created_at,
        updatedAt: property.updated_at
      };

      res.json(formattedProperty);
    } catch (error) {
      console.error('خطأ في الحصول على العقار:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على بيانات العقار'
      });
    }
  }

  // إنشاء عقار جديد
  static async createProperty(req: Request, res: Response) {
    try {
      const {
        name,
        address,
        type,
        totalUnits,
        ownerId,
        image,
        description,
        yearBuilt,
        city,
        district
      } = req.body;

      // التحقق من البيانات المطلوبة
      if (!name || !address || !type || !ownerId) {
        return res.status(400).json({
          error: 'بيانات ناقصة',
          message: 'يجب توفير اسم العقار والعنوان والنوع ومعرف المالك'
        });
      }

      // التحقق من وجود المالك
      const ownerExists = await findOne('SELECT id FROM owners WHERE id = ?', [ownerId]);
      if (!ownerExists) {
        return res.status(400).json({
          error: 'المالك غير موجود',
          message: 'معرف المالك المقدم غير صحيح'
        });
      }

      const propertyData = {
        name,
        address,
        property_type: type,
        total_units: totalUnits || 0,
        owner_id: ownerId,
        image: image || '',
        description: description || '',
        year_built: yearBuilt || new Date().getFullYear(),
        city: city || '',
        district: district || '',
        created_at: new Date(),
        updated_at: new Date()
      };

      const insertId = await insertRecord('properties', propertyData);

      // إرجاع العقار المنشأ
      const newProperty = await findOne<Property>(
        'SELECT * FROM properties WHERE id = ?',
        [insertId]
      );

      const formattedProperty = {
        id: newProperty!.id.toString(),
        name: newProperty!.name,
        address: newProperty!.address,
        type: newProperty!.property_type,
        totalUnits: newProperty!.total_units,
        ownerId: newProperty!.owner_id.toString(),
        image: newProperty!.image,
        description: newProperty!.description,
        yearBuilt: newProperty!.year_built,
        city: newProperty!.city,
        district: newProperty!.district,
        createdAt: newProperty!.created_at,
        updatedAt: newProperty!.updated_at
      };

      res.status(201).json(formattedProperty);
    } catch (error) {
      console.error('خطأ في إنشاء العقار:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في إنشاء العقار الجديد'
      });
    }
  }

  // تحديث عقار
  static async updateProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // التحقق من وجود العقار
      const existingProperty = await findOne('SELECT id FROM properties WHERE id = ?', [id]);
      if (!existingProperty) {
        return res.status(404).json({
          error: 'العقار غير موجود',
          message: `لا يمكن العثور على العقار بالمعرف ${id}`
        });
      }

      // تحديث البيانات
      const dataToUpdate = {
        ...updateData,
        updated_at: new Date()
      };

      if (updateData.type) {
        dataToUpdate.property_type = updateData.type;
        delete dataToUpdate.type;
      }

      if (updateData.totalUnits) {
        dataToUpdate.total_units = updateData.totalUnits;
        delete dataToUpdate.totalUnits;
      }

      if (updateData.ownerId) {
        dataToUpdate.owner_id = updateData.ownerId;
        delete dataToUpdate.ownerId;
      }

      if (updateData.yearBuilt) {
        dataToUpdate.year_built = updateData.yearBuilt;
        delete dataToUpdate.yearBuilt;
      }

      const updated = await updateRecord('properties', parseInt(id), dataToUpdate);

      if (!updated) {
        return res.status(400).json({
          error: 'فشل في التحديث',
          message: 'لم يتم تحديث أي بيانات'
        });
      }

      // إرجاع العقار المحدث
      const updatedProperty = await findOne<Property>(
        'SELECT * FROM properties WHERE id = ?',
        [id]
      );

      const formattedProperty = {
        id: updatedProperty!.id.toString(),
        name: updatedProperty!.name,
        address: updatedProperty!.address,
        type: updatedProperty!.property_type,
        totalUnits: updatedProperty!.total_units,
        ownerId: updatedProperty!.owner_id.toString(),
        image: updatedProperty!.image,
        description: updatedProperty!.description,
        yearBuilt: updatedProperty!.year_built,
        city: updatedProperty!.city,
        district: updatedProperty!.district,
        createdAt: updatedProperty!.created_at,
        updatedAt: updatedProperty!.updated_at
      };

      res.json(formattedProperty);
    } catch (error) {
      console.error('خطأ في تحديث العقار:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في تحديث العقار'
      });
    }
  }

  // حذف عقار
  static async deleteProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // التحقق من وجود العقار
      const existingProperty = await findOne('SELECT id FROM properties WHERE id = ?', [id]);
      if (!existingProperty) {
        return res.status(404).json({
          error: 'العقار غير موجود',
          message: `لا يمكن العثور على العقار بالمعرف ${id}`
        });
      }

      // التحقق من وجود وحدات مرتبطة
      const units = await executeQuery('SELECT id FROM units WHERE property_id = ?', [id]);
      if (units.length > 0) {
        return res.status(400).json({
          error: 'لا يمكن حذف العقار',
          message: 'يحتوي العقار على وحدات مرتبطة. يجب حذف الوحدات أولاً'
        });
      }

      const deleted = await deleteRecord('properties', parseInt(id));

      if (!deleted) {
        return res.status(400).json({
          error: 'فشل في الحذف',
          message: 'لم يتم حذف العقار'
        });
      }

      res.json({
        message: 'تم حذف العقار بنجاح',
        id: id
      });
    } catch (error) {
      console.error('خطأ في حذف العقار:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في حذف العقار'
      });
    }
  }

  // البحث في العقارات
  static async searchProperties(req: Request, res: Response) {
    try {
      const { q, city, type, minUnits, maxUnits } = req.query;

      let query = `
        SELECT
          p.*,
          o.name as owner_name
        FROM properties p
        LEFT JOIN owners o ON p.owner_id = o.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (q) {
        query += ' AND (p.name LIKE ? OR p.address LIKE ? OR p.description LIKE ?)';
        const searchTerm = `%${q}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (city) {
        query += ' AND p.city = ?';
        params.push(city);
      }

      if (type) {
        query += ' AND p.property_type = ?';
        params.push(type);
      }

      if (minUnits) {
        query += ' AND p.total_units >= ?';
        params.push(parseInt(minUnits as string));
      }

      if (maxUnits) {
        query += ' AND p.total_units <= ?';
        params.push(parseInt(maxUnits as string));
      }

      query += ' ORDER BY p.created_at DESC';

      const properties = await executeQuery<Property>(query, params);

      const formattedProperties = properties.map(property => ({
        id: property.id.toString(),
        name: property.name,
        address: property.address,
        type: property.property_type,
        totalUnits: property.total_units,
        ownerId: property.owner_id.toString(),
        image: property.image,
        description: property.description,
        yearBuilt: property.year_built,
        city: property.city,
        district: property.district,
        createdAt: property.created_at,
        updatedAt: property.updated_at
      }));

      res.json(formattedProperties);
    } catch (error) {
      console.error('خطأ في البحث عن العقارات:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في البحث عن العقارات'
      });
    }
  }
}