import React from 'react'

const OpenLeaves = ({leaveApplications}) => {
    return (
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
    )
}

export default OpenLeaves
