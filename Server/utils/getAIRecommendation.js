export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.api_key;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  // console.log("API Key Exists:", !!process.env.api_key);
  // console.log("API Key Prefix:", process.env.api_key?.slice(0, 15));
  // console.log("Products Count:", products.length);

  try {
    const geminiPrompt = `
        Here is a list of available products:
        ${JSON.stringify(products, null, 2)}
    
        Based on the following user request, filter and suggest the best matching products:
        "${userPrompt}"

        Only return the matching products in JSON format.
    `;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
      }),
    });

    const data = await response.json();

    // console.log("Gemini API Response:", data);
    if (data?.error) {
      console.log("Gemini API error:", data.error);
      return { success: false, products: [], message: data.error.message };
    }

    const aiResponseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const cleanedText = aiResponseText.replace(/```json|```/g, "").trim();

    if (!cleanedText) {
      return {
        success: false,
        products: [],
        message: "AI response is empty or invalid.",
      };
    }

    let parsedProducts;
    try {
      parsedProducts = JSON.parse(cleanedText);
    } catch (error) {
      return {
        success: false,
        products: [],
        message: "Failed to parse AI response",
      };
    }

    return { success: true, products: parsedProducts };
  } catch (error) {
    console.log("getAIRecommendation error:", error.message);
    return { success: false, products: [], message: "Internal server error." };
  }
}
