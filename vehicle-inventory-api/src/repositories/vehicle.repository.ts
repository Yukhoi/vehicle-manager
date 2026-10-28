import { db } from "../db/database.js";
import { ConflictError, ValidationError } from "../errors/app.error.js";
import type { CreateVehicleDTO } from "../models/create-vehicle.dto.js";
import type { UpdateVehicleDTO } from "../models/update-vehicle.dto.js";
import type { Vehicle } from "../models/vehicle.model.js";

export function findAllVehicles(maxPrice?: number): Vehicle[] {
  if (maxPrice === undefined) {
    const statement = db.prepare(`
      SELECT id, manufacturer, model, price, partner_id
      FROM vehicles  
    `);

    return statement.all() as unknown as Vehicle[];
  }

  const statement = db.prepare(`
    SELECT id, manufacturer, model, price, partner_id
    FROM vehicles
    WHERE price < ?
    ORDER BY price ASC  
  `);

  return statement.all(maxPrice) as unknown as Vehicle[];
}

export function findVehicleById(id: string): Vehicle | null {
  const statement = db.prepare(`
    SELECT *
    FROM vehicles 
    WHERE id = ?
  `);

  const data = statement.get(id);

  if (!data) {
    return null;
  }

  return data as unknown as Vehicle;
}

export function insertVehicle(vehicle: CreateVehicleDTO): Vehicle {
  const statement = db.prepare(`
    INSERT INTO vehicles (
      id,
      manufacturer,
      model,
      price,
      partner_id
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  try {
    statement.run(
      vehicle.id,
      vehicle.manufacturer,
      vehicle.model,
      vehicle.price,
      vehicle.partner_id,
    );

    return vehicle;
  } catch (error) {
    if (
      error !== null &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "string"
    ) {
      if (
        error.code === "SQLITE_CONSTRAINT_PRIMARYKEY" ||
        error.code === "SQLITE_CONSTRAINT_UNIQUE"
      ) {
        throw new ConflictError("Vehicle ID already exists");
      }

      if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        throw new ValidationError("Partner does not exist");
      }
    }

    throw error;
  }
}

export function updateVehicle(
  id: string,
  data: UpdateVehicleDTO,
): Vehicle | null {
  const statement = db.prepare(`
    UPDATE vehicles
    SET
      manufacturer = ?,
      model = ?,
      price = ?,
      partner_id = ?
    WHERE id = ?
  `);

  const result = statement.run(
    data.manufacturer,
    data.model,
    data.price,
    data.partner_id,
    id,
  );

  if (result.changes === 0) {
    return null;
  }

  return findVehicleById(id);
}

export function deleteVehicle(id: string): boolean {
  const statement = db.prepare(`
    DELETE FROM vehicles
    WHERE id = ?
  `)

  const result = statement.run(id);

  return result.changes > 0;
}