import React, { useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';

import axios from 'axios';
import { toast } from "react-toastify";

const EmpDashboard = ({setActiveSection}) => (
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

export default EmpDashboard
