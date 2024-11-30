const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Default passwords for roles
const adminPass = "admin";
const doctorPass = "doctor";
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mySQLDevrajpyD3.',
    database: '3309'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

//Implemented in frontend 
// Role-based login
app.post('/api/login', (req, res) => {
    const { role, password, email } = req.body;

    switch (role) {
        case 'admin':
            if (password === adminPass) {
                db.query(
                    'SELECT s.staff_id, s.first_name, s.last_name FROM Administrator a JOIN Staff s ON a.staff_id = s.staff_id WHERE s.email = ?',
                    [email],
                    (err, results) => {
                        if (err || results.length === 0) {
                            res.status(401).json({ error: 'Invalid Admin credentials' });
                        } else {
                            res.status(200).json({
                                message: 'Admin authenticated',
                                role: 'admin',
                                id: results[0].staff_id,
                                user: results[0],
                            });
                        }
                    }
                );
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
            break;

        case 'doctor':
            if (password === doctorPass) {
                db.query(
                    'SELECT s.staff_id, s.first_name, s.last_name FROM Doctor d JOIN Staff s ON d.staff_id = s.staff_id WHERE s.email = ?',
                    [email],
                    (err, results) => {
                        if (err || results.length === 0) {
                            res.status(401).json({ error: 'Invalid Doctor credentials' });
                        } else {
                            res.status(200).json({
                                message: 'Doctor authenticated',
                                role: 'doctor',
                                id: results[0].staff_id,
                                user: results[0],
                            });
                        }
                    }
                );
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
            break;

        case 'patient':
            db.query(
                'SELECT patient_id, first_name, last_name FROM Patient WHERE email = ?',
                [email],
                (err, results) => {
                    if (err || results.length === 0) {
                        res.status(401).json({ error: 'Invalid Patient credentials' });
                    } else {
                        res.status(200).json({
                            message: 'Patient authenticated',
                            role: 'patient',
                            id: results[0].patient_id,
                            user: results[0],
                        });
                    }
                }
            );
            break;

        default:
            res.status(400).json({ error: 'Invalid role' });
    }
});

//Implemented in frontend 
// Create a new patient
app.post('/api/patients', (req, res) => {
    const { patient_id, firstName, lastName, dateOfBirth, gender, bloodType, phone, email, streetAddress, city, state, zipCode } = req.body;

    const patientQuery = `
        INSERT INTO Patient (patient_id, first_name, last_name, date_of_birth, gender, blood_type, phone, email, street_address, city, state, zip_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(patientQuery, [patient_id, firstName, lastName, dateOfBirth, gender, bloodType, phone, email, streetAddress, city, state, zipCode], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error creating patient', details: err });
        res.status(200).json({ message: 'Patient created successfully', patientId: result.insertId });
    });
});

//Implemented in frontend 
//Fetch a patient's medical records
app.get('/api/patients/:id/medicalrecords', (req, res) => {
    const patientId = req.params.id;

    const query = `
        SELECT mr.*, s.first_name AS doctor_first_name, s.last_name AS doctor_last_name, p.first_name AS patient_first_name,p.last_name AS patient_last_name
        FROM MedicalRecord mr
        JOIN Staff s ON mr.staff_id = s.staff_id
        JOIN Patient p ON  mr.patient_id = p.patient_id
        WHERE mr.patient_id = ?
        ORDER BY mr.date_of_record DESC
    `;
    db.query(query, [patientId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching medical records', details: err });
        res.status(200).json(results);
    });
});

//Implemented in frontend 
// Update medical records
app.put('/api/medicalrecords/:id', (req, res) => {
    const recordId = req.params.id;
    const { diagnosis, dateOfRecord } = req.body;

    const query = `
        UPDATE MedicalRecord
        SET diagnosis = ?, date_of_record = ?
        WHERE record_id = ?
    `;
    db.query(query, [diagnosis, dateOfRecord, recordId], (err) => {
        if (err) return res.status(500).json({ error: 'Error updating medical record', details: err });
        res.status(200).json({ message: 'Medical record updated successfully' });
    });
});

//Implemented in frontend 
// Delete a medical record
app.delete('/api/medicalrecords/:id', (req, res) => {
    const recordId = req.params.id;

    const query = `
        DELETE FROM MedicalRecord WHERE record_id = ?
    `;
    db.query(query, [recordId], (err) => {
        if (err) return res.status(500).json({ error: 'Error deleting medical record', details: err });
        res.status(200).json({ message: 'Medical record deleted successfully' });
    });
});
//Implemented in frontend 
// Fetch all patients
app.get('/api/patients', (req, res) => {
    const query = `
        SELECT patient_id, first_name, last_name, date_of_birth, gender, phone, email, city, state
        FROM Patient
        ORDER BY last_name, first_name
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching patients', details: err });
        res.status(200).json(results);
    });
});

//Implemented in frontend 
// Update patient information
app.put('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;
    const { firstName, lastName, phone, email, city, state, zipCode } = req.body;
    const fields = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
        city: city,
        state: state,
        zip_code: zipCode,
    };
    const updates = Object.keys(fields)
        .filter((key) => fields[key] !== undefined)
        .map((key) => `${key} = ?`);
    const values = Object.values(fields).filter((value) => value !== undefined);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }
    const query = `
        UPDATE Patient
        SET ${updates.join(', ')}
        WHERE patient_id = ?
    `;
    values.push(patientId);
    db.query(query, values, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating patient', details: err });
        }
        res.status(200).json({ message: 'Patient updated successfully' });
    });
});

//Implemented in frontend 
// Delete a patient
app.delete('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;

    const query = `DELETE FROM Patient WHERE patient_id = ?`;
    db.query(query, [patientId], (err) => {
        if (err) return res.status(500).json({ error: 'Error deleting patient', details: err });
        res.status(200).json({ message: 'Patient deleted successfully' });
    });
});

//Implemented in frontend 
// Create a new appointment
app.post('/api/appointments', (req, res) => {
    const { patientId, staffId, appointmentDate, appointmentTime, reasonForVisit } = req.body;

    const appointmentQuery = `
        INSERT INTO Appointment (patient_id, staff_id, appointment_date, appointment_time, reason_for_visit, status)
        VALUES (?, ?, ?, ?, ?, 'Scheduled')
    `;
    db.query(appointmentQuery, [patientId, staffId, appointmentDate, appointmentTime, reasonForVisit], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error creating appointment', details: err });
        res.status(200).json({ message: 'Appointment created successfully', appointmentId: result.insertId });
    });

});

//Implemented in frontend 
// Fetch available resources in a department
app.get('/api/resources/available', (req, res) => {
    const { departmentId } = req.query;

    const query = `
        SELECT resource_id, resource_name, resource_type, status
        FROM Resource
        WHERE department_id = ? AND status = 'Available'
    `;
    db.query(query, [departmentId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching available resources', details: err });
        res.status(200).json(results);
    });
});

//Implemented in frontend 
// Generate a patient medical summary
app.get('/api/patients/:id/summary', (req, res) => {
    const patientId = req.params.id;

    const query = `
         SELECT 
            p.first_name, p.last_name, p.date_of_birth, p.gender, p.phone, p.email,
            mr.diagnosis, mr.date_of_record, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name,
            b.total_amount, b.payment_status
        FROM Patient p
        LEFT JOIN MedicalRecord mr ON p.patient_id = mr.patient_id
        LEFT JOIN Staff d ON mr.staff_id = d.staff_id
        LEFT JOIN Billing b ON p.patient_id = b.patient_id
        WHERE p.patient_id = ?
		ORDER BY  mr.date_of_record DESC
    `;
    db.query(query, [patientId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error generating patient summary', details: err });
        res.status(200).json(results);
    });
});

//Implemented in frontend 
//Doctors with the most patients
app.get('/api/doctors/most-patients', (req, res) => {
    const query = `
        SELECT d.staff_id, s.first_name, s.last_name, COUNT(DISTINCT mr.patient_id) AS patient_count
        FROM Doctor d
        JOIN Staff s ON d.staff_id = s.staff_id
        JOIN MedicalRecord mr ON d.staff_id = mr.staff_id
        GROUP BY d.staff_id
        ORDER BY patient_count DESC
        LIMIT 5
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching doctors with most patients', details: err });
        res.status(200).json(results);
    });
});

// Update a doctor's department only if they have treated more than 5 patients
app.put('/api/doctors/:id/change-department', (req, res) => {
    const doctorId = req.params.id;
    const { newDepartmentId } = req.body;

    const query = `
        UPDATE Doctor d
        SET department_id = ?
        WHERE d.staff_id = ?
        AND (
            SELECT COUNT(DISTINCT mr.patient_id)
            FROM MedicalRecord mr
            WHERE mr.staff_id = d.staff_id
        ) > 2
    `;
    db.query(query, [newDepartmentId, doctorId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating doctor department', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Doctor does not meet the criteria for department change' });
        }
        res.status(200).json({ message: 'Doctor department updated successfully' });
    });
});

// Fetch doctors with overlapping patients (e.g., patients treated by multiple doctors)
app.get('/api/doctors/shared-patients', (req, res) => {
    const query = `
        SELECT d1.staff_id AS doctor1_id, s1.first_name AS doctor1_name,
               d2.staff_id AS doctor2_id, s2.first_name AS doctor2_name,
               COUNT(DISTINCT mr1.patient_id) AS shared_patients
        FROM Doctor d1
        JOIN Staff s1 ON d1.staff_id = s1.staff_id
        JOIN MedicalRecord mr1 ON d1.staff_id = mr1.staff_id
        JOIN MedicalRecord mr2 ON mr1.patient_id = mr2.patient_id
        JOIN Doctor d2 ON mr2.staff_id = d2.staff_id AND d1.staff_id != d2.staff_id
        JOIN Staff s2 ON d2.staff_id = s2.staff_id
        GROUP BY d1.staff_id, d2.staff_id
        HAVING shared_patients > 0
        ORDER BY shared_patients DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching shared patients', details: err });
        }
        res.status(200).json(results);
    });
});

//Implemented in frontend 
// Fetch patients with more than one appointment
app.get('/api/patients/multiple-appointments', (req, res) => {
    const query = `
        SELECT p.patient_id, p.first_name, p.last_name, COUNT(a.appointment_id) AS appointment_count
        FROM Patient p
        JOIN Appointment a ON p.patient_id = a.patient_id
        GROUP BY p.patient_id
        HAVING appointment_count > 1
        ORDER BY appointment_count DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching patients with multiple appointments', details: err });
        res.status(200).json(results);
    });
});

//Implemented in frontend 
//Get all appointments
app.get('/api/appointments/:staffId', (req, res) => {
    const staffId = parseInt(req.params.staffId);
    if (!staffId) {
        return res.status(400).json({ error: 'staffId is required to fetch appointments' });
    }
    const query = `
        SELECT a.appointment_id, a.patient_id, p.first_name, p.last_name, a.staff_id, a.appointment_date, a.appointment_time, a.reason_for_visit, a.status
        FROM Appointment a
        JOIN Patient p
        ON a.patient_id = p.patient_id
        WHERE staff_id = ? AND status = "Scheduled"
        ORDER BY appointment_date DESC
    `;
    db.query(query, [staffId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching appointments', details: err });
        }
        res.status(200).json(results);
    });
});

//Implemented in frontend 
// Check if a patient has been billed
app.get('/api/patients/:id/billed-status', (req, res) => {
    const patientId = req.params.id;
    const query = `
        SELECT EXISTS(
            SELECT 1
            FROM Billing
            WHERE patient_id = ?
        ) AS is_billed
    `;
    db.query(query, [patientId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error checking billing status', details: err });
        res.status(200).json(results[0]);
    });
});
//Implemented in frontend 
//Get billing
app.get('/api/billings', (req, res) => {
    const query = `
        SELECT b.billing_id, b.patient_id, p.first_name, p.last_name, b.total_amount, b.payment_status, b.invoice_date
        FROM Billing b
        JOIN Patient p ON b.patient_id = p.patient_id
        ORDER BY b.invoice_date DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching billing records', details: err });
        }
        res.status(200).json(results);
    });
});
//Implemented in frontend 
//updateBilling
app.put('/api/billing/:id', (req, res) => {
    const billingId = req.params.id;
    const { totalAmount, paymentStatus } = req.body;

    const query = `
        UPDATE Billing
        SET total_amount = COALESCE(?, total_amount),
            payment_status = COALESCE(?, payment_status)
        WHERE billing_id = ? AND payment_status != 'Paid'
    `;

    db.query(query, [totalAmount, paymentStatus, billingId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating billing record', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Cannot update billing record. Either it doesn’t exist or it has already been paid.' });
        }
        res.status(200).json({ message: 'Billing record updated successfully' });
    });
});

//Implemented in frontend 
// Insert a new billing record
app.post('/api/billing', (req, res) => {
    const { patientId, totalAmount, paymentStatus, invoice_date } = req.body;

    const query = `
        INSERT INTO Billing (patient_id, total_amount, payment_status, invoice_date)
        SELECT ?, ?, ?, ?
        FROM Patient p
        WHERE EXISTS (
            SELECT 1
            FROM Appointment a
            WHERE a.patient_id = p.patient_id
            AND a.status = 'Completed'
        )
        LIMIT 1
    `;

    db.query(query, [patientId, totalAmount, paymentStatus, invoice_date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating billing record', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'No completed appointments found for this patient' });
        }

        // Fetch the inserted record
        const fetchQuery = `SELECT * FROM Billing WHERE billing_id = ?`;
        db.query(fetchQuery, [result.insertId], (fetchErr, fetchResult) => {
            if (fetchErr) {
                return res.status(500).json({ error: 'Error fetching the created billing record', details: fetchErr });
            }
            res.status(200).json({ message: 'Billing record created successfully', billing: fetchResult[0] });
        });
    });
});
//Implemented in frontend 
// Update appointment status to 'Completed'
app.put('/api/appointments/:id/complete', (req, res) => {
    const appointmentId = req.params.id;

    const query = `
        UPDATE Appointment
        SET status = 'Completed'
        WHERE appointment_id = ?
        AND status != 'Completed'
    `;
    db.query(query, [appointmentId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error updating appointment status', details: err });
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Appointment already completed or does not exist' });
        }
        res.status(200).json({ message: 'Appointment marked as completed' });
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
