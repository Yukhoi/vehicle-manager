export interface Vehicle {
  id: string;
  manufacturer: string;
  model: string;
  price: number;
  partner_id: number;
}

export interface VehicleWithPartnerName extends Vehicle {
  partner_name: string;
}