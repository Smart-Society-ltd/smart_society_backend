// controllers/payment/getPaymentHistory.js
import Transaction from "../../Schema/MaintenanceModel/transactionModel.js";

const getPaymentHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    const transactions = await Transaction.find({ user_id })
      .sort({ paid_at: -1 }) // newest first
      .populate("maintenance_id", "period society_code") // optional

    res.status(200).json({
      message: "Payment history fetched successfully",
      count: transactions.length,
      transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export default getPaymentHistory;
