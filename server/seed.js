import pool from './database.js';
import { customizationOptions } from './data/customizationOptions.js';

const createTables = async () => {
  await pool.query(`DROP TABLE IF EXISTS custom_jerseys`);
  await pool.query(`DROP TABLE IF EXISTS customization_options`);

  await pool.query(`
    CREATE TABLE customization_options (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      image_url TEXT,
      hex_color TEXT,
      price_modifier NUMERIC NOT NULL DEFAULT 0
    );
  `);

  await pool.query(`
    CREATE TABLE custom_jerseys (
      id SERIAL PRIMARY KEY,
      back_name TEXT NOT NULL,
      left_logo_id INTEGER REFERENCES customization_options(id) ON DELETE SET NULL,
      right_logo_id INTEGER REFERENCES customization_options(id) ON DELETE SET NULL,
      jersey_color_id INTEGER REFERENCES customization_options(id) ON DELETE SET NULL,
      total_price NUMERIC NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

const seedOptions = async () => {
  for (const option of customizationOptions) {
    await pool.query(
      `INSERT INTO customization_options (type, name, image_url, hex_color, price_modifier)
       VALUES ($1, $2, $3, $4, $5)`,
      [option.type, option.name, option.image_url || null, option.hex_color || null, option.price_modifier]
    );
  }
};

const seed = async () => {
  try {
    await createTables();
    await seedOptions();
    console.log('Database seeded successfully 🎉');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seed();