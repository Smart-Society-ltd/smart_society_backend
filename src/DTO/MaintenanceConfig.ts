interface MaintenanceConfigRequest {
  society_code: string;
  maintenance_period: "monthly" | "quarterly" | "semi-annually" | "annually";
  
  // Step 1: Choose calculation method
  maintenance_basis: "fixed" | "per-occupant" | "per-square-feet" | "unit-type";
  
  // Step 2: Based on calculation method, provide rates
  fixed_maintenance_amount?: number;
  per_occupant_rate?: number;
  per_square_feet_rate?: number;
  unit_type_rates?: {
    unit_type: string;
    rate: number;
  }[];
  
  // Step 3: Optional amenities
  amenities?: {
    name: string;
    monthly_charge: number;
    is_optional: boolean;
  }[];
  
  // Step 4: Payment due configuration
  payment_due_day: number; // 1-31
  billing_cycle: "monthly" | "quarterly" | "semi-annually" | "annually";
  
  // Step 5: Late payment penalty setup
  penalty_config: {
    penalty_type: "fixed" | "percentage" | "per-day" | "tiered";
    fixed_penalty_amount?: number;
    penalty_percentage?: number;
    per_day_penalty?: number;
    tiered_penalty?: {
      days_from_due: number;
      penalty_amount: number;
      is_percentage: boolean;
    }[];
  };
  
  // Step 6: Custom rates for specific flats
  custom_flat_rates?: {
    flat_no: string;
    custom_amount: number;
    reason?: string;
  }[];
}

interface MaintenanceConfigResponse {
  success: boolean;
  message: string;
  configuration_id: string;
  configuration_summary: {
    total_users_affected: number;
    estimated_monthly_collection: number;
    breakdown_by_flat_type: {
      [key: string]: {
        count: number;
        maintenance_per_flat: number;
        total_collection: number;
      };
    };
  };
  next_steps: string[];
}

interface MaintenanceGenerationRequest {
  society_code: string;
  generation_type: "current_month" | "bulk_generate" | "future_months";
  months?: {
    year: number;
    month: number;
  }[];
  generate_future_months?: number; // Number of future months to generate
}

interface MaintenanceRecord {
  user_id: string;
  flat_id: string;
  society_code: string;
  year: number;
  month: number;
  period: string;
  
  // Maintenance breakdown
  base_maintenance: number;
  amenities_charges: {
    amenity_name: string;
    amount: number;
  }[];
  total_amenities: number;
  custom_adjustments: number;
  total_maintenance: number;
  
  // Payment tracking
  paid_amount: number;
  remaining_amount: number;
  penalty: number;
  total_due: number;
  
  // Important dates
  generated_date: Date;
  due_date: Date;
  payment_date?: Date;
  
  // Status tracking
  is_paid: boolean;
  payment_status: "unpaid" | "partial" | "paid" | "overdue" | "penalty_applied";
  days_overdue: number;
  
  // Transaction history
  transactions: {
    transaction_id: string;
    amount: number;
    payment_method: string;
    transaction_date: Date;
    status: "success" | "failed" | "pending";
  }[];
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

export { MaintenanceConfigRequest, MaintenanceConfigResponse, MaintenanceGenerationRequest, MaintenanceRecord };