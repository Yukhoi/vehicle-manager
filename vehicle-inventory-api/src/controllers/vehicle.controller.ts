import type { IncomingMessage, ServerResponse } from "node:http";
import {
  createVehicle,
  deleteVehicleService,
  getAllVehicles,
  getVehicleById,
  updateVehicleService,
} from "../services/vehicle.service.js";
import { error } from "node:console";
import { readJsonBody } from "../utils/read-json-body.js";
import {
  isCreateVehicleDTO,
  isUpdateVehicleDTO,
} from "../utils/vehicle-validation.js";
import type { SrvRecord } from "node:dns";
import { json } from "node:stream/consumers";

export function getVehicleByIdController(
  id: string,
  res: ServerResponse,
): void {
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    res.writeHead(404, {
      "content-type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Vehicle not found",
      }),
    );

    return;
  }

  res.writeHead(200, {
    "content-type": "application/json",
  });

  res.end(
    JSON.stringify({
      vehicle,
    }),
  );
}

export function getAllVehiclesController(url: URL, res: ServerResponse): void {
  const rawMaxPrice = url.searchParams.get("maxPrice");

  let maxPrice: number | undefined;

  if (rawMaxPrice !== null) {
    if (rawMaxPrice.trim() === "") {
      res.writeHead(400, {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          error: "maxPrice cannot be empty",
        }),
      );

      return;
    }

    maxPrice = Number(rawMaxPrice);
  }

  const vehicles = getAllVehicles(maxPrice);

  res.writeHead(200, {
    "content-type": "application/json",
  });

  res.end(JSON.stringify(vehicles));
}

export async function createVehicleController(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  // const data = await readJsonBody(req);

  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  const data: unknown = JSON.parse(body);

  if (!isCreateVehicleDTO(data)) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Invalid vehicle data",
      }),
    );

    return;
  }

  const vehicle = createVehicle(data);

  res.writeHead(201, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(vehicle));
}

export async function updateVehicleController(
  id: string,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  // const data = await readJsonBody(req);

  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  const data: unknown = JSON.parse(body);

  if (!isUpdateVehicleDTO(data)) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Invalid vehicle data",
      }),
    );

    return;
  }

  const vehicle = updateVehicleService(id, data);

  if (!vehicle) {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Vehicle not found",
      }),
    );

    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(vehicle));
}

export function deleteVehicleController(id: string, res: ServerResponse): void {
  const deleted = deleteVehicleService(id);

  if (!deleted) {
    res.writeHead(404, {
      "content-type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Vehicle not found",
      }),
    );

    return;
  }

  res.writeHead(204, {
    "content-type": "application/json",
  });

  res.end();
}
