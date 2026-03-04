const { connectDB } = require('./_db');
const Settings = require('./_Settings');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'iatibet_zureon_jwt_secret_2024';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectDB();

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });

        let user;
        try {
            user = jwt.verify(token, JWT_SECRET);
        } catch (err) {
             return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }

        if (user.role !== 'admin') {
             return res.status(403).json({ success: false, message: 'Acceso denegado' });
        }

        if (req.method === 'GET') {
            let settings = await Settings.findOne();
            if (!settings) {
                settings = await Settings.create({});
            }
            return res.json({ success: true, settings });
        }
        else if (req.method === 'PUT') {
            let settings = await Settings.findOne();
            if (!settings) settings = new Settings();

            if (req.body.presentationVideoUrl !== undefined) {
                settings.presentationVideoUrl = req.body.presentationVideoUrl;
            }
            settings.updatedAt = new Date();
            await settings.save();
            return res.json({ success: true, settings });
        }

        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
