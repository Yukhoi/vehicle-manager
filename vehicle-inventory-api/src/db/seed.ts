import { db } from "./database.js";

db.exec(`
  INSERT OR IGNORE INTO partners (id, name)
  VALUES
    (1, 'Partner A'),
    (2, 'Partner B');
  `)

console.log("partner inserted successfully");

const insertVehicle = db.prepare(`
  INSERT OR IGNORE INTO vehicles (
    id,
    manufacturer,
    model,
    price,
    partner_id
  )
    VALUES (?, ?, ?, ?, ?)
  `);

insertVehicle.run("V001", "Renault", "Clio", 15000, 1);
insertVehicle.run("V002", "Peugeot", "208", 18000, 2);
insertVehicle.run("V003", "Citroën", "C3", 16500, 1);

console.log("Vehicle inserted successfully")