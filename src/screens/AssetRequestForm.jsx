import React, { useContext, useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";

const AssetRequestForm = () => {
    const [formData, setFormData] = useState({
        assetCategory: '',
        requiredDate: '',
        returnDate: ''
    });

    const [submitStatus, setSubmitStatus] = useState('idle'); // idle | submitting

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleSubmitasset = async () => {
        setSubmitStatus("submitting");
        try {
            const email = localStorage.getItem("userEmail"); // get saved email
            const payload = { ...formData, email };

            console.log("Submitting asset request:", payload);

            const response = await axios.post(
                "http://localhost:3000/request-asset",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // ✅ Success toast
            toast.success("Asset request submitted successfully!");
            console.log("Response:", response.data);
            setFormData({ assetCategory: '', requiredDate: '', returnDate: '' });
        } catch (error) {
            console.error("Error submitting request:", error);

            // ✅ Error toast
            const message =
                error.response?.data?.error || "Error submitting asset request.";
            toast.error(message);
        } finally {
            setSubmitStatus("idle");
        }
    };



    return (
        <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                    <Package className="w-6 h-6 text-purple-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Asset Request</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Asset Category</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={formData.assetCategory}
                            onChange={(e) => handleInputChange('assetCategory', e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Dell Laptop Power Cord">Dell Laptop Power Cord</option>
                            <option value="Samsung Smartphone">Samsung Smartphone</option>
                            <option value="Logitech Wireless Mouse">Logitech Wireless Mouse
                            </option>
                            <option value="Laptop-Dell-123">Laptop-Dell-123</option>
                            <option value="Logitech Headset">Logitech Headset
                            </option>
                            <option value="software">Software License</option>

                        </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Required Date</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={formData.requiredDate}
                                onChange={(e) => handleInputChange('requiredDate', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={formData.returnDate}
                                onChange={(e) => handleInputChange('returnDate', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => console.log('Cancel pressed')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmitasset}
                            disabled={submitStatus === 'submitting'}
                            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetRequestForm
