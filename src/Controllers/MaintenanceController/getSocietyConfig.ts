
import {SocietyConfiguration} from "../../Schema/MaintenanceModel/maintenance.js";

const getSocietyConfig = async (req, res) => {
  const { society_code } = req.query;

  if (!society_code) {
    return res.status(400).json({ success: false, message: "society_code is required" });
  }

  try {
    const config = await SocietyConfiguration.findOne({ society_code, is_active: true });

    if (!config) {
      return res.status(404).json({ success: false, message: "Society configuration not found" });
    }

    res.status(200).json({
      success: true,
      message: "Society configuration fetched successfully",
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export default getSocietyConfig;
