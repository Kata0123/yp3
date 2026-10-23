const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, c.name as category_name
            FROM services s
                     LEFT JOIN categories c ON s.category_id = c.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && user.password_hash === password) {
            res.json({
                success: true,
                user: { id: user.id, email: user.email, discount: user.personal_discount, role_id: user.role_id }
            });
        } else {
            res.status(401).json({ error: 'Неверный email или пароль' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, role_id, personal_discount) VALUES ($1, $2, $3, $4) RETURNING id, email, role_id, personal_discount',
            [email, password, 2, 0]
        );

        res.json({
            success: true,
            user: {
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                discount: newUser.rows[0].personal_discount,
                role_id: newUser.rows[0].role_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    const { name, role_id } = req.body;
    if (role_id !== 1) return res.status(403).json({ error: 'Доступ только для администратора' });

    try {
        const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    const { userId, serviceId, date } = req.body;
    try {
        const appointment = await pool.query(
            'INSERT INTO appointments (user_id, service_id, appointment_date) VALUES ($1, $2, $3) RETURNING id',
            [userId, serviceId, date]
        );

        const service = await pool.query('SELECT price, discount FROM services WHERE id = $1', [serviceId]);
        const user = await pool.query('SELECT personal_discount FROM users WHERE id = $1', [userId]);

        const price = service.rows[0].price;
        const sDiscount = service.rows[0].discount;
        const uDiscount = user.rows[0]?.personal_discount || 0;

        const finalPrice = price - (price * sDiscount / 100) - (price * uDiscount / 100);

        await pool.query(
            'INSERT INTO payments (appointment_id, amount) VALUES ($1, $2)',
            [appointment.rows[0].id, finalPrice]
        );

        res.json({ success: true, message: 'Запись создана и оплата добавлена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 3001, () => {
    console.log(`Сервер запущен на порту ${process.env.PORT || 3001}`);
});