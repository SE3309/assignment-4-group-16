import React, { useState } from 'react';
import { login } from '../api';
import { FaStethoscope } from 'react-icons/fa';

function Login({ setRole, setUserId }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setLocalRole] = useState('admin');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(role, email, role === 'patient' ? undefined : password);
            if (response.message) {
                setRole(role);
                if (response.id) {
                    localStorage.setItem('userId', response.id);
                    setUserId(response.id);
                }
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-red-400 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-xl">
                <div className="flex flex-col items-center mb-8">
                    <FaStethoscope className="text-red-600 text-6xl mb-4" />
                    <h1 className="text-4xl font-extrabold text-red-600 text-center">
                        Healthcare Management System
                    </h1>
                    <p className="text-gray-600 text-center mt-2">
                        Log in to manage patients, appointments, and resources.
                    </p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Role</label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                            value={role}
                            onChange={(e) => setLocalRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {role !== 'patient' && (
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <button
                        className="bg-red-600 text-white font-bold w-full py-3 rounded-lg hover:bg-red-700 transition shadow-lg"
                        onClick={handleLogin}
                    >
                        Log In
                    </button>
                    {error && (
                        <p className="text-red-600 text-center text-sm mt-4">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
