import { useEffect, useState } from "react";
import "./App.css";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
} from "./services/vehicle.service";
import type { Vehicle } from "./types/vehicles";
import { VehicleFilter } from "./components/VehicleFilter";
import { VehicleForm } from "./components/VehicleForm";
import { VehicleList } from "./components/VehicleList";

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadVehicles() {
      try {
        const data = await getAllVehicles(maxPrice);

        if (!ignore) {
          setVehicles(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      ignore = true;
    };
  }, [maxPrice]);

  function handleFilter(price?: number) {
    setLoading(true);
    setMaxPrice(price);
  }

  async function handleCreate(data: Vehicle) {
    await createVehicle(data);

    // Refresh vehicles after creating a new one
    const updatedVehicles = await getAllVehicles(maxPrice);

    setVehicles(updatedVehicles);
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteVehicle(id);

    setVehicles((prevVehicles) =>
      prevVehicles.filter((vehicle) => vehicle.id !== id),
    );
  }

  return (
    <div>
      <h1>Vehicle Manager</h1>
      <VehicleFilter onFilter={handleFilter} />
      <VehicleForm onCreate={handleCreate} />

      {loading && <p>Loading vehicles...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          <p>Total Vehicles: {vehicles.length}</p>
          {vehicles.length === 0 ? (
            <p>No vehicles found.</p>
          ) : (
            <VehicleList vehicles={vehicles} onDelete={handleDelete} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
