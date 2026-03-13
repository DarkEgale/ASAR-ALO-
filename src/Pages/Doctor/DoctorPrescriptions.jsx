import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import './doctorPrescriptions.scss';

const DoctorPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const res = await fetch('https://asar-alo.onrender.com/api/auth/doctors/my/prescriptions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setPrescriptions(data.prescriptions || []);
        } catch (error) {
            console.error('Error fetch prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = (pdfPath, filename) => {
        const link = document.createElement('a');
        link.href = `https://asar-alo.onrender.com${pdfPath}`;
        link.download = filename;
        link.click();
    };

    if (loading) {
        return <div className="loading">Loading prescriptions...</div>;
    }

    return (
        <div className="doctor-prescriptions">
            <div className="header">
                <h2>My Prescriptions</h2>
                <p>View and manage prescriptions you've created</p>
            </div>

            <div className="prescriptions-list">
                {prescriptions.length > 0 ? (
                    prescriptions.map(prescription => (
                        <div key={prescription._id} className="prescription-card">
                            <div className="card-header">
                                <div className="patient-info">
                                    <h3>{prescription.patientName}</h3>
                                    <p>Appointment: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="actions">
                                    <button 
                                        className="download-btn"
                                        onClick={() => downloadPDF(prescription.pdfPath, `prescription-${prescription._id}.pdf`)}
                                    >
                                        <Download size={16} />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="diagnosis">
                                    <strong>Diagnosis:</strong> {prescription.diagnosis}
                                </div>
                                <div className="medications">
                                    <strong>Medications:</strong>
                                    <ul>
                                        {prescription.medications.map((med, index) => (
                                            <li key={index}>
                                                {med.name} - {med.dosage} - {med.frequency} - {med.duration}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {prescription.instructions && (
                                    <div className="instructions">
                                        <strong>Instructions:</strong> {prescription.instructions}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-prescriptions">
                        <FileText size={48} />
                        <p>No prescriptions found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPrescriptions;