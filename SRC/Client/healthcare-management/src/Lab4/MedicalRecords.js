import React, { useState } from 'react';
import { fetchMedicalRecords, updateMedicalRecord, deleteMedicalRecord } from '../api';

function MedicalRecords() {
    const [patientId, setPatientId] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFetchRecords = async () => {
        if (!patientId) {
            setError('Patient ID is required.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = await fetchMedicalRecords(patientId);
            setRecords(data);
            if (data.length === 0) {
                setError('No medical records found for this patient.');
            }
        } catch (err) {
            setError('Failed to fetch medical records. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        const diagnosis = prompt('Enter new diagnosis:');
        const dateOfRecord = prompt('Enter new date (YYYY-MM-DD):');

        if (!diagnosis || !dateOfRecord) {
            setError('Both diagnosis and date are required.');
            return;
        }

        try {
            await updateMedicalRecord(id, diagnosis, dateOfRecord);
            setSuccess('Medical record updated successfully.');
            setError('');
            setRecords((prev) =>
                prev.map((record) =>
                    record.record_id === id
                        ? { ...record, diagnosis, date_of_record: dateOfRecord }
                        : record
                )
            );
        } catch (err) {
            setError('Failed to update the medical record.');
            setSuccess('');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMedicalRecord(id);
            setRecords((prev) => prev.filter((record) => record.record_id !== id));
            setSuccess('Medical record deleted successfully.');
            setError('');
        } catch (err) {
            setError('Failed to delete the medical record.');
            setSuccess('');
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Medical Records</h2>
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                    Enter Patient ID to Fetch Records
                </label>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                        placeholder="Patient ID"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        onClick={handleFetchRecords}
                    >
                        Fetch Records
                    </button>
                </div>
            </div>
            {loading && <p className="text-gray-500">Loading medical records...</p>}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                    {success}
                </div>
            )}
            {!loading && records.length > 0 && (
                <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
                    {records.map((record) => (
                        <li
                            key={record.record_id}
                            className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    {record.diagnosis}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Date: {record.date_of_record}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Doctor: {record.doctor_first_name} {record.doctor_last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Patient: {record.patient_first_name} {record.patient_last_name}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={() => handleUpdate(record.record_id)}
                                >
                                    Update
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    onClick={() => handleDelete(record.record_id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MedicalRecords;
