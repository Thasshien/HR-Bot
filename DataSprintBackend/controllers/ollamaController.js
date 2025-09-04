/*const { default: ollama } = require("ollama");
const fs = require("fs");
const path = require("path");
const stringSimilarity = require("string-similarity");
const { policyFileMap, policySynonyms } = require("../policies/policies");

function findPolicyFileFuzzy(query) {
  const lowerQuery = query.toLowerCase();

  let allKeywords = [];
  for (const [keyword, synonyms] of Object.entries(policySynonyms)) {
    synonyms.forEach((syn) => {
      allKeywords.push({ keyword, synonym: syn.toLowerCase() });
    });
  }

  const synonymList = allKeywords.map((item) => item.synonym);
  const bestMatch = stringSimilarity.findBestMatch(lowerQuery, synonymList);

  if (bestMatch.bestMatch.rating > 0.5){ 
    const match = allKeywords.find(
      (item) => item.synonym === bestMatch.bestMatch.target
    );
    return policyFileMap[match.keyword];
  }

  return null;
}

const askReq = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const matchedFile = findPolicyFileFuzzy(query);

    if (!matchedFile) {
      return res.json({ reply: "Not specified in the policy" });
    }

    const policyPath = path.join(__dirname, "../policies", matchedFile);
    const policyText = fs.readFileSync(policyPath, "utf-8");

    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "system",
          content:
            "You are a company policy assistant. Only answer using the given policy text. If the policy does not mention something, say 'Not specified in the policy'.",
        },
        {
          role: "user",
          content: `Here is the relevant company policy:\n\n${policyText}\n\nUser question: ${query}`,
        },
      ],
    });

    const reply =
      response.message?.content ||
      response.messages?.[0]?.content ||
      "No response from model";

    res.json({ reply });
  } catch (error) {
    console.error("Ollama Error (detailed):", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { askReq };
*/