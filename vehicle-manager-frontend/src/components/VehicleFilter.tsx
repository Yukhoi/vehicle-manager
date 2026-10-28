import { useState } from "react";

interface VehicleFilterProps {
  onFilter: (maxPrice?: number) => void;
}

export function VehicleFilter({ onFilter }: VehicleFilterProps) {
  const [inputPrice, setInputPrice] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inputPrice.trim() === "") {
      onFilter();
      return;
    }

    const price = Number(inputPrice);

    if (!Number.isFinite(price) || price < 0) {
      alert("Invalid price");
      return;
    }

    onFilter(price);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="maxPrice">Maximun price</label>

      <input
        id="maxPrice"
        type="number"
        min="0"
        step="10"
        value={inputPrice}
        onChange={(e) => setInputPrice(e.target.value)}
        placeholder="Enter maximun price"
      />


      <button type="submit">Filter</button>

      <button
        type="button"
        onClick={() => {
          setInputPrice("");
          onFilter();
        }}
      >
        Reset
      </button>
    </form>
  );
}
