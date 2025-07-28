import { Request, Response } from "express";
import societyMaintenance from "../../Schema/MaintenanceModel/societyMaintenance.js";
import { Society } from "../../Schema/AuthModels/societyModel.js";
import { User } from "../../Schema/AuthModels/userModel.js";
import mongoose from "mongoose";
import { SocietyConfiguration } from "../../Schema/MaintenanceModel/maintenance.js";
import {
  MaintenanceConfigRequest,
  MaintenanceConfigResponse,
  MaintenanceGenerationRequest,
  MaintenanceRecord
} from "../../DTO/MaintenanceConfig.js";
// import { Maintenance } from "../../Schema/MaintenanceModel/maintenance.js";

// async function calculateMaintenanceForUser(
//   user: any, 
//   flat: any, 
//   config: any
// ): Promise<{
//   base_maintenance: number;
//   amenities_charges: { amenity_name: string; amount: number }[];
//   total_amenities: number;
//   custom_adjustments: number;
//   total_maintenance: number;
// }> {
  
//   let baseMaintenance = 0;
  
//   // Calculate base maintenance based on chosen method
//   switch (config.maintenance_basis) {
//     case "fixed":
//       baseMaintenance = config.fixed_maintenance_amount || 0;
//       break;
      
//     case "per-occupant":
//       baseMaintenance = (config.per_occupant_rate || 0) * (user.family_members || 1);
//       break;
      
//     case "per-square-feet":
//       const squareFeet = flat.square_feet || user.square_feet || 0;
//       baseMaintenance = (config.per_square_feet_rate || 0) * squareFeet;
//       break;
      
//     case "unit-type":
//       const unitRate = config.unit_type_rates?.find(
//         (rate: any) => rate.unit_type === flat.flat_type
//       );
//       baseMaintenance = unitRate?.rate || 0;
//       break;
//   }
  
//   // Check for custom rates for specific flats
//   const customRate = config.custom_flat_rates?.find(
//     (rate: any) => rate.flat_no === flat.flat_no
//   );
//   if (customRate) {
//     baseMaintenance = customRate.custom_amount;
//   }
  
//   // Calculate amenities charges
//   const amenitiesCharges = await calculateAmenitiesCharges(user, config);
//   const totalAmenities = amenitiesCharges.reduce((sum, charge) => sum + charge.amount, 0);
  
//   // Custom adjustments (if any)
//   const customAdjustments = 0; // Can be implemented for discounts/additional charges
  
//   const totalMaintenance = baseMaintenance + totalAmenities + customAdjustments;
  
//   return {
//     base_maintenance: baseMaintenance,
//     amenities_charges: amenitiesCharges,
//     total_amenities: totalAmenities,
//     custom_adjustments: customAdjustments,
//     total_maintenance: totalMaintenance
//   };
// }

// async function calculateAmenitiesCharges(
//   user: any,
//   config: any
// ): Promise<{ amenity_name: string; amount: number }[]> {
//   const amenitiesCharges: { amenity_name: string; amount: number }[] = [];
  
//   if (config.amenities && config.amenities.length > 0) {
//     for (const amenity of config.amenities) {
//       if (amenity.is_optional) {
//         // Check if user has opted for this amenity
//         const hasOptedIn = await checkUserAmenitySelection(user._id, amenity.name);
//         if (hasOptedIn) {
//           amenitiesCharges.push({
//             amenity_name: amenity.name,
//             amount: amenity.monthly_charge
//           });
//         }
//       } else {
//         // Mandatory amenity for all users
//         amenitiesCharges.push({
//           amenity_name: amenity.name,
//           amount: amenity.monthly_charge
//         });
//       }
//     }
//   }
  
//   return amenitiesCharges;
// }

// async function checkUserAmenitySelection(userId: string, amenityName: string): Promise<boolean> {
//   // Implementation to check if user has selected optional amenity
//   // You can implement this based on your UserAmenitySelections collection
//   return false; // Placeholder - assume user hasn't opted in for now
// }

// function calculateDueDate(year: number, month: number, dueDayOfMonth: number): Date {
//   // Handle edge cases for due day
//   const lastDayOfMonth = new Date(year, month, 0).getDate();
//   const adjustedDueDay = Math.min(dueDayOfMonth, lastDayOfMonth);
  
//   return new Date(year, month - 1, adjustedDueDay);
// }

// function calculatePenalty(
//   maintenanceAmount: number, 
//   daysOverdue: number, 
//   penaltyConfig: any
// ): number {
//   if (daysOverdue <= 0) return 0;
  
//   let penalty = 0;
  
//   switch (penaltyConfig.penalty_type) {
//     case "fixed":
//       penalty = penaltyConfig.fixed_penalty_amount || 0;
//       break;
      
//     case "percentage":
//       penalty = (maintenanceAmount * (penaltyConfig.penalty_percentage || 0)) / 100;
//       break;
      
//     case "per-day":
//       penalty = daysOverdue * (penaltyConfig.per_day_penalty || 0);
//       break;
      
//     case "tiered":
//       if (penaltyConfig.tiered_penalty) {
//         for (const tier of penaltyConfig.tiered_penalty) {
//           if (daysOverdue >= tier.days_from_due) {
//             if (tier.is_percentage) {
//               penalty = (maintenanceAmount * tier.penalty_amount) / 100;
//             } else {
//               penalty = tier.penalty_amount;
//             }
//           }
//         }
//       }
//       break;
//   }
  
//   return penalty;
// }

// // =====================================
// // SOCIETY MAINTENANCE CONTROLLER FUNCTIONS
// // =====================================

// // API 1: Configure Society Maintenance
// async function configureSocietyMaintenance(req: Request, res: Response) {
//   const session = await mongoose.startSession();

//   try {
//     await session.withTransaction(async () => {
//       const config: MaintenanceConfigRequest = req.body;
//       const adminUserId = req.user?.id;

//       const society = await Society.findOne({ society_code: config.society_code });
//       if (!society) {
//         throw new Error("Society not found");
//       }

//       const validationError = validateMaintenanceConfig(config);
//       if (validationError) {
//         throw new Error(validationError);
//       }

//       await SocietyConfiguration.updateMany(
//         { society_code: config.society_code },
//         { is_active: false, updated_at: new Date() },
//         { session }
//       );

//       const newConfig = new SocietyConfiguration({
//         ...config,
//         configured_by: adminUserId,
//         is_active: true,
//         created_at: new Date(),
//         updated_at: new Date()
//       });

//       const savedConfig = await newConfig.save({ session });

//       const preview = await generateConfigurationPreview(config.society_code, savedConfig);

//       const response: MaintenanceConfigResponse = {
//         success: true,
//         message: "Maintenance configuration saved successfully!",
//         configuration_id: savedConfig._id.toString(),
//         configuration_summary: preview,
//         next_steps: [
//           "Review the maintenance breakdown",
//           "Generate maintenance for current/future months",
//           "Notify users about maintenance setup",
//           "Set up automated maintenance generation"
//         ]
//       };

//       res.status(201).json(response);
//     });

//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Error configuring maintenance",
//       error: error.message
//     });
//   } finally {
//     await session.endSession();
//   }
// }


// // API 2: Generate Maintenance Records
// async function generateMaintenanceRecords(req: Request, res: Response) {
//     const session = await mongoose.startSession();
    
//     try {
//       await session.withTransaction(async () => {
//         const { 
//           society_code, 
//           generation_type, 
//           months, 
//           generate_future_months 
//         }: MaintenanceGenerationRequest = req.body;
        
//         // Get active configuration
//         const config = await SocietyConfiguration.findOne({ 
//           society_code, 
//           is_active: true 
//         });
        
//         if (!config) {
//           throw new Error("Maintenance configuration not found. Please configure maintenance first.");
//         }
        
//         // Get all users in the society
//         const users = await User.find({ society_code })
//           .populate('flat')
//           .session(session);
        
//         if (users.length === 0) {
//           throw new Error("No users found in this society");
//         }
        
//         // Determine which months to generate for
//         let monthsToGenerate: { year: number; month: number }[] = [];
        
//         if (generation_type === "current_month") {
//           const now = new Date();
//           monthsToGenerate = [{ year: now.getFullYear(), month: now.getMonth() + 1 }];
//         } else if (generation_type === "future_months" && generate_future_months) {
//           const now = new Date();
//           for (let i = 0; i < generate_future_months; i++) {
//             const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
//             monthsToGenerate.push({
//               year: futureDate.getFullYear(),
//               month: futureDate.getMonth() + 1
//             });
//           }
//         } else if (generation_type === "bulk_generate" && months) {
//           monthsToGenerate = months;
//         }
        
//         const generatedRecords = [];
//         const bulkOperations = [];
        
//         // Generate maintenance for each user and each month
//         for (const { year, month } of monthsToGenerate) {
//           for (const user of users) {
//             // Check if maintenance already exists
//             const existingMaintenance = await Maintenance.findOne({
//               user_id: user._id,
//               society_code,
//               year,
//               month
//             }).session(session);
            
//             if (existingMaintenance) {
//               continue; // Skip if already exists
//             }
            
//             // Calculate maintenance for this user
//             const calculation = await calculateMaintenanceForUser(
//               user,
//               user.flat,
//               config
//             );
            
//             // Calculate due date
//             const dueDate = calculateDueDate(
//               year, 
//               month, 
//               config.payment_due_day
//             );
            
//             // Create maintenance record
//             const maintenanceRecord = {
//               user_id: user._id,
//               flat_id: user.flat._id,
//               society_code,
//               year,
//               month,
//               period: config.maintenance_period,
//               base_maintenance: calculation.base_maintenance,
//               amenities_charges: calculation.amenities_charges,
//               total_amenities: calculation.total_amenities,
//               custom_adjustments: calculation.custom_adjustments,
//               total_maintenance: calculation.total_maintenance,
//               paid_amount: 0,
//               remaining_amount: calculation.total_maintenance,
//               penalty: 0,
//               total_due: calculation.total_maintenance,
//               due_date: dueDate,
//               is_paid: false,
//               payment_status: "unpaid",
//               days_overdue: 0,
//               transactions: []
//             };
            
//             bulkOperations.push({
//               insertOne: {
//                 document: maintenanceRecord
//               }
//             });
            
//             generatedRecords.push({
//               user_name: user.name,
//               flat_no: user.flat_no,
//               maintenance_amount: calculation.base_maintenance,
//               amenities_charges: calculation.total_amenities,
//               total_amount: calculation.total_maintenance,
//               due_date: dueDate
//             });
//           }
//         }
        
//         // Execute bulk insert
//         if (bulkOperations.length > 0) {
//           await Maintenance.bulkWrite(bulkOperations, { session });
//         }
        
//         const totalAmount = generatedRecords.reduce(
//           (sum, record) => sum + record.total_amount, 
//           0
//         );
        
//         res.status(201).json({
//           success: true,
//           message: `Successfully generated maintenance for ${generatedRecords.length} records`,
//           generated_records: {
//             total_records: generatedRecords.length,
//             total_users: users.length,
//             months_generated: monthsToGenerate.length,
//             total_amount: totalAmount,
//             breakdown: generatedRecords
//           }
//         });
//       });
      
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || "Error generating maintenance records",
//         error: error.message
//       });
//     } finally {
//       await session.endSession();
//     }
//   }

// // API 3: Get Configuration Preview
// async function getConfigurationPreview(req: Request, res: Response) {
//     try {
//       const { society_code } = req.params;
      
//       const config = await SocietyConfiguration.findOne({ 
//         society_code, 
//         is_active: true 
//       });
      
//       if (!config) {
//         return res.status(404).json({
//           success: false,
//           message: "No active maintenance configuration found"
//         });
//       }
      
//       const preview = await generateConfigurationPreview(society_code, config);
      
//       res.status(200).json({
//         success: true,
//         configuration_preview: preview,
//         configuration_details: {
//           maintenance_basis: config.maintenance_basis,
//           maintenance_period: config.maintenance_period,
//           payment_due_day: config.payment_due_day,
//           penalty_type: config.penalty_type,
//           amenities_count: config.amenities?.length || 0
//         }
//       });
      
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         message: "Error generating preview",
//         error: error.message
//       });
//     }
//   }

// // Helper Functions
// function validateMaintenanceConfig(config: MaintenanceConfigRequest): string | null {
//     // Basic validation
//     if (!config.society_code) {
//       return "Society code is required";
//     }
    
//     // Validate based on maintenance basis
//     switch (config.maintenance_basis) {
//       case "fixed":
//         if (!config.fixed_maintenance_amount || config.fixed_maintenance_amount <= 0) {
//           return "Fixed maintenance amount is required and must be greater than 0";
//         }
//         break;
//       case "per-occupant":
//         if (!config.per_occupant_rate || config.per_occupant_rate <= 0) {
//           return "Per occupant rate is required and must be greater than 0";
//         }
//         break;
//       case "per-square-feet":
//         if (!config.per_square_feet_rate || config.per_square_feet_rate <= 0) {
//           return "Per square feet rate is required and must be greater than 0";
//         }
//         break;
//       case "unit-type":
//         if (!config.unit_type_rates || config.unit_type_rates.length === 0) {
//           return "Unit type rates are required";
//         }
//         for (const rate of config.unit_type_rates) {
//           if (!rate.unit_type || rate.rate <= 0) {
//             return "All unit type rates must have valid unit type and rate greater than 0";
//           }
//         }
//         break;
//     }
    
//     // Validate payment due day
//     if (config.payment_due_day < 1 || config.payment_due_day > 31) {
//       return "Payment due day must be between 1 and 31";
//     }
    
//     // Validate penalty configuration
//     const penaltyConfig = config.penalty_config;
//     switch (penaltyConfig.penalty_type) {
//       case "fixed":
//         if (!penaltyConfig.fixed_penalty_amount || penaltyConfig.fixed_penalty_amount <= 0) {
//           return "Fixed penalty amount is required and must be greater than 0";
//         }
//         break;
//       case "percentage":
//         if (!penaltyConfig.penalty_percentage || penaltyConfig.penalty_percentage <= 0 || penaltyConfig.penalty_percentage > 100) {
//           return "Penalty percentage must be between 0 and 100";
//         }
//         break;
//       case "per-day":
//         if (!penaltyConfig.per_day_penalty || penaltyConfig.per_day_penalty <= 0) {
//           return "Per day penalty amount is required and must be greater than 0";
//         }
//         break;
//       case "tiered":
//         if (!penaltyConfig.tiered_penalty || penaltyConfig.tiered_penalty.length === 0) {
//           return "Tiered penalty configuration is required";
//         }
//         break;
//     }
    
//     return null;
// }

// async function generateConfigurationPreview(societyCode: string, config: any) {
//     const users = await User.find({ society_code: societyCode }).populate({
//       path: 'flat',
//       model: 'Flat' // Make sure this matches your actual model name
//     });
    
//     let totalEstimatedCollection = 0;
//     const breakdownByFlatType: { [key: string]: { count: number; maintenance_per_flat: number; total_collection: number } } = {};
    
//     for (const user of users) {
//       const calculation = await calculateMaintenanceForUser(
//         user,
//         user.flat,
//         config
//       );
      
//       totalEstimatedCollection += calculation.total_maintenance;
      
//       // Ensure user.flat is populated and has flat_type
//       const flatType = (user.flat && typeof user.flat === 'object' && 'flat_type' in user.flat)
//         ? (user.flat as any).flat_type
//         : 'Unknown';
//       if (!breakdownByFlatType[flatType]) {
//         breakdownByFlatType[flatType] = {
//           count: 0,
//           maintenance_per_flat: calculation.total_maintenance,
//           total_collection: 0
//         };
//       }
      
//       breakdownByFlatType[flatType].count += 1;
//       breakdownByFlatType[flatType].total_collection += calculation.total_maintenance;
//     }
    
//     return {
//       total_users_affected: users.length,
//       estimated_monthly_collection: totalEstimatedCollection,
//       breakdown_by_flat_type: breakdownByFlatType
//     };
//   }

// export {
//   configureSocietyMaintenance,  
//   generateMaintenanceRecords,
//   getConfigurationPreview,
// };

const configureSocietyMaintenance = async (req: Request, res: Response) => {
  try {
    const {
      society_code,
      maintenance_period,
      maintenance_basis,
      per_square_feet_rate,
      flat_type_rates,
      penalty_type,
      per_day_penalty,
      fixed_penalty,
      payment_due_day,
      billing_cycle,
      amenities,
      custom_flat_rates
    } = req.body;

    const userId = req.user?._id;

    // Deactivate previous config
    await SocietyConfiguration.updateMany(
      { society_code, is_active: true },
      { is_active: false }
    );

    const newConfig = new SocietyConfiguration({
      society_code,
      maintenance_period,
      maintenance_basis,
      per_square_feet_rate,
      flat_type_rates,
      penalty_type,
      per_day_penalty,
      fixed_penalty,
      payment_due_day,
      billing_cycle,
      amenities,
      custom_flat_rates,
      configured_by: userId,
      is_active: true
    });

    await newConfig.save();

    return res.status(201).json({
      success: true,
      message: "Society maintenance configured successfully",
      config: newConfig
    });

  } catch (error) {
    console.error("Error in configuring society:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export default configureSocietyMaintenance;