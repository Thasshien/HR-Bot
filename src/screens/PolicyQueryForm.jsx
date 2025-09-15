import React, { useState } from 'react';
import { Calendar, MessageSquare, Package, User, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";

const PolicyQueryForm = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!query) return;
        setLoading(true);
        setResponse('');
        console.log("User Query:", { query });
        try {
            const res = await axios.post('http://localhost:3000/api/ask/ask', { query });

            // Convert Rasa array to string
            const texts = Array.isArray(res.data.reply)
                ? res.data.reply.map(r => r.text).join(' ')
                : res.data.reply;

            setResponse(texts || 'No response received.');
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

export default PolicyQueryForm
