import vision from '@google-cloud/vision';

// initialize client on server side
const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_CLOUD_VISION_KEY, // use env variable for secure API key access
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method not allowed'});
        return;
    }

    try {
        const { image } = req.body;
        const [result] = await client.textDetection({ image: { content: image.split(',')[1] }});
        const detections = result.textAnnotations;
        const title = detections[0]?.description.split('\n')[0] || 'Untitled'; // attempt to get first line as title

        res.status(200).json({ title });
    } catch (error) {
        console.error('Vision API Error:', error);
        res.status(500).json({ error: 'Failed to process image'});
    }
}