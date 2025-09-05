const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // frontend
  credentials: true
}));

const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const port = process.env.PORT || 3000;
const populateDemoData = require("./populateDemoData");
const axios = require("axios")
connectDB();
 //for sla monitoring (auto starts)
// existing routes
app.use('/api/emp', require('./routes/empRouter'));
app.use('/api/hr', require('./routes/hrRouter'));
app.use('/api/ask', require('./routes/rasaRouter'));
app.use('/api/requests', require('./routes/requestRouter'));
// test route
app.get("/", (req, res) => {
  res.send("API Working");
});
const FRAPPE_URL = process.env.FRAPPE_URL; // set this in .env
const API_KEY = process.env.FRAPPE_KEY;
const API_SECRET = process.env.FRAPPE_SECRET;
const loginAdmin = async () => {
  try {
    const response = await axios.get(`${process.env.FRAPPE_URL}/api/resource/Leave Application`, {
    auth: {
      username: process.env.FRAPPE_KEY,
      password: process.env.FRAPPE_SECRET
    }
  });
    const sidCookie = response.headers['set-cookie'].find(c => c.startsWith('sid='));
    console.log("sidCookie: ",sidCookie)
    global.adminSid = sidCookie.split(';')[0];
    console.log(adminSid)
    console.log("Admin logged in, sid stored!");
  } catch (err) {
    console.error("Admin login failed:", err.response?.data || err.message);
  }
};

// Call it once when server starts
loginAdmin();
require('./agents/slaChecker');
// Endpoint to fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const response = await axios.get(`${FRAPPE_URL}/api/method/frappe.client.get_list`, {
      auth: {
        username: API_KEY,
        password: API_SECRET
      },
      params: {
        doctype: "Employee",
        fields: ["name", "employee_name", "department"], // adjust fields as needed
        limit_page_length: 100
      }
    });

    res.json(response.data.message); // message contains list of employees
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch employees" });
  }
})
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Attempt login on Frappe to verify credentials
    const response = await axios.post(`${FRAPPE_URL}/api/method/login`, {
      usr: email,
      pwd: password
    });

    // If login succeeds, just return success (no sid stored)
    res.json({ message: "Login successful", user: { email } });

  } catch (err) {
    // Login failed
    res.status(401).json({ error: "Invalid email or password" });
  }
});



app.post("/apply-leave", async (req, res) => {
  const { email, leaveType, startDate, endDate, reason } = req.body;

  try {
    // 🔹 Use admin/service SID stored in backend
    const cookies = global.adminSid;
    if (!cookies) return res.status(500).json({ error: "Admin session not initialized" });

    // 1️⃣ Fetch Employee by email
    const empResp = await axios.get(`${FRAPPE_URL}/api/resource/Employee`, {
      params: { filters: JSON.stringify([["user_id", "=", email]]) },
      headers: { Cookie: cookies }
    });

    const employee = empResp.data.data[0];
    if (!employee) return res.status(400).json({ error: "Employee not found" });

    // 2️⃣ Fetch Leave Allocation names for this employee
    const allocationListResp = await axios.get(`${FRAPPE_URL}/api/method/frappe.client.get_list`, {
      params: {
        doctype: "Leave Allocation",
        filters: JSON.stringify([["employee", "=", employee.name]]),
        fields: JSON.stringify(["name", "leave_type", "total_leaves_allocated"]) // safe fields
      },
      headers: { Cookie: cookies }
    });

    const allocations = allocationListResp.data.message;
    if (!allocations || allocations.length === 0) {
      return res.status(400).json({ error: "No leave allocations found for employee" });
    }

    // 3️⃣ Fetch full allocation details to get restricted fields like leaves_taken
    const allocationDetails = await Promise.all(
      allocations.map(async a => {
        const detailResp = await axios.get(`${FRAPPE_URL}/api/resource/Leave Allocation/${a.name}`, {
          headers: { Cookie: cookies }
        });
        return detailResp.data.data;
      })
    );

    // 4️⃣ Find allocation matching requested leave type (case-insensitive)
    const allocation = allocationDetails.find(
      a => a.leave_type && a.leave_type.toLowerCase() === leaveType.toLowerCase()
    );

    if (!allocation) return res.status(400).json({ error: "Leave type not allocated for employee" });

    // 5️⃣ Calculate requested days
    const totalAllocated = allocation.total_leaves_allocated;
    const leavesTaken = allocation.leaves_taken || 0;
    const requestedDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    if (requestedDays > (totalAllocated - leavesTaken)) {
      return res.status(400).json({ error: "Not enough leave balance" });
    }

    // 6️⃣ Create Leave Application
    const leaveAppResp = await axios.post(`${FRAPPE_URL}/api/resource/Leave Application`, {
      employee: employee.name,
      leave_type: allocation.leave_type,
      from_date: startDate,
      to_date: endDate,
      reason,
      leave_approver:process.env.ADMIN_EMAIL , 
      status: "Approved",
      docstatus: 1  
    }, { headers: { Cookie: cookies } });

    // 7️⃣ Update leaves_taken in allocation
    await axios.put(`${FRAPPE_URL}/api/resource/Leave Allocation/${allocation.name}`, {
      leaves_taken: leavesTaken + requestedDays
    }, { headers: { Cookie: cookies } });

    res.json({ message: "Leave applied successfully", leave: leaveAppResp.data });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Error applying leave" });
  }
});

app.post("/apply-leave-maternity", async (req, res) => {
  const { email, leaveType, startDate, endDate, reason } = req.body;

  try {
    const cookies = global.adminSid;
    if (!cookies) return res.status(500).json({ error: "Admin session not initialized" });

    // 1️⃣ Fetch Employee by email
    const empResp = await axios.get(`${FRAPPE_URL}/api/resource/Employee`, {
      params: { filters: JSON.stringify([["user_id", "=", email]]) },
      headers: { Cookie: cookies }
    });
    const employee = empResp.data.data[0];
    if (!employee) return res.status(400).json({ error: "Employee not found" });

    // 2️⃣ Create Leave Application as draft (not submitted)
    const leaveAppResp = await axios.post(`${FRAPPE_URL}/api/resource/Leave Application`, {
      employee: employee.name,
      leave_type: leaveType,
      from_date: startDate,
      to_date: endDate,
      reason,
      leave_approver: process.env.ADMIN_EMAIL, 
      status: "Open",  // Pending review
      docstatus: 0      // Draft
    }, { headers: { Cookie: cookies } });

    // 3️⃣ Capture creation timestamp
    const leaveData = leaveAppResp.data.data; // contains 'creation' field
    const submittedAt = leaveData.creation;
    console.log("Leave data",leaveData)
    console.log("Submitted at",submittedAt)
    res.json({  
      message: "Leave application created as draft", 
      leave: leaveData,
      submittedAt 
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Error creating leave application" });
  }
});



app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});