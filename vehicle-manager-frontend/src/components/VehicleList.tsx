import type { Vehicle } from "../types/vehicles";
import { VehicleRow } from "./VehicleRow";

interface VehicleListProps {
  vehicles: Vehicle[];
  onDelete: (id: string) => Promise<void>;
}

export function VehicleList({
  vehicles,
  onDelete,
}: VehicleListProps) {
  if (vehicles.length === 0) {
    return <p>No vehicles found.</p>;
  }

  return (
    <ul>
      {vehicles.map((vehicle) => (
        <VehicleRow
          key={vehicle.id}
          vehicle={vehicle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}