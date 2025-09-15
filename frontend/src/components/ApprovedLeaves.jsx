import React from 'react'

const ApprovedLeaves = ({approvedLeaves}) => {
    return (
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
    )
}

export default ApprovedLeaves
