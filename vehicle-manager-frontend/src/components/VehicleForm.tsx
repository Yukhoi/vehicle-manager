import type React from "react";
import type { Vehicle } from "../types/vehicles";
import { useState } from "react";

interface VehicleFormProps {
  onCreate: (data: Vehicle) => Promise<void>;
}

export function VehicleForm({ onCreate }: VehicleFormProps) {
  const [id, setId] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [partnerId, setPartnerId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedPrice = Number(price);
    const parsedPartnerId = Number(partnerId);

    if (!id.trim() || !manufacturer.trim() || !model.trim()) {
      setError("Required fields cannot be empty");
      return;
    }

    if (
      price.trim() === "" ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      setError("Invalid price");
      return;
    }

    if (
      partnerId.trim() === "" ||
      !Number.isSafeInteger(parsedPartnerId) ||
      parsedPartnerId <= 0
    ) {
      setError("Invalid partner ID");
      return;
    }

    const data: Vehicle = {
      id: id.trim(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      price: parsedPrice,
      partner_id: parsedPartnerId,
    };

    setSubmitting(true);
    setError(null);

    try {
      await onCreate(data);

      setId("");
      setManufacturer("");
      setModel("");
      setPrice("");
      setPartnerId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Vehicle</h2>

      <input
        placeholder="Vehicle ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />

      <input
        placeholder="Manufacturer"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
        required
      />

      <input
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Price"
        min="0"
        step="any"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Partner ID"
        min="1"
        step="1"
        value={partnerId}
        onChange={(e) => setPartnerId(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Add Vehicle"}
      </button>
    </form>
  );
}
