import React, { useState, useEffect } from 'react';
import { fetchAppointments, completeAppointment, createAppointment } from '../api';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');
    const [formData, setFormData] = useState({
        patientId: '',
        staffId: '',
        appointmentDate: '',
        appointmentTime: '',
        reasonForVisit: '',
    });

    const loadAppointments = async () => {
        try {
            const data = await fetchAppointments(userId);
            setAppointments(data);
        } catch (err) {
            setError('Failed to load appointments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [userId]);

    const handleComplete = async (id) => {
        try {
            await completeAppointment(id);
            setAppointments((prev) => prev.filter((appointment) => appointment.appointment_id !== id));
        } catch (err) {
            setError('Failed to mark appointment as completed.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        try {
            await createAppointment(formData);
            setFormData({
                patientId: '',
                staffId: '',
                appointmentDate: '',
                appointmentTime: '',
                reasonForVisit: '',
            });
            loadAppointments();
        } catch (err) {
            setError('Failed to create appointment.');
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Appointments</h2>
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <form
                className="bg-white shadow-lg rounded-lg p-6 mb-6"
                onSubmit={handleCreateAppointment}
            >
                <h3 className="text-lg font-bold mb-4">Create New Appointment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Patient ID
                        </label>
                        <input
                            type="text"
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Staff ID
                        </label>
                        <input
                            type="text"
                            name="staffId"
                            value={formData.staffId}
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Appointment Date
                        </label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Appointment Time
                        </label>
                        <input
                            type="time"
                            name="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            required
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Reason for Visit
                        </label>
                        <input
                            type="text"
                            name="reasonForVisit"
                            value={formData.reasonForVisit}
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Create Appointment
                </button>
            </form>
            {loading && <p className="text-gray-500">Loading appointments...</p>}
            {!loading && (
                <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <li
                                key={appointment.appointment_id}
                                className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="text-gray-700 font-medium">
                                        {appointment.reason_for_visit}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {appointment.status} Date: {appointment.appointment_date} Time: {appointment.appointment_time}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {appointment.first_name} {appointment.last_name}
                                    </p>

                                </div>
                                <button
                                    className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    onClick={() => handleComplete(appointment.appointment_id)}
                                >
                                    Mark as Completed
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center p-4">
                            No appointments available.
                        </p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default Appointments;
