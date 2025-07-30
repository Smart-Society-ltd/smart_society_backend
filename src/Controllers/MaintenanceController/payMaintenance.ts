import UserMaintenance from "../../Schema/MaintenanceModel/userMaintenanceModel.js";
import Transaction from "../../Schema/MaintenanceModel/transactionModel.js";

const payMaintenance = async (req, res) => {
  try {
    const { user_id, period, payment } = req.body;

    const maintenance = await UserMaintenance.findOne({
      user_id,
      period,
      is_paid: false,
    });

    if (!maintenance) {
      return res.status(404).json({ message: "Unpaid maintenance not found" });
    }

    const {
      maintenance: maintenancePaid = 0,
      penalty: penaltyPaid = 0,
      amenities: amenitiesPaid = 0,
      references = {}, // optional: { maintenance_ref, penalty_ref, amenities_ref }
    } = payment || {};

    const totalUnpaid =
      (maintenance.maintenance_paid ? 0 : maintenance.maintenance_amount) +
      (maintenance.penalty_paid ? 0 : maintenance.penalty_amount) +
      (maintenance.amenities_paid ? 0 : maintenance.amenities_charge);

    const totalPaid = maintenancePaid + penaltyPaid + amenitiesPaid;
    if (totalPaid <= 0) {
      return res.status(400).json({ message: "No amount paid" });
    }

    // Validate overpayment
    if (
      maintenancePaid > maintenance.maintenance_amount ||
      (maintenance.maintenance_paid && maintenancePaid > 0)
    ) {
      return res
        .status(400)
        .json({ message: "Overpaying maintenance or already paid" });
    }
    if (
      penaltyPaid > maintenance.penalty_amount ||
      (maintenance.penalty_paid && penaltyPaid > 0)
    ) {
      return res
        .status(400)
        .json({ message: "Overpaying penalty or already paid" });
    }
    if (
      amenitiesPaid > maintenance.amenities_charge ||
      (maintenance.amenities_paid && amenitiesPaid > 0)
    ) {
      return res
        .status(400)
        .json({ message: "Overpaying amenities or already paid" });
    }

    // Update flags & refs
    if (maintenancePaid > 0) {
      maintenance.maintenance_paid = true;
      maintenance.maintenance_payment_ref = references.maintenance_ref || "";
    }
    if (penaltyPaid > 0) {
      maintenance.penalty_paid = true;
      maintenance.penalty_payment_ref = references.penalty_ref || "";
    }
    if (amenitiesPaid > 0) {
      maintenance.amenities_paid = true;
      maintenance.amenities_payment_ref = references.amenities_ref || "";
    }

    // Final paid status
    if (
      maintenance.maintenance_paid &&
      maintenance.penalty_paid &&
      maintenance.amenities_paid
    ) {
      maintenance.is_paid = true;
      maintenance.paid_at = new Date();
      maintenance.payment_reference = references.combined || ""; // optional
    }

    await maintenance.save();

    await Transaction.create({
      user_id,
      maintenance_id: maintenance._id,
      period,
      amount: totalPaid,
      payment_breakdown: {
        maintenance: maintenancePaid,
        penalty: penaltyPaid,
        amenities: amenitiesPaid,
      },
      payment_reference: references.combined || "",
      payment_mode: req.body.payment_mode || "Online",
      paid_at: new Date(),
    });

    res.status(200).json({
      message: "Payment processed successfully",
      paid: {
        maintenance: maintenancePaid,
        penalty: penaltyPaid,
        amenities: amenitiesPaid,
        total: totalPaid,
      },
      updated_flags: {
        maintenance_paid: maintenance.maintenance_paid,
        penalty_paid: maintenance.penalty_paid,
        amenities_paid: maintenance.amenities_paid,
        is_paid: maintenance.is_paid,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export default payMaintenance;
