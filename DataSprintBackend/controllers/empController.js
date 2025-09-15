const axios = require('axios')
require("dotenv").config();
const FRAPPE_URL = process.env.FRAPPE_URL;

 const leaveReq = async (req, res) => {
    try {
      // Use admin/service SID stored in backend
       console.log("in the leave req backend")
      const { email, leaveType, startDate, endDate, reason } = req.body;
      const cookies = global.adminSid;
      console.log(cookies)
      if (!cookies) return res.status(500).json({ error: "Admin session not initialized" });

      //Fetch Employee by email
      const empResp = await axios.get(`${FRAPPE_URL}/api/resource/Employee`, {
        params: { filters: JSON.stringify([["user_id", "=", email]]) },
        headers: { Cookie: cookies }
      });

      const employee = empResp.data.data[0];
      if (!employee) return res.status(400).json({ error: "Employee not found" });

      //Fetch Leave Allocation names for this employee
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

      //Fetch full allocation details to get restricted fields like leaves_taken
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

      //Calculate requested days
      const totalAllocated = allocation.total_leaves_allocated;
      const leavesTaken = allocation.leaves_taken || 0;
      const requestedDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

      if (requestedDays > (totalAllocated - leavesTaken)) {
        return res.status(400).json({ error: "Not enough leave balance" });
      }

      //Create Leave Application
      const leaveAppResp = await axios.post(`${FRAPPE_URL}/api/resource/Leave Application`, {
        employee: employee.name,
        leave_type: allocation.leave_type,
        from_date: startDate,
        to_date: endDate,
        reason,
        leave_approver: process.env.ADMIN_EMAIL,
        status: "Approved",
        docstatus: 1
      }, { headers: { Cookie: cookies } });

      //Update leaves_taken in allocation
      await axios.put(`${FRAPPE_URL}/api/resource/Leave Allocation/${allocation.name}`, {
        leaves_taken: leavesTaken + requestedDays
      }, { headers: { Cookie: cookies } });

      res.status(200).json({ message: "Leave applied successfully", leave: leaveAppResp.data });

  } 
  catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Error applying leave" });
  }
};


const maternityLeaveReq =  async (req, res) => {
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
      console.log("Leave data", leaveData)
      console.log("Submitted", submittedAt)
      res.json({
        message: "Leave application created as draft",
        leave: leaveData,
        submittedAt
      });

    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).json({ error: "Error creating leave application" });
    }
};

const reqAsset = async (req, res) => {
    const { email, assetCategory, requiredDate, returnDate } = req.body;
    console.log("Received asset request:", req.body);

    if (!email || !assetCategory || !requiredDate || !returnDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const cookies = global.adminSid;
      if (!cookies) return res.status(500).json({ error: "Admin session not initialized" });

      // Fetch employee by email
      const empResp = await axios.get(`${FRAPPE_URL}/api/resource/Employee`, {
        params: { filters: JSON.stringify([["user_id", "=", email]]) },
        headers: { Cookie: cookies }
      });
      const employee = empResp.data.data[0];
      if (!employee) return res.status(400).json({ error: "Employee not found" });
      console.log("Fetched employee:", employee);

      //Fetch submitted assets
      const assetListResp = await axios.get(`${FRAPPE_URL}/api/resource/Asset`, {
        params: { filters: JSON.stringify([["status", "=", "Submitted"]]) },
        headers: { Cookie: cookies }
      });
      const assetNames = assetListResp.data.data.map(a => a.name);
      if (!assetNames.length) return res.status(400).json({ error: "No submitted assets found" });
      console.log("Submitted asset names:", assetNames);

      //Fetch full asset details and filter by category
      const detailedAssets = await Promise.all(
        assetNames.map(async name => {
          const detailResp = await axios.get(`${FRAPPE_URL}/api/resource/Asset/${name}`, {
            headers: { Cookie: cookies }
          });
          return detailResp.data.data;
        })
      );
      const matchingAssets = detailedAssets.filter(a =>
        a.item_name?.toLowerCase() === assetCategory.toLowerCase()
      );
      if (!matchingAssets.length) {
        return res.status(400).json({ error: "No submitted assets in this category" });
      }
      const asset = matchingAssets[0];

      //Create Asset Movement
      const movementPayload = {
        purpose: "Issue",
        transaction_date: new Date(requiredDate).toISOString().split('.')[0],
        assets: [
          {
            asset: asset.name,
            to_employee: employee.name, // To Employee (mandatory)
            from_location: "Office",
            to_location: "Office1"
          }
        ],
        remarks: "Automated asset request via portal"
      };
      console.log("Movement payload:", JSON.stringify(movementPayload, null, 2));

      const movementResp = await axios.post(`${FRAPPE_URL}/api/resource/Asset Movement`, movementPayload, {
        headers: { Cookie: cookies }
      });
      console.log("Created Asset Movement:", movementResp.data);

      //Fetch updated asset details to include in response
      const updatedAsset = await axios.get(`${FRAPPE_URL}/api/resource/Asset/${asset.name}`, {
        headers: { Cookie: cookies }
      });

      //Send proper JSON response
      res.status(200).json({
        message: "Asset issued successfully",
        assetMovement: movementResp.data,
        asset: updatedAsset.data.data,
        employee: employee
      });

    } catch (err) {
      console.error("Error in /request-asset:", err.response?.data || err.message);
      res.status(500).json({ error: err.response?.data?.message || "Error processing asset request" });
    }
};

module.exports = { leaveReq , maternityLeaveReq , reqAsset};