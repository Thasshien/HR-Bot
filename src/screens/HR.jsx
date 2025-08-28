import React, { useState,useContext } from 'react';
import { Calendar, Package, Users, CheckCircle, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { App_Context } from '../context/Context';
const HR = () => {
  const {signout}= useContext(App_Context);
  const [activeTab, setActiveTab] = useState('leave-requests');
const navigate = useNavigate();

  // Static JSON data
  const leaveRequests = [
    {
      id: 1,
      name: 'John Doe',
      empId: 'EMP001',
      leaveType: 'Annual Leave',
      startDate: '2025-09-15',
      endDate: '2025-09-20',
      status: 'pending',
      reason: 'Family vacation'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      empId: 'EMP002',
      leaveType: 'Sick Leave',
      startDate: '2025-08-30',
      endDate: '2025-08-30',
      status: 'approved',
      reason: 'Medical appointment'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      empId: 'EMP003',
      leaveType: 'Emergency Leave',
      startDate: '2025-08-29',
      endDate: '2025-08-29',
      status: 'rejected',
      reason: 'Family emergency'
    }
  ];

  const assetRequests = [
    {
      id: 1,
      name: 'Alice Brown',
      empId: 'EMP004',
      asset: 'MacBook Pro 14-inch',
      category: 'Laptop',
      budget: '₹1,50,000',
      status: 'pending'
    },
    {
      id: 2,
      name: 'David Chen',
      empId: 'EMP005',
      asset: '27-inch 4K Monitor',
      category: 'Monitor',
      budget: '₹35,000',
      status: 'approved'
    }
  ];

  const leaveBalances = [
    {
      id: 1,
      name: 'John Doe',
      empId: 'EMP001',
      totalLeave: 24,
      usedLeave: 8,
      remainingLeave: 16
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      empId: 'EMP002',
      totalLeave: 24,
      usedLeave: 12,
      remainingLeave: 12
    },
    {
      id: 3,
      name: 'Mike Johnson',
      empId: 'EMP003',
      totalLeave: 24,
      usedLeave: 18,
      remainingLeave: 6
    },
    {
      id: 4,
      name: 'Alice Brown',
      empId: 'EMP004',
      totalLeave: 24,
      usedLeave: 4,
      remainingLeave: 20
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm flex justify-evenly items-center">
        <div className="max-w-7xl  px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600">Manage employee requests and leave balances</p>
          
        </div>
         <div>
              <button className='bg-slate-300 p-3 rounded-3xl hover:bg-slate-400 mx-4' onClick={()=>signout()}>Sign Out</button>
            </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('leave-requests')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'leave-requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('asset-requests')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'asset-requests'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Asset Requests
            </button>
            <button
              onClick={() => setActiveTab('leave-balances')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'leave-balances'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Leave Balances
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8">
          {/* Leave Requests Tab */}
          {activeTab === 'leave-requests' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Leave Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{request.name}</div>
                          <div className="text-sm text-gray-500">{request.empId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.leaveType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.startDate} to {request.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button className="text-green-600 hover:text-green-900">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Asset Requests Tab */}
          {activeTab === 'asset-requests' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Asset Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assetRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{request.name}</div>
                          <div className="text-sm text-gray-500">{request.empId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.asset}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {request.budget}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-purple-600 hover:text-purple-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button className="text-green-600 hover:text-green-900">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leave Balances Tab */}
          {activeTab === 'leave-balances' && (
            <div className="grid gap-6">
              {leaveBalances.map((employee) => (
                <div key={employee.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.empId}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{employee.remainingLeave}</div>
                      <div className="text-sm text-gray-500">Days Left</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-semibold text-blue-900">{employee.totalLeave}</div>
                      <div className="text-sm text-blue-600">Total Leave</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-xl font-semibold text-red-900">{employee.usedLeave}</div>
                      <div className="text-sm text-red-600">Used Leave</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-semibold text-green-900">{employee.remainingLeave}</div>
                      <div className="text-sm text-green-600">Remaining</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2 transition-all duration-300"
                        style={{width: `${(employee.remainingLeave / employee.totalLeave) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );                                                                                                                                                            Q
};

export default HR;