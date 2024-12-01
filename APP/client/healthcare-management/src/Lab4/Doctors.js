import React, { useState, useEffect } from 'react';
import { fetchDoctors, fetchSharedPatients } from '../api';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [sharedPatients, setSharedPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const data = await fetchDoctors();
                setDoctors(data);
            } catch (err) {
                setError('Failed to fetch doctors. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadDoctors();
    }, []);

    useEffect(() => {
        const loadSharedPatients = async () => {
            try {
                const data = await fetchSharedPatients();
                setSharedPatients(data);
            } catch (err) {
                setError('Failed to fetch shared patients. Please try again later.');
            }
        };
        loadSharedPatients();
    }, [sharedPatients]);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Top Doctors</h2>
            {loading && <p className="text-gray-500">Loading doctors...</p>}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            {!loading && !error && (
                <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
                    {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <li
                                key={doctor.staff_id}
                                className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="text-lg font-medium text-gray-700">
                                        Dr. {doctor.first_name} {doctor.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {doctor.patient_count} patients
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center p-4">
                            No doctors found.
                        </p>
                    )}
                </ul>
            )}
            <h3 className="text-lg font-bold text-gray-700 mt-6 mb-4">Doctors with Shared Patients</h3>
            {
                sharedPatients.length > 0 ? (
                    <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
                        {sharedPatients.map((entry) => (
                            <li key={`${entry.doctor1_id}-${entry.doctor2_id}`} className="p-4">
                                <p className="text-gray-700">
                                    Dr. {entry.doctor1_name} and Dr. {entry.doctor2_name} have{' '}
                                    {entry.shared_patients} shared patients.
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center p-4">No shared patients found.</p>
                )
            }
        </div >
    );
}

export default Doctors;
