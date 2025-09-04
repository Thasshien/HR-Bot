const fetch = require("node-fetch");

// Replace with your Frappe Cloud API credentials
const API_KEY = process.env.FRAPPE_KEY;
const API_SECRET = process.env.FRAPPE_SECRET;
const BASE_URL = process.env.FRAPPE_URL;

// --- Demo Employees ---
const employees = [
  { employee_name: "John Doe", email: "john@example.com", department: "Engineering", role: "Employee" },
  { employee_name: "Jane Smith", email: "jane@example.com", department: "HR", role: "HR" }
];

// --- Demo Leave Applications ---
const leaves = [
  { employee: "John Doe", leave_type: "Casual Leave", from_date: "2025-09-10", to_date: "2025-09-12", status: "Approved" },
  { employee: "Jane Smith", leave_type: "Sick Leave", from_date: "2025-09-15", to_date: "2025-09-16", status: "Pending" }
];

// --- Demo Payroll ---
const payrolls = [
  { employee: "John Doe", salary_component: "Basic", amount: 50000, pay_period: "Sep 2025" },
  { employee: "Jane Smith", salary_component: "Basic", amount: 40000, pay_period: "Sep 2025" }
];

// Helper function to POST data
async function createRecord(docType, record) {
  const res = await fetch(`${BASE_URL}/api/resource/${docType}`, {
    method: "POST",
    headers: {
      "Authorization": `token ${API_KEY}:${API_SECRET}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(record)
  });
  const data = await res.json();
  console.log(`${docType} created:`, data);
}

// Run demo population
async function populateDemoData() {
  for (const emp of employees) {
    await createRecord("Employee", emp);
  }
  for (const leave of leaves) {
    await createRecord("Leave Application", leave);
  }
  for (const payroll of payrolls) {
    await createRecord("Salary Slip", payroll);
  }
  console.log("Demo data population complete!");
}

// Execute if run directly
if (require.main === module) {
  populateDemoData();
}

module.exports = populateDemoData;
