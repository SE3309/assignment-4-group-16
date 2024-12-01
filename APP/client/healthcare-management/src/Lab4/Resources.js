import React, { useState } from 'react';
import { fetchResources } from '../api';

function Resources() {
    const [departmentId, setDepartmentId] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetch = async () => {
        if (!departmentId) {
            setError('Please enter a valid Department ID.');
            setResources([]);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await fetchResources(departmentId);
            if (data.length === 0) {
                setError('No resources found for this department.');
            }
            setResources(data);
        } catch (err) {
            setError('Failed to fetch resources. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Available Resources</h2>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Department ID</label>
                <input
                    type="text"
                    placeholder="Enter Department ID"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                />
            </div>
            <button
                className="mt-4 bg-red-600 text-white font-bold py-3 px-6 rounded-lg w-full hover:bg-red-700 transition shadow-lg"
                onClick={handleFetch}
                disabled={loading}
            >
                {loading ? 'Fetching...' : 'Fetch Resources'}
            </button>
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
                    {error}
                </div>
            )}
            {resources.length > 0 && !error && (
                <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg mt-4">
                    {resources.map((resource) => (
                        <li
                            key={resource.resource_id}
                            className="p-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex justify-between">
                                <p className="text-gray-700 font-medium">{resource.resource_name}</p>
                                <p className="text-sm text-gray-500">{resource.resource_type}</p>
                            </div>
                            <p className="text-sm text-gray-500">Status: {resource.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Resources;
