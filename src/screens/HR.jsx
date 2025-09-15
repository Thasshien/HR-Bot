import React, { useEffect, useState, useContext } from "react";
import { App_Context } from "../context/Context";
import axios from "axios"; // Uncomment this when using real API
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];


const SLA_HOURS = 48;

const HRDashboard = () => {
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
    { id: "open-leaves", label: "Open Leave Requests", icon: "📋" },
    { id: "approved-leaves", label: "Approved Leave Requests", icon: "✅" },
    { id: "asset-movement", label: "Asset Movement", icon: "📦" },
    { id: "analytics", label: "Analytics", icon: "📊" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === "open-leaves") {
          const response = await axios.get("http://localhost:3000/api/hr/leave-requests");
          console.log("open Leaves Response:", response.data);
          // Optional: calculate SLA hours left if needed
          const data = response.data.data.map(leave => {
            const createdAtUTC = new Date(leave.creation).getTime();
            const nowUTC = Date.now();
            const hoursElapsed = (nowUTC - createdAtUTC) / (1000 * 60 * 60);
            const hoursLeft = Math.max(SLA_HOURS - hoursElapsed, 0).toFixed(1);
            return {
              id: leave.name,
              employee: leave.employee,
              leaveType: leave.leave_type,   // map leave_type → leaveType
              fromDate: leave.from_date,     // map from_date → fromDate
              toDate: leave.to_date,         // map to_date → toDate
              status: leave.status,
              createdAt: leave.creation,     // map creation → createdAt
              hoursLeft,
            };
          });
          setLeaveApplications(data);

        } else if (activeTab === "approved-leaves") {
          const response = await axios.get("http://localhost:3000/api/hr/leave-approved-requests");
          console.log("Approved Leaves Response:", response.data);

          // Map API fields to camelCase
          const data = response.data.data.map(leave => ({
            id: leave.name,
            employee: leave.employee,
            leaveType: leave.leave_type,      // correct mapping
            fromDate: leave.from_date,        // correct mapping
            toDate: leave.to_date,            // correct mapping
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
            console.log(employees)
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

  const renderOpenLeaves = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Open Leave Applications</h2>
      <div className="grid gap-6">
        {leaveApplications.map((leave) => (
          <div key={leave.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{leave.employee}</h3>
                <p className="text-sm text-gray-500">Leave Type: {leave.leaveType}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Status: {leave.status}</div>
                <div className="text-sm text-gray-400">
                  Created at: {new Date(leave.createdAt).toLocaleString()}
                </div>
                <div className={`text-sm ${parseFloat(leave.hoursLeft) <= 24 ? 'text-red-500' : parseFloat(leave.hoursLeft) <= 36 ? 'text-yellow-500' : 'text-green-500'}`}>
                  Time until SLA breach: {leave.hoursLeft} hours
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900">From</div>
                <div className="text-lg font-semibold text-blue-900">{leave.fromDate}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-900">To</div>
                <div className="text-lg font-semibold text-green-900">{leave.toDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApprovedLeaves = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Approved Leave Requests</h2>
      <div className="grid gap-4">
        {approvedLeaves.map((leave) => (
          <div key={leave.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{leave.employee}</h3>
                <p className="text-sm text-gray-500">Leave Type: {leave.leaveType}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600 font-medium">✅ {leave.status}</div>
                <div className="text-sm text-gray-400">
                  Approved: {new Date(leave.approvedAt).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">By: {leave.approvedBy}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900">From</div>
                <div className="text-lg font-semibold text-blue-900">{leave.fromDate}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-900">To</div>
                <div className="text-lg font-semibold text-green-900">{leave.toDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const renderAssetMovement = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Asset Movement</h2>
      <div className="grid gap-4">
        {assetMovements.length > 0 ? (
          assetMovements.map((asset, index) => (
            <div key={asset.name || index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Asset ID: {asset.asset_id || asset.name}</h3>
                </div>

              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-900">Reference Doctype</div>
                  <div className="text-lg font-semibold text-orange-900">{asset.reference_doctype || "N/A"}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-900">Reference Name</div>
                  <div className="text-lg font-semibold text-purple-900">{asset.reference_name || "N/A"}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-900">Transaction Date</div>
                  <div className="text-lg font-semibold text-blue-900">
                    {asset.transaction_date ? new Date(asset.transaction_date).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No asset movements found</p>
          </div>
        )}
      </div>
    </div>
  );



  const renderAnalytics = () => {
    const departmentData = getDepartmentDistribution();
    const genderData = getGenderDistribution();
    const empTypeData = getEmploymentTypeDistribution();
    const salaryData = getSalaryDistribution();
    const ageData = getAgeDistribution();

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Analytics Dashboard</h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Employees</h3>
            <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Employees</h3>
            <p className="text-3xl font-bold text-green-600">
              {employees.filter(emp => emp.status === "Active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Avg. CTC (L)</h3>
            <p className="text-3xl font-bold text-purple-600">
              {employees.length > 0 ? (employees.reduce((sum, emp) => sum + emp.ctc, 0) / employees.length).toFixed(1) : 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Departments</h3>
            <p className="text-3xl font-bold text-orange-600">
              {new Set(employees.map(emp => emp.department)).size}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Department Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Employment Type Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={empTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {empTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>



          {/* Leave Statistics */}

        </div>

        {/* Employee Details Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CTC (L)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={employee.employee} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.employee_name}</div>
                      <div className="text-sm text-gray-500">{employee.employee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{employee.ctc}L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.employment_type === 'Full-time'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {employee.employment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8"><p>Loading...</p></div>;
    if (error) return <div className="text-center py-8"><p className="text-red-500">{error}</p></div>;

    switch (activeTab) {
      case "open-leaves":
        return renderOpenLeaves();
      case "approved-leaves":
        return renderApprovedLeaves();
      case "asset-movement":
        return renderAssetMovement();
      case "analytics":
        return renderAnalytics();
      default:
        return renderOpenLeaves();
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