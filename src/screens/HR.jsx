import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import OpenLeaves from "../components/OpenLeaves";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
import ApprovedLeaves from "../components/ApprovedLeaves";
import AssetManagement from "../components/AssetManagement";
import Analytics from "../components/Analytics";
const SLA_HOURS = 48;

const HRDashboard = () => {
  const [jsonData, setJsonData] = useState([]);
  const [activeTab, setActiveTab] = useState("open-leaves");
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [assetMovements, setAssetMovements] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setemployees] = useState([])
  const { signout } = useContext(App_Context);

  const getDepartmentDistribution = () => {
    const deptCount = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(deptCount).map(([department, count]) => ({
      department,
      count,
      name: department
    }));
  };

  const getGenderDistribution = () => {
    const genderCount = employees.reduce((acc, emp) => {
      acc[emp.gender] = (acc[emp.gender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genderCount).map(([gender, value]) => ({
      name: gender,
      value
    }));
  };

  const getEmploymentTypeDistribution = () => {
    const empTypeCount = employees.reduce((acc, emp) => {
      acc[emp.employment_type] = (acc[emp.employment_type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(empTypeCount).map(([type, value]) => ({
      name: type,
      value
    }));
  };

  const getSalaryDistribution = () => {
    const salaryRanges = {
      "20-25L": 0,
      "25-30L": 0,
      "30-35L": 0,
      "35L+": 0
    };

    employees.forEach(emp => {
      const ctc = emp.ctc;
      if (ctc >= 20 && ctc < 25) salaryRanges["20-25L"]++;
      else if (ctc >= 25 && ctc < 30) salaryRanges["25-30L"]++;
      else if (ctc >= 30 && ctc < 35) salaryRanges["30-35L"]++;
      else if (ctc >= 35) salaryRanges["35L+"]++;
    });

    return Object.entries(salaryRanges).map(([range, count]) => ({
      range,
      count
    }));
  };

  const getAgeDistribution = () => {
    const ageRanges = {
      "20-25": 0,
      "26-30": 0,
      "31-35": 0,
      "35+": 0
    };

    employees.forEach(emp => {
      const birthYear = new Date(emp.date_of_birth).getFullYear();
      const age = new Date().getFullYear() - birthYear;

      if (age >= 20 && age <= 25) ageRanges["20-25"]++;
      else if (age >= 26 && age <= 30) ageRanges["26-30"]++;
      else if (age >= 31 && age <= 35) ageRanges["31-35"]++;
      else if (age > 35) ageRanges["35+"]++;
    });

    return Object.entries(ageRanges).map(([range, count]) => ({
      range,
      count
    }));
  };
  const tabs = [
    { id: "open-leaves", label: "Open Leave Requests", icon: "" },
    { id: "approved-leaves", label: "Approved Leave Requests", icon: "" },
    { id: "asset-movement", label: "Asset Movement", icon: "" },
    { id: "analytics", label: "Analytics", icon: "" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === "open-leaves") {
          const response = await axios.get("http://localhost:3000/api/hr/leave-requests");
          console.log("open Leaves Response:", response.data);
          const data = response.data.data.map(leave => {
            const createdAtUTC = new Date(leave.creation).getTime();
            const nowUTC = Date.now();
            const hoursElapsed = (nowUTC - createdAtUTC) / (1000 * 60 * 60);
            const hoursLeft = Math.max(SLA_HOURS - hoursElapsed, 0).toFixed(1);
            return {
              id: leave.name,
              employee: leave.employee,
              leaveType: leave.leave_type,
              fromDate: leave.from_date,
              toDate: leave.to_date,
              status: leave.status,
              createdAt: leave.creation,
              hoursLeft,
            };
          });
          setLeaveApplications(data);

        } else if (activeTab === "approved-leaves") {
          const response = await axios.get("http://localhost:3000/api/hr/leave-approved-requests");
          console.log("Approved Leaves Response:", response.data);

          const data = response.data.data.map(leave => ({
            id: leave.name,
            employee: leave.employee,
            leaveType: leave.leave_type,
            fromDate: leave.from_date,
            toDate: leave.to_date,
            status: leave.status,
            approvedAt: leave.modified || leave.creation,
            approvedBy: leave.modified_by || "System"
          }));

          setApprovedLeaves(data);
        } else if (activeTab === "asset-movement") {
          const response = await axios.get("http://localhost:3000/api/hr/asset-movements");
          console.log("Asset Movements Response:", response.data);
          setAssetMovements(response.data.data);
          console.log(response.data)

        } else if (activeTab === "analytics") {
          try {
            const [leavesResponse, assetsResponse, employeesResponse] = await Promise.all([
              axios.get("http://localhost:3000/api/hr/leave-requests"),
              axios.get("http://localhost:3000/api/hr/asset-movements"),
              axios.get("http://localhost:3000/api/hr/get-employees"),
            ]);

            const leaves = leavesResponse.data.data;
            const assets = assetsResponse.data.data;
            setemployees(employeesResponse.data.data);
            setAnalytics({
              totalLeaves: leaves.length,
              openLeaves: leaves.filter(l => l.status === "Open").length,
              approvedLeaves: leaves.filter(l => l.status === "Approved").length,
              rejectedLeaves: leaves.filter(l => l.status === "Rejected").length,
              totalAssetMovements: assets.length,
              pendingAssetMovements: assets.filter(a => a.status === "Pending").length,
              completedAssetMovements: assets.filter(a => a.status === "Completed").length,
              totalEmployees: employees.length,
              activeEmployees: employees.filter(e => e.status === "Active").length,
              inactiveEmployees: employees.filter(e => e.status !== "Active").length,
              employeesData: employees // full employee details for further use in frontend
            });
          } catch (err) {
            console.error("Error fetching analytics data:", err);
            setError("Failed to fetch analytics data");
          }
        }


      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <div className="text-center py-8"><p>Loading...</p></div>;
    if (error) return <div className="text-center py-8"><p className="text-red-500">{error}</p></div>;

    switch (activeTab) {
      case "open-leaves":
        return <OpenLeaves leaveApplications={leaveApplications} />;
      case "approved-leaves":
        return <ApprovedLeaves approvedLeaves={approvedLeaves} />
      case "asset-movement":
        return <AssetManagement assetMovements={assetMovements} />
      case "analytics":
        const departmentData = getDepartmentDistribution();
        const genderData = getGenderDistribution();
        const empTypeData = getEmploymentTypeDistribution();
        const salaryData = getSalaryDistribution();
        const ageData = getAgeDistribution();
        return <Analytics ageData={ageData} salaryData={salaryData} empTypeData={empTypeData} genderData={genderData} departmentData={departmentData} employees={employees} />
      default:
        return <OpenLeaves leaveApplications={leaveApplications} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-4">
          <p className="text-3xl font-bold text-gray-900 text-center flex-1">
            HR Dashboard
          </p>
          <div>
            <button
              className="bg-slate-300 p-3 rounded-3xl hover:bg-slate-400"
              onClick={() => signout()}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex space-x-0 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors duration-200 ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;