import React, { useContext, useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { App_Context } from '../context/Context';
import LeaveApplicationForm from './LeaveApplicationForm';
import AssetRequestForm from './AssetRequestForm';
import PolicyQueryForm from './PolicyQueryForm';
import EmpDashboard from './EmpDashboard';
const Employee = () => {
  const { signout } = useContext(App_Context);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const url = 'http://localhost:3000'; // frappe usually runs on 8000
  const handleSubmit = async (formType) => {
    // Simulate API call
    setSubmitStatus('submitting');
    setTimeout(() => {
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({});
        setActiveSection('dashboard');
      }, 2000);
    }, 1000);
  };

  
  const SuccessMessage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
        <p className="text-gray-600">Your request has been submitted successfully. You will receive a confirmation email shortly.</p>
      </div>
    </div>
  );

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {activeSection !== 'dashboard' && (
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center">
                <User className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-xl font-semibold text-gray-800">Employee Portal</span>
              </div>
            </div>

            <div>
              <button className='bg-slate-300 p-3 rounded-3xl hover:bg-slate-400' onClick={() => signout()}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {activeSection === 'dashboard' && <EmpDashboard setActiveSection={setActiveSection}/>}
        {activeSection === 'leave' && <LeaveApplicationForm />}
        {activeSection === 'policy' && <PolicyQueryForm />}
        {activeSection === 'asset' && <AssetRequestForm />}
      </div>

      {/* Success Modal */}
      {submitStatus === 'success' && <SuccessMessage />}
    </div>
  );
};


export default Employee;