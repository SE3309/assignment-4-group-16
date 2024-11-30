import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Login from './Lab4/Login';
import Patients from './Lab4/Patients';
import Appointments from './Lab4/Appointments';
import Billing from './Lab4/Billing';
import Doctors from './Lab4/Doctors';
import Resources from './Lab4/Resources';
import Summary from './Lab4/Summary';
import MedicalRecords from './Lab4/MedicalRecords';
import MultAppoinments from './Lab4/MultipleAppointments';

function App() {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setUserId(null);
    }
  }, [role]);

  const handleLogout = () => {
    setRole(null);
    setUserId(null);
    localStorage.removeItem('userId');
    console.log('User logged out, role and userId cleared.');
  };

  if (!role) {
    return <Login setRole={setRole} setUserId={setUserId} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-800 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-xl font-bold">Healthcare System</h1>
            <div>
              <Link to="/" className="mr-4 hover:underline">
                Home
              </Link>
              {role === 'admin' && (
                <>
                  <Link to="/patients" className="mr-4 hover:underline">
                    Patients
                  </Link>
                  <Link to="/doctors" className="mr-4 hover:underline">
                    Doctors
                  </Link>
                  <Link to="/billing" className="mr-4 hover:underline">
                    Billing
                  </Link>
                  <Link to="/resources" className="mr-4 hover:underline">
                    Resources
                  </Link>
                  <Link to="/multi-appointment" className="mr-4 hover:underline">
                    Multiple Appointments
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </>
              )}
              {role === 'doctor' && (
                <>
                  <Link to="/patients" className="mr-4 hover:underline">
                    Patients
                  </Link>
                  <Link to="/appointments" className="mr-4 hover:underline">
                    Appointments
                  </Link>
                  <Link to="/medical-records" className="mr-4 hover:underline">
                    Medical Records
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </>
              )}
              {role === 'patient' && (
                <>
                  <Link to="/summary" className="mr-4 hover:underline">
                    Summary
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
          <Routes>
            <Route
              path="/"
              element={
                <h2>
                  Welcome, {role}! Your User ID is{' '}
                  <span className="font-bold">{userId || 'not available'}</span>.
                </h2>
              }
            />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/multi-appointment" element={<MultAppoinments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
