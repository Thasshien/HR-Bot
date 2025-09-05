const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOllama } = require("@langchain/ollama");
const nodemailer = require("nodemailer");

// Configure Ollama LLM
const llm = new ChatOllama({
  model: "llama3",
  baseUrl: "http://localhost:11434"
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASSWORD
  }
});

// Tool for escalation (for LangChain demo)
const tools = [
  {
    name: "EscalateToHR",
    description: "Send escalation email when SLA is breached",
    func: async (input) => {
      console.log("🚨 Escalation Triggered. Preparing email...");
      try {
        await transporter.sendMail({
          from: process.env.ALERT_EMAIL,
          to: process.env.ALERT_RECIPIENT,
          subject: "SLA Breach Alert",
          text: `⚠️ Attention: SLA Breach detected.\n\n${input}`
        });
        console.log("📧 Escalation email sent successfully!");
      } catch (err) {
        console.error("❌ Failed to send email:", err);
      }
      return "Escalation email attempted.";
    }
  }
];

// SLA Agent
async function runSlaAgent(request,hours) {
  console.log("🤖 Running SLA Agent for request:", request.name);

  // Optional: use LangChain agent for demo purposes
  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description"
  });

  // Compose input message
  const input = `Request ${request.name} for leave has been pending for more than ${hours} hours. Escalating now.`;

  // Directly call escalation tool (skip LLM decision for reliability)
  await tools[0].func(input);

  // Optional: also let LangChain agent respond (demo only)
  const result = await executor.invoke({ input });
  console.log("🤖 Agent Decision (demo):", result.output);

  return result.output;
}

module.exports = { runSlaAgent };