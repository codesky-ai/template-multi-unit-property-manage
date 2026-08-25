import { Request, Response } from 'express';
import { executeQuery, findOne } from '../config/database';

export class OwnerController {
  static async getAllOwners(req: Request, res: Response) {
    try {
      const owners = await executeQuery(
        'SELECT id, name, email, phone, national_id, address, image, created_at, updated_at FROM owners ORDER BY name'
      );

      const formattedOwners = owners.map((owner: any) => ({
        id: owner.id.toString(),
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        nationalId: owner.national_id,
        address: owner.address,
        image: owner.image,
        properties: [], // سيتم تحميلها لاحقاً
        createdAt: owner.created_at,
        updatedAt: owner.updated_at
      }));

      res.json(formattedOwners);
    } catch (error) {
      console.error('خطأ في الحصول على المالكين:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على قائمة المالكين'
      });
    }
  }

  static async getOwner(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const owner = await findOne(
        'SELECT * FROM owners WHERE id = ?',
        [id]
      );

      if (!owner) {
        return res.status(404).json({
          error: 'المالك غير موجود',
          message: `لا يمكن العثور على المالك بالمعرف ${id}`
        });
      }

      res.json({
        id: owner.id.toString(),
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        nationalId: owner.national_id,
        address: owner.address,
        image: owner.image,
        properties: [],
        createdAt: owner.created_at,
        updatedAt: owner.updated_at
      });
    } catch (error) {
      console.error('خطأ في الحصول على المالك:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على بيانات المالك'
      });
    }
  }
}