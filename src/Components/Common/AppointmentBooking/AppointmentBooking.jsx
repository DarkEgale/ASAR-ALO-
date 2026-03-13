import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../Context/authContext';
import { useNavigate } from 'react-router-dom';
import './AppointmentBooking.scss';

const AppointmentBooking = ({ doctor, isOpen, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Initial state-a patientName field add kora hoyeche
    const [formData, setFormData] = useState({
        patientName: '', 
        date: '',
        time: '',
        age: '',
        description: ''
    });

    // Jodi user logged-in thake, tobe tar default name-ta field-a bosate paren
    useEffect(() => {
        if (user && user.name) {
            setFormData(prev => ({ ...prev, patientName: user.name }));
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    // Login check
    if (!user) {
        return (
            <div className="booking-modal open">
                <div className="modal-overlay" onClick={onClose}></div>
                <div className="modal-content login-required">
                    <div className="modal-header">
                        <h2>Login Required</h2>
                        <button className="close-btn" onClick={onClose}><X size={24} /></button>
                    </div>
                    <div className="modal-body">
                        <div className="login-prompt">
                            <div className="lock-icon">🔒</div>
                            <h3>Authentication Required</h3>
                            <p>Please login to your account to book an appointment.</p>
                            <div className="action-buttons">
                                <button className="login-btn" onClick={() => { navigate('/login'); onClose(); }}>Login Now</button>
                                <button className="register-btn" onClick={() => { navigate('/register'); onClose(); }}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const appointmentData = {
                patientName: formData.patientName, // User ekhon field theke name pathabe
                doctorName: doctor.name,
                doctorId: doctor._id,
                date: new Date(`${formData.date}T${formData.time}`).toISOString(),
                age: formData.age,
                discription: formData.description 
            };

            const res = await fetch('https://asar-alo.onrender.com/api/auth/create/appiontments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Appointment booked successfully!' });
                setTimeout(() => {
                    onClose();
                    setFormData({ patientName: '', date: '', time: '', age: '', description: '' });
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Booking failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network connection issue' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-modal open">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Book Appointment</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="modal-body">
                    <div className="doctor-info">
                        <h3>🩺 {doctor.name}</h3>
                        <p>{doctor.specialization}</p>
                        <div className="fee">Fee: {doctor.fee} BDT</div>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form">
                        {/* --- Patient Name Field --- */}
                        <div className="form-group">
                            <label><User size={18} /> Patient Name</label>
                            <input 
                                type="text" 
                                name="patientName" 
                                value={formData.patientName} 
                                onChange={handleInputChange} 
                                placeholder="Enter Patient's Full Name" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label><Calendar size={18} /> Appointment Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required />
                        </div>

                        <div className="form-group">
                            <label><Clock size={18} /> Preferred Time</label>
                            <select name="time" value={formData.time} onChange={handleInputChange} required>
                                <option value="">Select Time Slot</option>
                                <option value="09:00">09:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="16:00">04:00 PM</option>
                                <option value="19:00">07:00 PM</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label><User size={18} /> Patient's Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" required />
                        </div>

                        <div className="form-group">
                            <label><MessageSquare size={18} /> Problems / Symptoms</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the symptoms..." rows="3" required></textarea>
                        </div>

                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Booking..." : "Confirm Booking"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;