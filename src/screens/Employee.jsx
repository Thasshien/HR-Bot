import React, { useContext, useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { App_Context } from '../context/Context';
const Employee = () => {
  const { signout}= useContext(App_Context);
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

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    duration: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitStatus('submitting');
    try {
      // Make your API call here
      console.log('Submitting leave application:', formData);
    toast.success("Leave application submitted!"); 
      // Simulate API delay
      await new Promise(res => setTimeout(res, 1000));
      // alert('Leave application submitted successfully!');
      setFormData({
        leaveType: '',
        duration: '',
        startDate: '',
        endDate: '',
        reason: '',
  
      });
    } catch (error) {
      console.error(error);
      alert('Error submitting leave application.');
    } finally {
      setSubmitStatus('idle');
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
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                required
              >
                <option value="">Select Duration</option>
                <option value="half-day">Half Day</option>
                <option value="full-day">Full Day</option>
                <option value="multiple-days">Multiple Days</option>
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
              onClick={handleSubmit}
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

const PolicyQueryForm = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!query) return;
    setLoading(true);
    setResponse('');
    console.log("User Query:",{query});
     try {
      // Replace this with your LLM API call
      
      const res = await axios.post('http://localhost:3000/api/ask/ask',{ query });
      setResponse(res.data.reply || 'No response received.');
    } catch (error) {
      console.error(error);
      setResponse('Error fetching response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ask a Queries to the PolicyBot </h2>
        
        <textarea
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
          placeholder="Here to solve all your HR policy questions! Ask me anything about leave policies, benefits, workplace guidelines, and more. I'm here to help you navigate company policies with ease...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {response && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Response:</h3>
            <p className="text-gray-800 whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};


 const AssetRequestForm = () => {
  const [formData, setFormData] = useState({
    assetCategory: '',
    requestType: '',
    assetDescription: '',
    requiredDate: '',
    budget: '',
    justification: '',
    specifications: ''
  });

  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | submitting

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitStatus('submitting');
    try {
      console.log('Submitting asset request:', formData);
      // call your backend API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate async
      alert('Asset request submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting request.');
    } finally {
      setSubmitStatus('idle');
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
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.assetCategory}
                onChange={(e) => handleInputChange('assetCategory', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="laptop">Laptop/Computer</option>
                <option value="mobile">Mobile Phone</option>
                <option value="monitor">Monitor/Display</option>
                <option value="accessories">Accessories</option>
                <option value="furniture">Furniture</option>
                <option value="software">Software License</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="new">New Asset</option>
                <option value="replacement">Replacement</option>
                <option value="upgrade">Upgrade</option>
                <option value="repair">Repair/Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Description</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Specific model, brand, or detailed description"
              value={formData.assetDescription}
              onChange={(e) => handleInputChange('assetDescription', e.target.value)}
              required
            />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="₹ (if known)"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>
          </div>

         

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Info</label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any specific technical requirements or preferences..."
              value={formData.specifications}
              onChange={(e) => handleInputChange('specifications', e.target.value)}
            />
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
              onClick={handleSubmit}
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

  const Dashboard = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">Employee Portal</h1>
        </div>
        <p className="text-xl text-gray-600">Welcome back! What would you like to do today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div 
          onClick={() => setActiveSection('leave')}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
        >
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Apply for Leave</h3>
            <p className="text-gray-600 mb-6">Submit your leave application to HR for approval</p>
            <div className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-block font-medium">
              Get Started
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveSection('policy')}
          className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
        >
          <div className="text-center">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Policy Query</h3>
            <p className="text-gray-600 mb-6">Ask questions about company policies and procedures</p>
            <div className="bg-green-600 text-white px-6 py-2 rounded-lg inline-block font-medium">
              Ask Question
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveSection('asset')}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
        >
          <div className="text-center">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Asset Request</h3>
            <p className="text-gray-600 mb-6">Request new assets or equipment for your work</p>
            <div className="bg-purple-600 text-white px-6 py-2 rounded-lg inline-block font-medium">
              Make Request
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            <div className="text-sm text-gray-600">
              Welcome, John Doe
            </div>
            <div>
              <button className='bg-slate-300 p-3 rounded-3xl hover:bg-slate-400' onClick={()=>signout()}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {activeSection === 'dashboard' && <Dashboard />}
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