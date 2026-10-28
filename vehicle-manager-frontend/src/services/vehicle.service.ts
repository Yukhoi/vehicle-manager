import type { Vehicle } from "../types/vehicles";

const API_URL = "http://localhost:3000";

export async function getAllVehicles(maxPrice?: number): Promise<Vehicle[]> {
  const url = new URL(`${API_URL}/vehicles`);

  if (maxPrice !== undefined) {
    url.searchParams.set("maxPrice", String(maxPrice));
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray) {
    throw new Error("Invelid API Response: expected an array");
  }

  return data as Vehicle[];
}

export async function createVehicle(data: Vehicle): Promise<Vehicle> {
  const response = await fetch(`${API_URL}/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create vehicle: HTTP ${response.status}`);
  }

  return (await response.json()) as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/vehicles/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete vehicle: ${response.status}`);
  }
}
