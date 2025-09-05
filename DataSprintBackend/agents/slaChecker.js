const axios = require("axios");
const cron = require("node-cron");
const { runSlaAgent } = require("./slaAgents");
const { getAdminCookie } = require("./hriAuth");

// Test SLA in hours (~30 seconds)
const SLA_HOURS = 48;
const HRIS_URL = process.env.FRAPPE_URL;

// Cron runs every 8 seconds for testing
cron.schedule("0 */30 * * * *", async () => {
  console.log("⏱️ Entered SLA checker");

  try {
    const cookie = await getAdminCookie(); // always await!
    console.log("Using cookie:", cookie);

    // Request open leave applications and explicitly include 'creation'
    const response = await axios.get(`${HRIS_URL}/api/resource/Leave Application`, {
      params: {
        filters: JSON.stringify([["status", "=", "Open"]]),
        fields: JSON.stringify(["name", "creation", "modified", "status"]) // <-- request creation timestamp
      },
      headers: { Cookie: cookie }
    });

    const leaves = response.data.data;
    console.log(`📌 Found ${leaves.length} open leave applications`);

    for (let leave of leaves) {
      console.log("leave req: ",leave);
      const createdAt = leave.creation || leave.modified;
      if (!createdAt) {
        console.warn(`Leave ${leave.name} has no creation timestamp, skipping`);
        continue;
      }

      const hoursElapsed = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
      console.log(`Leave ${leave.name} created at ${createdAt}, hours elapsed: ${hoursElapsed.toFixed(5)}`);

      if (hoursElapsed > SLA_HOURS) {
        console.log(`⚠️ SLA breach detected for Leave ${leave.name}`);
        await runSlaAgent(leave,hoursElapsed.toFixed(1));
      }
    }
  } catch (err) {
    console.error("❌ SLA check error:", err.response?.data || err.message);
  }
});
