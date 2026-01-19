// Initialize Gemini AI - using fetch API directly
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
// Use gemini-1.5-flash or gemini-1.5-pro for v1beta, or gemini-pro for v1
const GEMINI_MODEL = "gemini-2.5-flash-lite"; // or "gemini-1.5-pro" for better quality
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// @desc    Generate product details using Gemini
// @route   POST /api/gemini/generate-product-details
// @access  Private
exports.generateProductDetails = async (req, res) => {
  try {
    const { productTitle } = req.body;

    if (!productTitle || !productTitle.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product title is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      });
    }

    // Create prompt for Gemini
    const prompt = `Generate detailed product information for "${productTitle}" in JSON format. Return ONLY a valid JSON object with the following structure:
{
  "description": "A detailed description of the product",
  "origin": "The origin/geographical source of the product",
  "biologicalBackground": "Biological background and scientific information about the product",
  "usage": "How to use the product, applications, and recommended usage",
  "keyCharacteristics": "Key characteristics, features, and important properties of the product"
}

Make sure the response is ONLY valid JSON, no markdown formatting, no code blocks, just the raw JSON object.
Make sure that the usage and keycharacteristics are in a paragraph format. Every information should not be greater than 3 to 4 lines.
`;

    // Call Gemini API using fetch
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to generate content from Gemini";
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.error?.message || errorData.message || errorMessage;
        console.error("Gemini API Error Response:", errorData);
      } catch (parseError) {
        const errorText = await response.text();
        console.error("Gemini API Error (text):", errorText);
        errorMessage = `Gemini API returned status ${response.status}: ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    let text = result.candidates[0]?.content?.parts[0]?.text || "";

    // Clean up the response - remove markdown code blocks if present
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/```\n?/g, "");
    }

    // Parse JSON
    let productDetails;
    try {
      productDetails = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        productDetails = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Gemini response as JSON");
      }
    }

    // Validate required fields
    const requiredFields = [
      "description",
      "origin",
      "biologicalBackground",
      "usage",
      "keyCharacteristics",
    ];

    for (const field of requiredFields) {
      if (!productDetails[field] || typeof productDetails[field] !== "string") {
        productDetails[
          field
        ] = `Information about ${field} for ${productTitle}`;
      }
    }

    res.status(200).json({
      success: true,
      data: productDetails,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating product details",
      error: error.message,
    });
  }
};
