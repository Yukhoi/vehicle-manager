import type { IncomingMessage, ServerResponse } from "node:http";

import {
  createVehicleController,
  deleteVehicleController,
  getAllVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
} from "../controllers/vehicle.controller.js";
import {
  AppError,
  ConflictError,
  PayloadTooLargeError,
} from "../errors/app.error.js";

export async function handleVehicleRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "/", "http://localhost");

  try {
    if (req.method === "POST" && url.pathname === "/vehicles") {
      await createVehicleController(req, res);
      return;
    }
    // GET /vehicles
    // GET /vehicles?maxPrice=17000
    if (req.method === "GET" && url.pathname === "/vehicles") {
      getAllVehiclesController(url, res);
      return;
    }

    // GET /vehicles/:id
    const segments = url.pathname.split("/").filter(Boolean);

    if (
      req.method === "GET" &&
      segments.length === 2 &&
      segments[0] === "vehicles"
    ) {
      const id = segments[1];

      if (id === undefined) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid vehicle ID" }));
        return;
      }

      getVehicleByIdController(id, res);
      return;
    }

    if (
      req.method === "PUT" &&
      segments.length === 2 &&
      segments[0] === "vehicles"
    ) {
      const id = segments[1];

      if (id === undefined) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid vehicle ID" }));
        return;
      }

      await updateVehicleController(id, req, res);
      return
    }

    if (
      req.method === "DELETE" &&
      segments.length === 2 &&
      segments[0] === "vehicles"
    ) {
      const id = segments[1];

      if (id === undefined) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: "Invalid vehicle ID",
          }),
        );
        return;
      }

      deleteVehicleController(id, res);
      return;
    }

    // Route not found
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Route not found",
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      if (error instanceof PayloadTooLargeError) {
        res.setHeader("Connection", "close");
      }
      res.writeHead(error.statusCode, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          error: error.message,
        }),
      );

      return;
    }

    // Unexpected errors
    console.error("Internal server error:", error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Internal server error",
      }),
    );
  }
}
