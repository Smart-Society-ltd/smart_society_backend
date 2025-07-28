import { Request, Response } from "express";
import { Society } from "../../Schema/AuthModels/societyModel.js";
import Announcement from "../../Schema/AnnonucementModel/announcemenetModel.js";

const getAnnouncement = async (req: Request, res: Response) => {
  try {
    const { user } = req.validatedUser;
    const { month, year, search } = req.query;

    const society = await Society.findOne({ society_code: user.society_code });
    if (!society) {
      return res.status(404).json({ errorMsg: "Society not found" });
    }

    const query: any = {
      society_code: user.society_code,
    };

    if (month && year) {
      const monthInt = parseInt(month as string);
      const yearInt = parseInt(year as string);

      if (!isNaN(monthInt) && !isNaN(yearInt)) {
        const startDate = new Date(yearInt, monthInt - 1, 1, 0, 0, 0); 
        const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);

        query.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      msg: announcements.length ? "Announcements fetched successfully" : "No announcements found",
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ errorMsg: "Error fetching announcements" });
  }
};

export default getAnnouncement;
