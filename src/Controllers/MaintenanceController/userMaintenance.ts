import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Maintenance from '../../Models/MaintenanceModel/userMaintenanceModel.js';

const getUserMaintenance = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: 'userId is required' });
    }

    const maintenance = await Maintenance.findOne({ user_id: userId });

    if (!maintenance) {
      return res.status(404).json({ msg: 'Maintenance record not found' });
    }

    res.status(200).json({ data: maintenance });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to retrieve maintenance data', error: error.message });
  }
};

export default getUserMaintenance;
