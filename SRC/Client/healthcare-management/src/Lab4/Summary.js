import React, { useState, useEffect } from 'react';
import { fetchSummary } from '../api';

function Summary() {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const loadSummary = async () => {
            try {
                if (!userId) {
                    throw new Error('User ID is not available in localStorage.');
                }
                const data = await fetchSummary(userId);
                setSummaries(data);
            } catch (err) {
                setError(err.message || 'Failed to load summary. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadSummary();
    }, [userId]);

    if (loading) {
        return (
            <div className="mt-8 text-gray-500 text-center">
                <p>Loading summary...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 bg-red-100 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    if (!summaries || summaries.length === 0) {
        return (
            <div className="mt-8 bg-yellow-100 text-yellow-700 p-4 rounded-lg">
                No summaries available for this patient.
            </div>
        );
    }

    return (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Patient Summary</h2>
            {summaries.map((summary, index) => (
                <div
                    key={index}
                    className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                        Record Date: {new Date(summary.date_of_record).toLocaleDateString()}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-700 font-medium">
                                <strong>Name:</strong> {summary.first_name} {summary.last_name}
                            </p>
                            <p className="text-gray-700">
                                <strong>Gender:</strong> {summary.gender}
                            </p>
                            <p className="text-gray-700">
                                <strong>Phone:</strong> {summary.phone}
                            </p>
                            <p className="text-gray-700">
                                <strong>Email:</strong> {summary.email}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700">
                                <strong>Diagnosis:</strong> {summary.diagnosis || 'N/A'}
                            </p>
                            <p className="text-gray-700">
                                <strong>Doctor:</strong> Dr. {summary.doctor_first_name || 'N/A'}{' '}
                                {summary.doctor_last_name || ''}
                            </p>
                            <p className="text-gray-700">
                                <strong>Billing:</strong> {summary.payment_status || 'N/A'} ($
                                {summary.total_amount || '0.00'})
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Summary;
