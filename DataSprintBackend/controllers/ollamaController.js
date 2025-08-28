const { default: ollama } = require('ollama');
const fs = require('fs');
const path = require('path');

const askReq = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Load policy file once
    const policyPath = path.join(__dirname, '../EmployeePolicy.txt'); // make sure this path is correct
    const policyText = fs.readFileSync(policyPath, 'utf-8');

    // Ask Ollama, but with the policy context
    const response = await ollama.chat({
      model: 'llama3',
      messages: [
        {
          role: 'system',
          content: "You are a company policy assistant. Only answer using the given policy text. If the policy does not mention something, say 'Not specified in the policy'."
        },
        {
          role: 'user',
          content: `Here is the company policy:\n\n${policyText}\n\nUser question: ${query}`
        }
      ],
    });

    const reply = response.message?.content
                || response.messages?.[0]?.content
                || "No response from model";

    res.json({ reply });
  } 
  catch (error) {
    console.error("Ollama Error (detailed):", error.message);
    console.error(error.stack);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { askReq };
