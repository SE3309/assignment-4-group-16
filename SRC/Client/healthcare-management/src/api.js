export const login = async (role, email, password) =>
    fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password }),
    }).then((res) => res.json());

export const fetchPatients = () => fetch(`/api/patients`).then((res) => res.json());

export const fetchSharedPatients = () =>
    fetch(`/api/doctors/shared-patients`).then((res) => res.json());

export const updateBilling = async (billingId, updatedData) =>
    fetch(`/api/billing/${billingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    }).then((res) => res.json());

export const createPatient = async (patientData) =>
    fetch(`/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
    });
export const updatePatient = async (patientId, patientData) =>
    fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
    });

export const deletePatient = async (patientId) =>
    fetch(`/api/patients/${patientId}`, { method: 'DELETE' });

export const fetchMedicalRecords = (patientId) =>
    fetch(`/api/patients/${patientId}/medicalrecords`).then((res) => res.json());

export const updateMedicalRecord = (recordId, diagnosis, dateOfRecord) =>
    fetch(`/api/medicalrecords/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosis, dateOfRecord }),
    });

export const deleteMedicalRecord = (recordId) =>
    fetch(`/api/medicalrecords/${recordId}`, { method: 'DELETE' });

export const fetchAppointments = (staffId) => fetch(`/api/appointments/${staffId}`).then((res) => res.json());

export const createAppointment = async (appointmentData) =>
    fetch(`/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
    });

export const fetchResources = (departmentId) =>
    fetch(`/api/resources/available?departmentId=${departmentId}`).then((res) => res.json());

export const fetchSummary = (patientId) => fetch(`/api/patients/${patientId}/summary`).then((res) => res.json());

export const fetchDoctors = () => fetch(`/api/doctors/most-patients`).then((res) => res.json());

export const fetchBillingStatus = (patientId) =>
    fetch(`/api/patients/${patientId}/billed-status`).then((res) => res.json());

export const createBilling = async (patientId, totalAmount, paymentStatus, invoice_date) =>
    fetch(`/api/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientId, totalAmount, paymentStatus, invoice_date),
    });

export const addDoctor = async (doctorData) =>
    fetch(`/api/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData),
    });

export const completeAppointment = (appointmentId) =>
    fetch(`/api/appointments/${appointmentId}/complete`, { method: 'PUT' });

export const fetchPatientsWithMultipleAppointments = () =>
    fetch(`/api/patients/multiple-appointments`).then((res) => res.json());
