import axios from 'axios';

export default async function handler(req, res) {
    // Header CORS agar bisa diakses dari frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.body;

    if (!url || !url.includes('tiktok.com')) {
        return res.status(400).json({ success: false, error: 'Masukkan URL TikTok yang valid!' });
    }

    try {
        // Memanggil API Tikwm (Gratis & Stabil)
        const response = await axios.post('https://www.tikwm.com/api/', {
            url: url
        });

        const result = response.data;

        if (result.code !== 0) {
            return res.status(400).json({ success: false, error: 'Gagal mengambil data video.' });
        }

        // Susun data yang kita butuhkan saja
        const cleanData = {
            title: result.data.title,
            cover: result.data.cover,
            video_no_wm: result.data.play, // Video tanpa watermark
            music_url: result.data.music,   // Lagu/MP3
            author: result.data.author.nickname
        };

        return res.status(200).json({ success: true, data: cleanData });

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Terjadi kesalahan server.' });
    }
}
