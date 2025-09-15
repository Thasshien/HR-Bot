
import React, { useContext, useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";
const LeaveApplicationForm = () => {
    const [formData, setFormData] = useState({
        leaveType: '',

        startDate: '',
        endDate: '',
        reason: '',
    });

    const [submitStatus, setSubmitStatus] = useState('idle');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitLeave = async () => {
        try {
            const email = localStorage.getItem("userEmail"); // send email for backend lookup
            const endpoint = formData.leaveType.toLowerCase() === "maternity leave"
                ? `${url}/apply-leave-maternity`
                : `${url}/apply-leave`;

            await axios.post(
                endpoint,
                { ...formData, email },
                { withCredentials: true } // sends Frappe session cookie
            );

            toast.success("Leave applied successfully!");
            setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });

        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data?.error || "Error applying leave.");
        }
    };




    return (
        <>

            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center mb-6">
                        <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Leave Application</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.leaveType}
                                    onChange={(e) => handleInputChange('leaveType', e.target.value)}
                                    required
                                >
                                    <option value="">Select Leave Type</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Holiday Fixed">Holiday Fixed</option>
                                    <option value="Holiday Floating">Holiday Floating</option>
                                    <option value="Maternity Leave">Maternity Leave</option>
                                </select>
                            </div>


                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
                            <textarea
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Please provide details about your leave request..."
                                value={formData.reason}
                                onChange={(e) => handleInputChange('reason', e.target.value)}
                                required
                            />
                        </div>



                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    leaveType: '',
                                    duration: '',
                                    startDate: '',
                                    endDate: '',
                                    reason: '',
                                    contact: ''
                                })}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitLeave}
                                disabled={submitStatus === 'submitting'}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeaveApplicationForm
