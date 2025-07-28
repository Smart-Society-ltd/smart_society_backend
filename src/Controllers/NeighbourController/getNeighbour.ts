import { Request, Response } from "express";
import { User } from "../../Schema/AuthModels/userModel.js";


const getNeighbour = async (req: Request, res: Response) => {
  try {
    const { user } = req.validatedUser;
    
    // Get query parameters
    const searchQuery = req.query.search as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build the search filter
    const searchFilter = {
      society_code: user.society_code,
    };

    // Add name search if provided
    if (searchQuery) {
      searchFilter['name'] = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search
    }
    
    // Get total count for pagination
    const totalCount = await User.countDocuments(searchFilter);
    
    // Fetch neighbours with pagination and search
    const neighbours = await User.find(searchFilter)
      .populate("flat")
      .skip(skip)
      .limit(limit);
    
    // Send response with pagination metadata
    res.json({
      neighbours,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching neighbours:", error);
    res.status(500).json({ errorMsg: "Error fetching neighbours" });
  }
};

export default getNeighbour;