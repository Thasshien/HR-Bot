import React, { useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

const Employee = () => {
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

  const LeaveApplicationForm = () => (
    <div className="max-w-2xl mx-auto">
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
                value={formData.leaveType || ''}
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
                value={formData.duration || ''}
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
                value={formData.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.endDate || ''}
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
              value={formData.reason || ''}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact During Leave</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Emergency contact number"
              value={formData.contact || ''}
              onChange={(e) => handleInputChange('contact', e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('leave')}
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
  );

  const PolicyQueryForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <MessageSquare className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Policy Query</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Query Category</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="attendance">Attendance Policy</option>
              <option value="leave">Leave Policy</option>
              <option value="compensation">Compensation & Benefits</option>
              <option value="conduct">Code of Conduct</option>
              <option value="performance">Performance Management</option>
              <option value="training">Training & Development</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <div className="flex gap-4">
              {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                <label key={priority} className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.toLowerCase()}
                    checked={formData.priority === priority.toLowerCase()}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="mr-2 text-green-600"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    priority === 'Low' ? 'bg-green-100 text-green-800' :
                    priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Query Subject</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief subject of your query"
              value={formData.subject || ''}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Query</label>
            <textarea
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Please describe your policy-related question in detail..."
              value={formData.query || ''}
              onChange={(e) => handleInputChange('query', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Response Method</label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responseMethod"
                  value="email"
                  checked={formData.responseMethod === 'email'}
                  onChange={(e) => handleInputChange('responseMethod', e.target.value)}
                  className="mr-2 text-green-600"
                />
                Email
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responseMethod"
                  value="call"
                  checked={formData.responseMethod === 'call'}
                  onChange={(e) => handleInputChange('responseMethod', e.target.value)}
                  className="mr-2 text-green-600"
                />
                Phone Call
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responseMethod"
                  value="meeting"
                  checked={formData.responseMethod === 'meeting'}
                  onChange={(e) => handleInputChange('responseMethod', e.target.value)}
                  className="mr-2 text-green-600"
                />
                In-Person Meeting
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('policy')}
              disabled={submitStatus === 'submitting'}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Query'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AssetRequestForm = () => (
    <div className="max-w-2xl mx-auto">
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
                value={formData.assetCategory || ''}
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
                value={formData.requestType || ''}
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
              value={formData.assetDescription || ''}
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
                value={formData.requiredDate || ''}
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
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Justification</label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Please explain why this asset is needed for your work..."
              value={formData.justification || ''}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Specifications</label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any specific technical requirements or preferences..."
              value={formData.specifications || ''}
              onChange={(e) => handleInputChange('specifications', e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('asset')}
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