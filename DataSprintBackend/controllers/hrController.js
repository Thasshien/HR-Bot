const axios = require('axios');
const FRAPPE_URL = process.env.FRAPPE_URL;

const leaveRequests = async (req, res) => {
  try {
    const cookie = adminSid
    console.log("Using cookie:", cookie);

    const response = await axios.get(`${process.env.FRAPPE_URL}/api/resource/Leave Application`, {
      params: {
        filters: JSON.stringify([["status", "=", "Open"]]),
        fields: JSON.stringify(["name", "employee", "leave_type", "from_date", "to_date", "status", "creation"])
      },
      headers: { Cookie: cookie }
    });

    const leaves = response.data.data;
    res.status(200).json({ success: true, data: leaves });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching leave applications" });
  }
};

const leaveApprovedRequests = async (req, res) => {
  try {
    const cookie = adminSid;
    console.log("Using cookie:", cookie);

    const response = await axios.get(`${process.env.FRAPPE_URL}/api/resource/Leave Application`, {
      params: {
        filters: JSON.stringify([["status", "=", "Approved"]]),
        fields: JSON.stringify([
          "name",
          "employee",
          "leave_type",
          "from_date",
          "to_date",
          "status",
          "creation"
        ])
      },
      headers: { Cookie: cookie }
    });

    const leaves = response.data.data;
    res.status(200).json({ success: true, data: leaves });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching approved leave applications" });
  }
};

const assetMovements = async (req, res) => {
  try {
    const listRes = await axios.get(`${process.env.FRAPPE_URL}/api/resource/Asset Movement`, {
      params: { fields: JSON.stringify(["name"]) },
      headers: { Cookie: adminSid }
    });

    const movements = [];
    for (let m of listRes.data.data) {
      try {
        const docRes = await axios.get(`${process.env.FRAPPE_URL}/api/resource/Asset Movement/${encodeURIComponent(m.name)}`, {
          headers: { Cookie: adminSid }
        });
        movements.push(docRes.data.data);
      } catch (err) {
        console.error(`Failed to fetch ${m.name}:`, err.response?.data || err.message);
      }
    }

    res.json({ success: true, data: movements });
  } catch (err) {
    console.error("Error fetching asset movements:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Error fetching asset movements" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const response = await axios.get(`${FRAPPE_URL}/api/resource/Employee`, {
      params: {
        fields: JSON.stringify([
          "name",
          "employee",
          "first_name",
          "employee_name",
          "gender",
          "date_of_birth",
          "date_of_joining",
          "status",
          "company",
          "department",
          "employment_type",
          "designation",
          "branch",
          "date_of_retirement",
          "ctc",
          "salary_currency",
          "modified",
          "modified_by",
          "creation"
        ])
      },
      headers: { Cookie: adminSid }
    });

    const employees = response.data.data;
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching employee list" });
  }
};

module.exports = {leaveRequests , leaveApprovedRequests , assetMovements, getEmployees};