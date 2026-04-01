export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { imageBase64 } = req.body;
    if (!imageBase64) {
        return res.status(400).json({ error: 'No image data provided.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server misconfiguration: Missing Gemini API key.' });
    }

    const prompt = `You are an expert at reading handwritten Indian hostel/paying-guest ledger entries.
    Analyze this handwritten notebook image and extract all visible tenant records.
    
    For EACH tenant record you find, extract:
    - name: the tenant's full name (string)
    - room_number: room number or room name (string)
    - rent_amount: monthly rent as a number only, no currency symbols (number)
    - whatsapp_number: 10-digit Indian phone number (string, digits only)
    - due_date: the day of the month rent is due, e.g. 5 for the 5th (number, default to 1 if not found)
    
    Return ONLY a valid JSON array. No markdown, no explanation text. Example:
    [{"name":"Rahul Sharma","room_number":"101","rent_amount":5000,"whatsapp_number":"9876543210","due_date":5}]
    
    If you cannot find any tenants, return an empty array: []`;

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: 'image/jpeg',
                                    data: imageBase64
                                }
                            }
                        ]
                    }],
                    generationConfig: { temperature: 0.1 }
                })
            }
        );

        const geminiData = await geminiResponse.json();
        
        if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.status(500).json({ error: 'Gemini returned an empty response.' });
        }

        const rawText = geminiData.candidates[0].content.parts[0].text.trim();
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            return res.status(422).json({ error: 'Could not parse tenant data from image. Please ensure the image is clear and contains ledger entries.' });
        }

        const tenants = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ tenants });

    } catch (err) {
        console.error('[parse-ledger] Error:', err);
        return res.status(500).json({ error: 'Internal server error while parsing the image.' });
    }
}
