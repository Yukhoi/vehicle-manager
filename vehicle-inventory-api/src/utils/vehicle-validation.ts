import type { CreateVehicleDTO } from "../models/create-vehicle.dto.js";
import type { UpdateVehicleDTO } from "../models/update-vehicle.dto.js";

export function isCreateVehicleDTO(data: unknown): data is CreateVehicleDTO {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.manufacturer === "string" &&
    typeof obj.model === "string" &&
    typeof obj.price === "number" &&
    typeof obj.partner_id === "number"
  );
}

export function isUpdateVehicleDTO(data: unknown): data is UpdateVehicleDTO {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.manufacturer === "string" &&
    typeof obj.model === "string" &&
    typeof obj.price === "number" &&
    typeof obj.partner_id === "number"
  );
}
