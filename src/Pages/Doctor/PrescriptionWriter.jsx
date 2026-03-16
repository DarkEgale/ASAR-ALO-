import React, { useState, useEffect, useRef } from 'react';
import { FileText, Save, Loader, Plus, Trash2, HeartPulse, User, Calendar, ClipboardList, Stethoscope } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useNavigate, useLocation } from 'react-router-dom';
import './prescriptionWriter.scss';

const PrescriptionWriter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prescriptionRef = useRef();

    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [prescriptionData, setPrescriptionData] = useState({
        diagnosis: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
        instructions: ''
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        if (location.state?.appointmentId && appointments.length > 0) {
            const found = appointments.find(app => app._id === location.state.appointmentId);
            if (found) setSelectedAppointment(found);
        }
    }, [appointments, location.state]);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('https://asar-alo.onrender.com/api/auth/doctors/my/appiontments', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAppointments(data.DoctorAppiontments || []);
            }
        } catch (error) { console.error('Error fetching appointments:', error); }
    };

    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = [...prescriptionData.medications];
        updatedMedications[index][field] = value;
        setPrescriptionData({ ...prescriptionData, medications: updatedMedications });
    };

    const addMedication = () => {
        setPrescriptionData({
            ...prescriptionData,
            medications: [...prescriptionData.medications, { name: '', dosage: '', frequency: '', duration: '' }]
        });
    };

    const removeMedication = (index) => {
        if (prescriptionData.medications.length > 1) {
            const updatedMedications = prescriptionData.medications.filter((_, i) => i !== index);
            setPrescriptionData({ ...prescriptionData, medications: updatedMedications });
        }
    };

    const generateAndUpload = async () => {
        if (!selectedAppointment) {
            setMessage({ type: 'error', text: 'Please select an appointment first' });
            return;
        }
        
        setLoading(true);
        const element = prescriptionRef.current;
        const opt = {
            margin: 0,
            filename: `Prescription_${selectedAppointment.patientName || 'Patient'}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        try {
            const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
            const formData = new FormData();
            formData.append('appointmentId', selectedAppointment._id);
            formData.append('diagnosis', prescriptionData.diagnosis);
            formData.append('medications', JSON.stringify(prescriptionData.medications));
            formData.append('instructions', prescriptionData.instructions);
            formData.append('prescriptionPdf', pdfBlob, `prescription-${selectedAppointment._id}.pdf`);

            const res = await fetch('https://asar-alo.onrender.com/api/auth/doctors/create-prescription', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Prescription Saved Successfully!!' });
                setTimeout(() => navigate('/doctor-dashboard'), 2000);
            } else {
                setMessage({ type: 'error', text: 'Failed to upload' });
            }
        } catch (error) { 
            console.error(error);
            setMessage({ type: 'error', text: 'Error generating PDF' }); 
        }
        finally { setLoading(false); }
    };

    return (
        <div className="prescription-writer-container">
            <header className="writer-header">
                <div className="title-section">
                    <HeartPulse className="icon pulse" color="#e74c3c" />
                    <div>
                        <h1>Health Sync Digital Prescription</h1>
                        <p>Branded Digital Healthcare Documents</p>
                    </div>
                </div>
            </header>

            <div className="writer-grid">
                {/* Left Side: Form Section */}
                <section className="form-card">
                    <div className="form-group">
                        <label><User size={14} /> Target Patient</label>
                        <select 
                            className="styled-select" 
                            value={selectedAppointment?._id || ''} 
                            onChange={(e) => setSelectedAppointment(appointments.find(a => a._id === e.target.value))}
                        >
                            <option value="">-- Choose Appointment --</option>
                            {appointments.map(app => (
                                <option key={app._id} value={app._id}>
                                    {app.patientName || app.doctorId?.name + "'s Patient"} ({new Date(app.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label><Stethoscope size={14} /> Diagnosis</label>
                        <textarea rows="3" value={prescriptionData.diagnosis} onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })} placeholder="Enter patient diagnosis..." />
                    </div>

                    <div className="meds-container">
                        <div className="meds-header">
                            <label>Rx - Medications</label>
                            <button onClick={addMedication} className="btn-add"><Plus size={16}/> Add Medicine</button>
                        </div>
                        {prescriptionData.medications.map((med, index) => (
                            <div key={index} className="med-row">
                                <input type="text" placeholder="Name" value={med.name} onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} />
                                <input type="text" placeholder="Dose" value={med.dosage} onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} />
                                <input type="text" placeholder="Freq" value={med.frequency} onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)} />
                                <input type="text" placeholder="Days" value={med.duration} onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)} />
                                <button onClick={() => removeMedication(index)} className="btn-remove"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <label><ClipboardList size={14} /> Advice</label>
                        <textarea rows="3" value={prescriptionData.instructions} onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })} placeholder="Instructions for patient..." />
                    </div>

                    {message.text && <div className={`status-message ${message.type}`}>{message.text}</div>}

                    <button className="submit-btn" onClick={generateAndUpload} disabled={loading}>
                        {loading ? <Loader className="spin" /> : <Save />}
                        {loading ? 'Generating PDF...' : 'Save & Upload Prescription'}
                    </button>
                </section>

                {/* Right Side: PREMIUM PDF PREVIEW */}
                <section className="preview-card">
                    <div className="preview-label">Live Branded Preview</div>
                    <div className="prescription-paper" ref={prescriptionRef} style={{
                        backgroundColor: '#ffffff',
                        fontFamily: "'Inter', sans-serif",
                        padding: '0',
                        minHeight: '842px',
                        color: '#2d3436',
                        position: 'relative'
                    }}>
                        {/* --- Header Section (Doctor Profile Integrated) --- */}
                        <div style={{ backgroundColor: '#0984e3', padding: '40px 50px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                
                                {selectedAppointment?.doctorId?.image ? (
                                    <img 
                                        src={`https://asar-alo.onrender.com${selectedAppointment.doctorId.image}`} 
                                        alt="Doctor" 
                                        crossOrigin="anonymous" 
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            borderRadius: '50%', 
                                            objectFit: 'cover',
                                            border: '3px solid rgba(255,255,255,0.4)',
                                            backgroundColor: '#fff'
                                        }} 
                                    />
                                ) : (
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={40} color="#fff" />
                                    </div>
                                )}
                                <div>
                                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>Health Sync</h1>
                                    <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>
                                        Dr. {selectedAppointment?.doctorId?.name || "Specialist"}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: '0.9', textTransform: 'uppercase' }}>
                                        {selectedAppointment?.doctorId?.specialization || "Medical Expert"}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: '1.6' }}>
                                <p style={{ margin: 0 }}><strong>Hotline:</strong> +880 17xxxxxxxxx</p>
                                <p style={{ margin: 0 }}><strong>Web:</strong> mdshimulhossen.top</p>
                                <p style={{ margin: 0 }}>Natore,Sadar</p>
                            </div>
                        </div>

                        {/* --- Patient Meta --- */}
                        <div style={{ padding: '0 50px' }}>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1.5fr 1fr 1fr', 
                                backgroundColor: '#f1f2f6', 
                                padding: '20px', 
                                borderRadius: '0 0 15px 15px', 
                                marginBottom: '35px',
                                borderBottom: '3px solid #0984e3'
                            }}>
                                <div>
                                    <span style={{color: '#636e72', fontSize: '10px', textTransform: 'uppercase', fontWeight: '700'}}>Patient</span>
                                    <div style={{fontSize: '16px', fontWeight: '700'}}>{selectedAppointment?.patientName || "________________"}</div>
                                </div>
                                <div>
                                    <span style={{color: '#636e72', fontSize: '10px', textTransform: 'uppercase', fontWeight: '700'}}>Age / Sex</span>
                                    <div style={{fontSize: '15px', fontWeight: '600'}}>{selectedAppointment?.age || "0"} Y / {selectedAppointment?.gender || "M"}</div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <span style={{color: '#636e72', fontSize: '10px', textTransform: 'uppercase', fontWeight: '700'}}>Date</span>
                                    <div style={{fontSize: '15px', fontWeight: '600'}}>{new Date().toLocaleDateString('en-GB')}</div>
                                </div>
                            </div>

                            {/* --- Diagnosis --- */}
                            <div style={{ marginBottom: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0984e3', marginBottom: '10px' }}>
                                    <ClipboardList size={18} />
                                    <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>Diagnosis & Findings</h3>
                                </div>
                                <div style={{ padding: '0 15px', borderLeft: '3px solid #dfe6e9', fontSize: '15px', color: '#444' }}>
                                    {prescriptionData.diagnosis || "Regular clinical observation."}
                                </div>
                            </div>

                            {/* --- Rx Section --- */}
                            <div style={{ marginBottom: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '38px', fontWeight: '900', color: '#0984e3', fontStyle: 'italic', fontFamily: 'serif' }}>Rx</span>
                                    <div style={{ flex: '1', height: '1px', backgroundColor: '#0984e3', marginLeft: '15px', opacity: '0.2' }}></div>
                                </div>
                                
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#0984e3', color: '#ffffff' }}>
                                            <th style={{ padding: '12px 10px', textAlign: 'left' }}>Medication Details</th>
                                            <th style={{ padding: '12px 10px', textAlign: 'center' }}>Dosage</th>
                                            <th style={{ padding: '12px 10px', textAlign: 'center' }}>Schedule</th>
                                            <th style={{ padding: '12px 10px', textAlign: 'right' }}>Days</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescriptionData.medications.map((med, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f1f2f6' }}>
                                                <td style={{ padding: '15px 10px', fontWeight: '700', color: '#2d3436' }}>{med.name || '-'}</td>
                                                <td style={{ padding: '15px 10px', textAlign: 'center' }}>{med.dosage || '-'}</td>
                                                <td style={{ padding: '15px 10px', textAlign: 'center', color: '#636e72' }}>{med.frequency || '-'}</td>
                                                <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: '700', color: '#0984e3' }}>{med.duration || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- Advice --- */}
                            <div style={{ marginBottom: '60px', backgroundColor: '#f9f9fb', padding: '20px', borderRadius: '12px', border: '1px solid #f1f2f6' }}>
                                <div style={{ fontSize: '11px', color: '#95a5a6', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Special Instructions</div>
                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#2d3436' }}>{prescriptionData.instructions || "Follow standard health guidelines."}</p>
                            </div>

                            {/* --- Signature --- */}
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingBottom: '60px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '200px', borderTop: '2px solid #2d3436', paddingTop: '8px' }}>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '16px', color: '#0984e3' }}>
                                            Dr. {selectedAppointment?.doctorId?.name || "Doctor"}
                                        </p>
                                        <div style={{ marginTop: '5px', fontSize: '10px', color: '#27ae60', fontWeight: '800', textTransform: 'uppercase', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                                            ✓ Digital Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Footer Watermark --- */}
                        <div style={{ position: 'absolute', bottom: '0', width: '100%', backgroundColor: '#f8f9fa', padding: '12px 50px', fontSize: '10px', color: '#b2bec3', textAlign: 'center', borderTop: '1px solid #dfe6e9' }}>
                            Electronic Document: No manual signature required. Verified on Health Sync Medical Network.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrescriptionWriter;