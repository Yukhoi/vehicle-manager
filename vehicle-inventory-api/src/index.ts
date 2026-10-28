import { createServer } from "node:http";
import { handleVehicleRoutes } from "./routes/vehicle.route.js";

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    await handleVehicleRoutes(req, res);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.writeHead(500, {
        "Content-Type": "application/json",
      });
    }

    if (!res.writableEnded) {
      res.end(
        JSON.stringify({
          error: "Internal server error",
        }),
      );
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
