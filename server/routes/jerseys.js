import express from 'express';
import pool from '../database.js';

const router = express.Router();

const BASE_PRICE = 50;
const PRICE_PER_CHARACTER = 0.5;

const getOptionById = async (id) => {
  if (!id) return null;
  const result = await pool.query('SELECT * FROM customization_options WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const calculatePrice = (backName, leftLogo, rightLogo, jerseyColor) => {
  let price = BASE_PRICE;
  price += (backName?.length || 0) * PRICE_PER_CHARACTER;
  if (leftLogo) price += Number(leftLogo.price_modifier);
  if (rightLogo) price += Number(rightLogo.price_modifier);
  if (jerseyColor) price += Number(jerseyColor.price_modifier);
  return Math.round(price * 100) / 100;
};

const validateCombo = (backName, leftLogo) => {
  if (leftLogo?.name === 'Champions Logo' && backName.length > 12) {
    return 'Champions Logo requires a back name of 12 characters or fewer.';
  }
  return null;
};

// GET all custom jerseys, joined with readable option info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cj.*,
        ll.name AS left_logo_name, ll.image_url AS left_logo_image,
        rl.name AS right_logo_name, rl.image_url AS right_logo_image,
        jc.name AS jersey_color_name, jc.hex_color AS jersey_hex_color
      FROM custom_jerseys cj
      LEFT JOIN customization_options ll ON cj.left_logo_id = ll.id
      LEFT JOIN customization_options rl ON cj.right_logo_id = rl.id
      LEFT JOIN customization_options jc ON cj.jersey_color_id = jc.id
      ORDER BY cj.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jerseys' });
  }
});

// POST a new custom jersey
router.post('/', async (req, res) => {
  const { back_name, left_logo_id, right_logo_id, jersey_color_id } = req.body;

  if (!back_name || !back_name.trim()) {
    return res.status(400).json({ error: 'Back name is required' });
  }

  try {
    const leftLogo = await getOptionById(left_logo_id);
    const rightLogo = await getOptionById(right_logo_id);
    const jerseyColor = await getOptionById(jersey_color_id);

    const comboError = validateCombo(back_name, leftLogo);
    if (comboError) return res.status(400).json({ error: comboError });

    const total_price = calculatePrice(back_name, leftLogo, rightLogo, jerseyColor);

    const result = await pool.query(
      `INSERT INTO custom_jerseys (back_name, left_logo_id, right_logo_id, jersey_color_id, total_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [back_name, left_logo_id || null, right_logo_id || null, jersey_color_id || null, total_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create jersey' });
  }
});

// PUT update an existing jersey
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { back_name, left_logo_id, right_logo_id, jersey_color_id } = req.body;

  if (!back_name || !back_name.trim()) {
    return res.status(400).json({ error: 'Back name is required' });
  }

  try {
    const leftLogo = await getOptionById(left_logo_id);
    const rightLogo = await getOptionById(right_logo_id);
    const jerseyColor = await getOptionById(jersey_color_id);

    const comboError = validateCombo(back_name, leftLogo);
    if (comboError) return res.status(400).json({ error: comboError });

    const total_price = calculatePrice(back_name, leftLogo, rightLogo, jerseyColor);

    const result = await pool.query(
      `UPDATE custom_jerseys
       SET back_name = $1, left_logo_id = $2, right_logo_id = $3, jersey_color_id = $4, total_price = $5
       WHERE id = $6 RETURNING *`,
      [back_name, left_logo_id || null, right_logo_id || null, jersey_color_id || null, total_price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Jersey not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update jersey' });
  }
});

// DELETE a jersey
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM custom_jerseys WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Jersey not found' });
    }
    res.json({ message: 'Jersey deleted', jersey: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete jersey' });
  }
});

export default router;