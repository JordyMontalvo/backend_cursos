const { connectDB } = require('./_db');
const Banner = require('./_Banner');

module.exports = async (req, res) => {
    // Configurar headers CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectDB();

        if (req.method === 'GET') {
            const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
            return res.json({ success: true, banners });
        }

        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
