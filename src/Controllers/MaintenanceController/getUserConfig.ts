import UserMaintenance from "../../Schema/MaintenanceModel/userMaintenanceModel.js";

const getUserMaintenanceSummary = async (req, res) => {
  try {
    const { user } = req.validatedUser;
    const { period } = req.query;

    const query: { user_id: any; period?: any } = { user_id: user._id };
    if (period) query.period = period;

    const maintenanceData = await UserMaintenance.find(query).sort({ period: -1 });

    if (!maintenanceData || maintenanceData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No maintenance records found for the user"
      });
    }

    res.status(200).json({
      success: true,
      message: "User maintenance summary fetched successfully",
      data: maintenanceData
    });

  } catch (err) {
    console.error("Error fetching user maintenance summary:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

export default getUserMaintenanceSummary;