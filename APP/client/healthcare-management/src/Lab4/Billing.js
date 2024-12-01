import React, { useState, useEffect } from 'react';
import { createBilling, fetchBillingStatus, updateBilling } from '../api';

function Billing() {
    const [patientId, setPatientId] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [billingRecords, setBillingRecords] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [billingStatus, setBillingStatus] = useState(null);


    useEffect(() => {
        const fetchBillingRecords = async () => {
            try {
                const response = await fetch('/api/billings');
                const data = await response.json();
                if (response.ok) {
                    setBillingRecords(data);
                } else {
                    throw new Error(data.error || 'Failed to fetch billing records');
                }
            } catch (err) {
                setError('Error fetching billing records. Please try again.');
            }
        };

        fetchBillingRecords();
    }, [billingRecords]);

    const handleSubmit = async () => {
        if (!patientId || !totalAmount || !invoiceDate) {
            setError('Please fill in all fields.');
            setMessage('');
            return;
        }
        try {
            const response = await createBilling({ patientId, totalAmount, paymentStatus, invoice_date: invoiceDate });
            setMessage('Billing record created successfully!');
            setError('');
            setPatientId('');
            setTotalAmount('');
            setPaymentStatus('Pending');
            setInvoiceDate('');
            setBillingStatus(null);
            setBillingRecords((prev) => [...prev, response]);
        } catch (err) {
            setError(err.message || 'Error creating billing record.');
            setMessage('');
        }
    };

    const handleCheckBillingStatus = async () => {
        if (!patientId) {
            setError('Please enter a Patient ID to check billing status.');
            return;
        }

        try {
            const status = await fetchBillingStatus(patientId);
            setBillingStatus(status.is_billed ? 'Billed' : 'Not Billed');
            setError('');
            setMessage('');
        } catch (err) {
            setError('Error fetching billing status. Please try again.');
            setBillingStatus(null);
        }
    };

    const handleUpdateBilling = async (billingId) => {
        const updatedTotalAmount = prompt('Enter new total amount:');
        const updatedPaymentStatus = prompt('Enter new payment status (Pending/Paid):');

        if (!updatedTotalAmount && !updatedPaymentStatus) {
            setError('At least one field must be updated.');
            return;
        }

        try {
            await updateBilling(billingId, {
                totalAmount: updatedTotalAmount || null,
                paymentStatus: updatedPaymentStatus || null,
            });
            setMessage('Billing record updated successfully!');
            setError('');
            setBillingRecords((prev) =>
                prev.map((record) =>
                    record.billing_id === billingId
                        ? { ...record, total_amount: updatedTotalAmount || record.total_amount, payment_status: updatedPaymentStatus || record.payment_status }
                        : record
                )
            );
        } catch (err) {
            setError('Error updating billing record. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Billing</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Patient ID</label>
                    <input
                        type="text"
                        placeholder="Enter Patient ID"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Total Amount</label>
                    <input
                        type="text"
                        placeholder="Enter Total Amount"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Payment Status</label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Invoice Date</label>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-between mt-6">
                <button
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-lg"
                    onClick={handleCheckBillingStatus}
                >
                    Check Billing Status
                </button>
                <button
                    className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-lg"
                    onClick={handleSubmit}
                >
                    Submit Billing
                </button>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Billing Records</h3>
                {billingRecords.length === 0 && <p>No billing records available.</p>}
                {billingRecords.map((record) => (
                    <div key={record.billing_id} className="p-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Billing ID: {record.billing_id}</p>
                        <p className="text-sm text-gray-600">Patient ID: {record.patient_id}</p>
                        <p className="text-sm text-gray-600">Total Amount: ${record.total_amount}</p>
                        <p className="text-sm text-gray-600">Payment Status: {record.payment_status}</p>
                        <p className="text-sm text-gray-600">Invoice Date: {record.invoice_date}</p>
                        <div className="flex space-x-4 mt-2">
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                onClick={() => handleUpdateBilling(record.billing_id)}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {billingStatus && (
                <div className="bg-yellow-100 text-yellow-700 p-4 mt-4 rounded-lg">
                    Billing Status: <strong>{billingStatus}</strong>
                </div>
            )}
            {message && (
                <div className="bg-green-100 text-green-700 p-4 mt-4 rounded-lg">
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 mt-4 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
}

export default Billing;
