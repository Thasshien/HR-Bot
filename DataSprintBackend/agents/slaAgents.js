const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOllama } = require("@langchain/ollama");
const nodemailer = require("nodemailer");

const llm = new ChatOllama({
  model: "llama3",
  baseUrl: "http://localhost:11434"
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASSWORD
  }
});

const tools = [
  {
    name: "EscalateToHR",
    description: "Send escalation email when SLA is breached",
    func: async (input) => {
      try {
        await transporter.sendMail({
          from: process.env.ALERT_EMAIL,
          to: process.env.ALERT_RECIPIENT,
          subject: "SLA Breach Alert",
          text: `⚠️ Attention: SLA Breach detected.\n\n${input}`
        });
      } catch (err) {
        console.error("❌ Failed to send email:", err);
      }
      return "Escalation email attempted.";
    }
  }
];

async function runSlaAgent(request,hours) {
  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description"
  });
  const input = `Request ${request.name} for leave has been pending for more than ${hours} hours. Escalating now.`;
  await tools[0].func(input);
  const result = await executor.invoke({ input });
  return result.output;
}

module.exports = { runSlaAgent };