import { AppError, ConflictError, ValidationError } from "../errors/app.error.js";
import type { CreateVehicleDTO } from "../models/create-vehicle.dto.js";
import type { UpdateVehicleDTO } from "../models/update-vehicle.dto.js";
import type { Vehicle } from "../models/vehicle.model.js";
import {
  deleteVehicle,
  findAllVehicles,
  findVehicleById,
  insertVehicle,
  updateVehicle,
} from "../repositories/vehicle.repository.js";

export function getAllVehicles(maxPrice?: number): Vehicle[] {
  if (maxPrice !== undefined) {
    if (!Number.isFinite(maxPrice) || maxPrice < 0) {
      throw new ValidationError("maxPrice is not valid");
    }
  }
  return findAllVehicles(maxPrice);
}

export function getVehicleById(id: string): Vehicle | null {
  const normalizedId = id.trim();

  if (id.trim() === "") {
    throw new ValidationError("Vehicle id is empty");
  }

  return findVehicleById(normalizedId);
}

export function createVehicle(data: CreateVehicleDTO): Vehicle {
  const normalizedData: CreateVehicleDTO = {
    id: data.id.trim(),
    manufacturer: data.manufacturer.trim(),
    model: data.model.trim(),
    price: data.price,
    partner_id: data.partner_id,
  };

  if (
    !normalizedData.id ||
    !normalizedData.manufacturer ||
    !normalizedData.model
  ) {
    throw new Error("Props cannot be empty");
  }

  if (!Number.isFinite(normalizedData.price) || normalizedData.price < 0) {
    throw new ValidationError("price is not valid");
  }

  if (
    !Number.isInteger(normalizedData.partner_id) ||
    normalizedData.partner_id <= 0
  ) {
    throw new ValidationError("partner is not valid");
  }

  if (getVehicleById(normalizedData.id)) {
    throw new ConflictError("Vehicle ID already exists");
  }

  return insertVehicle(normalizedData);
}

export function updateVehicleService(
  id: string,
  data: UpdateVehicleDTO,
): Vehicle | null {
  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new ValidationError("Vehicle ID is required");
  }

  const normalizedData: UpdateVehicleDTO = {
    manufacturer: data.manufacturer.trim(),
    model: data.model.trim(),
    price: data.price,
    partner_id: data.partner_id,
  };

  if (!normalizedData.manufacturer || !normalizedData.model) {
    throw new ValidationError("Vehicle fields cannot be empty");
  }

  if (!Number.isFinite(normalizedData.price) || normalizedData.price < 0) {
    throw new ValidationError("Invalid vehicle price");
  }

  if (
    !Number.isInteger(normalizedData.partner_id) ||
    normalizedData.partner_id <= 0
  ) {
    throw new ValidationError("Invalid partner ID");
  }

  return updateVehicle(normalizedId, normalizedData);
}

export function deleteVehicleService(id: string): boolean {
  const normalizedId = id.trim();

  if (normalizedId === "") {
    throw new ValidationError("vehicle id is empty");
  }

  return deleteVehicle(normalizedId);
}
