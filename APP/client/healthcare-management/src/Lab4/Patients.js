import React, { useState, useEffect } from 'react';
import { fetchPatients, createPatient, updatePatient, deletePatient } from '../api';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newPatient, setNewPatient] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bloodType: '',
        phone: '',
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [nextPatientId, setNextPatientId] = useState(null);
    useEffect(() => {
        const loadPatients = async () => {
            try {
                const data = await fetchPatients();
                setPatients(data);
                const maxPatientId = data.reduce(
                    (maxId, patient) => Math.max(maxId, patient.patient_id),
                    0
                );
                setNextPatientId(maxPatientId + 1);
            } catch (err) {
                setError('Failed to fetch patients. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadPatients();
    }, [patients]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPatient = async () => {
        if (!nextPatientId) {
            setError('Unable to calculate the next patient ID. Please refresh the page.');
            return;
        }

        setError('');
        setSuccess('');
        const patientData = { patient_id: nextPatientId, ...newPatient };

        try {
            await createPatient(patientData);
            setSuccess('New patient added successfully!');
            setPatients((prev) => [...prev, { patient_id: nextPatientId, ...newPatient }]);
            setNewPatient({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                bloodType: '',
                phone: '',
                email: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
            });
        } catch (err) {
            setError('Failed to add new patient. Please try again later.');
        }
    };

    const handleUpdatePatient = async (patientId) => {
        const updatedData = {
            firstName: prompt('Enter new first name:'),
            lastName: prompt('Enter new last name:'),
            phone: prompt('Enter new phone number:'),
        };

        if (!updatedData.firstName || !updatedData.lastName || !updatedData.phone) {
            setError('All fields are required to update the patient.');
            return;
        }

        try {
            await updatePatient(patientId, updatedData);
            setPatients((prev) =>
                prev.map((patient) =>
                    patient.patient_id === patientId
                        ? { ...patient, ...updatedData }
                        : patient
                )
            );
            setSuccess('Patient updated successfully!');
        } catch (err) {
            setError('Failed to update the patient. Please try again.');
        }
    };

    const handleDeletePatient = async (patientId) => {
        try {
            await deletePatient(patientId);
            setPatients((prev) => prev.filter((patient) => patient.patient_id !== patientId));
            setSuccess('Patient deleted successfully!');
        } catch (err) {
            setError('Failed to delete the patient. Please try again.');
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Patients</h2>
            {success && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                    Add New Patient
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        value={newPatient.firstName}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={newPatient.lastName}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Last Name"
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={newPatient.dateOfBirth}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        name="gender"
                        value={newPatient.gender}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Gender"
                    />
                    <input
                        type="text"
                        name="bloodType"
                        value={newPatient.bloodType}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Blood Type"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={newPatient.phone}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Phone"
                    />
                    <input
                        type="email"
                        name="email"
                        value={newPatient.email}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Email"
                    />
                    <input
                        type="text"
                        name="streetAddress"
                        value={newPatient.streetAddress}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Street Address"
                    />
                    <input
                        type="text"
                        name="city"
                        value={newPatient.city}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="City"
                    />
                    <input
                        type="text"
                        name="state"
                        value={newPatient.state}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="State"
                    />
                    <input
                        type="text"
                        name="zipCode"
                        value={newPatient.zipCode}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Zip Code"
                    />
                </div>
                <button
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    onClick={handleAddPatient}
                >
                    Add Patient
                </button>
            </div>
            {loading && <p className="text-gray-500">Loading patients...</p>}
            {!loading && !error && (
                <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
                    {patients.map((patient) => (
                        <li
                            key={patient.patient_id}
                            className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    {patient.first_name} {patient.last_name}
                                </p>
                                <p className="text-sm text-gray-500">{patient.email}</p>
                                <p className="text-sm text-gray-500">
                                    Location: {patient.city}, {patient.state}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Id: {patient.patient_id}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => handleUpdatePatient(patient.patient_id)}
                                >
                                    Update
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() => handleDeletePatient(patient.patient_id)}
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

export default Patients;
