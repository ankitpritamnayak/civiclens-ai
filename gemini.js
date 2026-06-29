// ================= GEMINI CONFIG =================
const GEMINI_API_KEY = "AQ.Ab8RN6IkenWg_amIFRmJc9K6pQVYO-abMviG9bAmoDdgeJsTTA";

// ================= AI ANALYSIS =================
async function analyzeIssue(title, description, base64Image = null) {
    // Graceful fallback structure for network/quota/API failures
    const fallback = {
        category: "Others",
        severity: "Medium",
        department: "Municipal Administration",
        recommendation: "Manual review required. AI analysis unavailable."
    };

    const systemPrompt = `You are an expert civic issue classifier for a Smart City system.
Analyze the complaint and the attached image (if provided).

Choose ONLY ONE category from this exact list:
Road, Garbage, Water Supply, Street Light, Drainage, Electricity, Public Safety, Illegal Construction, Fire Hazard, Traffic, Others.

Severity must be EXACTLY ONE of:
Low, Medium, High, Critical.

Department should be the name of the responsible government department.

Recommendation must be one concise sentence describing the immediate action required.

Return ONLY valid JSON in this exact format, with no markdown formatting or backticks:
{
  "category": "",
  "severity": "",
  "department": "",
  "recommendation": ""
}`;

    const textContent = `Title: ${title}\nDescription: ${description}`;
    const contentsParts = [
        { text: systemPrompt },
        { text: textContent }
    ];

    // Handle multipart image injection
    if (base64Image) {
        try {
            const base64Data = base64Image.split(',')[1];
            const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];
            contentsParts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        } catch (e) {
            console.warn("Image parsing failed. Proceeding with text-only analysis.");
        }
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: contentsParts }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.candidates || !result.candidates.length || !result.candidates[0].content) {
            throw new Error("Invalid Gemini response format.");
        }

        let text = result.candidates[0].content.parts[0].text;

        // Clean any unexpected markdown blocks
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("JSON structure missing from response.");
        }

        const jsonString = text.substring(start, end + 1);
        const parsedData = JSON.parse(jsonString);

        // Ensure fallback defaults if any field is mysteriously omitted
        return {
            category: parsedData.category || "Others",
            severity: parsedData.severity || "Medium",
            department: parsedData.department || "Municipal Administration",
            recommendation: parsedData.recommendation || "Issue logged for inspection."
        };

    } catch (error) {
        console.error("Gemini Analysis Failed. Triggering fallback:", error);
        return fallback;
    }
}