require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sequelize, User, Store, Rating } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Auth Middleware
const auth = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'No Token Provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (roles.length && !roles.includes(decoded.role)) return res.status(403).json({ message: 'Access Denied' });
        req.user = decoded;
        next();
    } catch { res.status(401).json({ message: 'Invalid Token' }); }
};

// --- AUTH & PROFILE ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        if (name.length < 5 || name.length > 60) return res.status(400).json({ message: "Name: 5-60 chars" });
        const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!pwdRegex.test(password)) return res.status(400).json({ message: "Password: 8-16 chars, 1 Upper, 1 Special" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, address, role: role || 'user' });
        res.status(201).json({ message: "Success" });
    } catch (err) { res.status(400).json({ message: "Email already exists" }); }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, role: user.role, name: user.name });
});

app.patch('/api/auth/update-password', auth(['user', 'admin', 'owner']), async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(oldPassword, user.password))) return res.status(400).json({ message: "Old password wrong" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password Updated" });
});

// --- ADMIN ROUTES ---
app.get('/api/admin/dashboard', auth(['admin']), async (req, res) => {
    res.json({ users: await User.count(), stores: await Store.count(), ratings: await Rating.count() });
});

app.post('/api/admin/stores', auth(['admin']), async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;
        await Store.create({ name, email, address, owner_id });
        res.status(201).json({ message: "Store Added" });
    } catch (err) { res.status(400).json({ message: "Error adding store" }); }
});

app.get('/api/admin/users', auth(['admin']), async (req, res) => {
    res.json(await User.findAll({ attributes: { exclude: ['password'] } }));
});

// --- USER ROUTES ---
app.get('/api/user/stores', auth(['user']), async (req, res) => {
    const { search, sort } = req.query;
    let whereClause = {};
    if (search) {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } }
            ]
        };
    }
    const stores = await Store.findAll({
        where: whereClause,
        include: [{ model: Rating, attributes: [] }],
        attributes: { include: [[sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'avgRating']] },
        group: ['Store.id'],
        order: sort === 'rating' ? [[sequelize.literal('avgRating'), 'DESC']] : [['name', 'ASC']]
    });
    res.json(stores);
});

app.post('/api/user/ratings', auth(['user']), async (req, res) => {
    const { store_id, rating } = req.body;
    await Rating.upsert({ user_id: req.user.id, store_id, rating });
    res.json({ message: "Rating saved" });
});

// --- OWNER ROUTES ---
app.get('/api/owner/dashboard', auth(['owner']), async (req, res) => {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) return res.status(404).json({ message: "No store" });
    const ratings = await Rating.findAll({ where: { store_id: store.id }, include: [{ model: User, attributes: ['name', 'email'] }] });
    res.json({ store, ratings });
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)));