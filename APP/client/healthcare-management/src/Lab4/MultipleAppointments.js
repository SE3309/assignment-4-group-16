import React, { useState, useEffect } from 'react';
import { fetchPatientsWithMultipleAppointments } from '../api';

function MultipleAppointments() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const data = await fetchPatientsWithMultipleAppointments();
                setPatients(data);
            } catch (err) {
                setError('Failed to load patients with multiple appointments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadPatients();
    }, []);

    if (loading) {
        return <p className="text-gray-500 text-center mt-8">Loading...</p>;
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-8">
                {error}
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mt-8">
                No patients with multiple appointments found.
            </div>
        );
    }

    return (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Patients with Multiple Appointments</h2>
            <ul className="divide-y divide-gray-200">
                {patients.map((patient) => (
                    <li key={patient.patient_id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-bold text-gray-700">
                                {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                ID: {patient.patient_id}
                            </p>
                        </div>
                        <p className="text-gray-700 font-medium">
                            Appointments: {patient.appointment_count}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MultipleAppointments;
