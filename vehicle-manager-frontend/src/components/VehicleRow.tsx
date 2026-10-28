import type { Vehicle } from "../types/vehicles";

interface VehicleRowProps {
  vehicle: Vehicle;
  onDelete: (id: string) => Promise<void>;
}

export function VehicleRow({
  vehicle,
  onDelete,
}: VehicleRowProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${vehicle.manufacturer} ${vehicle.model}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await onDelete(vehicle.id);
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  }

  return (
    <li>
      {vehicle.manufacturer} {vehicle.model}
      {" - "}
      {vehicle.price} €

      <button onClick={() => void handleDelete()}>
        Delete
      </button>
    </li>
  );
}