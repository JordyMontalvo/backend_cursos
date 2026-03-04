const { connectDB } = require('./_db');
const Banner = require('./_Banner');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'iatibet_zureon_secret_2024';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectDB();

        // Autenticación básica (Middleware simplificado)
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
             return res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol administrador.' });
        }

        if (req.method === 'GET') {
            const banners = await Banner.find().sort({ order: 1 });
            return res.json({ success: true, banners });
        }
        else if (req.method === 'POST') {
            const { title, subtitle, imageUrl, linkUrl, order, isActive } = req.body;
            if (!imageUrl) return res.status(400).json({ success: false, message: 'URL de imagen requerida' });
            
            const banner = new Banner({
                title: title || '',
                subtitle: subtitle || '',
                imageUrl,
                linkUrl: linkUrl || '',
                order: Number(order) || 0,
                isActive: isActive !== false
            });
            await banner.save();
            return res.json({ success: true, banner });
        }
        else if (req.method === 'PUT') {
            const pathParts = req.url.split('?')[0].split('/');
            const id = req.query.id || pathParts[pathParts.length - 1]; // Fallback por si acaso Vercel no pasa query
            if (!id || id === 'admin-banners' || id === 'api') return res.status(400).json({ success: false, message: 'ID requerido' });
            
            const { title, subtitle, imageUrl, linkUrl, order, isActive } = req.body;
            const updateData = { updatedAt: new Date() };
            if (title !== undefined) updateData.title = title;
            if (subtitle !== undefined) updateData.subtitle = subtitle;
            if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
            if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
            if (order !== undefined) updateData.order = Number(order);
            if (isActive !== undefined) updateData.isActive = isActive;

            const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
            if (!banner) return res.status(404).json({ success: false, message: 'Banner no encontrado' });
            return res.json({ success: true, banner });
        }
        else if (req.method === 'DELETE') {
            const pathParts = req.url.split('?')[0].split('/');
            const id = req.query.id || pathParts[pathParts.length - 1]; 
            if (!id || id === 'admin-banners' || id === 'api') return res.status(400).json({ success: false, message: 'ID requerido' });
            
            const banner = await Banner.findByIdAndDelete(id);
            if (!banner) return res.status(404).json({ success: false, message: 'Banner no encontrado' });
            return res.json({ success: true, message: 'Banner eliminado' });
        }

        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
