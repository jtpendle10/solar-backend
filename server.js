const express = require('express');
const fetch = require('node-fetch'); // use node-fetch@2
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://lineage.api.ndustrial.io/graphql';
const FALLBACK_API_TOKEN = 'token YOUR_API_TOKEN';

app.post('/proxy', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] || FALLBACK_API_TOKEN;
        const upstreamRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify(req.body)
        });
        const data = await upstreamRes.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Proxy error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
