import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, DollarSign, ArrowLeft, MoreVertical, MessageCircle, XCircle, Download } from 'lucide-react';
import ChatComponent from '../../Components/Common/LiveChat/livechat';
import './UserAppointments.scss';

const MyAppointments = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const[user,setUser]=useState(null)
    const [toogle,setToogle]=useState(false)

    useEffect(() => {
        fetchAppointments();
        fetchPrescriptions();
        fetchUser()
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('https://asar-alo.onrender.com/api/auth/my/appiontments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setAppointments(data.userappointment || []);
            console.log(data)
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

        const fetchUser=async()=>{
        const res=await fetch('https://asar-alo.onrender.com/api/auth/my',{
            method:"GET",
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            }

        })
        if(!res.ok){
            throw new Error("Unable to connect Server");
            
        }
        const userData=await res.json()
        setUser(userData.user)

    }

    const fetchPrescriptions = async () => {
        try {
            const res = await fetch('https://asar-alo.onrender.com/api/auth/my/prescriptions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setPrescriptions(data.prescriptions || []);
        } catch (error) {
            console.error('Error fetching prescriptions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPrescriptionForAppointment = (appointmentId) => {
        return prescriptions.find(p => p.appointmentId === appointmentId);
    };

    const downloadPDF = async (prescriptionId, filename) => {
        try {
            const res = await fetch(`https://asar-alo.onrender.com/api/auth/prescription/download/${prescriptionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to download prescription');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading prescription:', error);
            alert('Failed to download prescription. Please try again.');
        }
    };

    const filteredData = filter === 'All' ? appointments : appointments.filter(app => {
        if (filter === 'Upcoming') return app.status === 'pending' || app.status === 'confirm';
        if (filter === 'Completed') return app.status === 'complete';
        if (filter === 'Cancelled') return app.status === 'cancelled';
        return true;
    });

    return (
        <div className="appointments-page">
            <div className="header-section">
                <button className="back-btn" onClick={() => navigate('/user-dashboard')}>
                    <ArrowLeft size={18} />
                    <span>Dashboard</span>
                </button>
                <h1>My Appointments</h1>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                    <button 
                        key={tab} 
                        className={filter === tab ? 'active' : ''} 
                        onClick={() => setFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Appointment List */}
            <div className="appointment-list">
                {loading ? (
                    <div className="loading">Loading appointments...</div>
                ) : filteredData.length > 0 ? (
                    filteredData.map((app) => {
                        const prescription = getPrescriptionForAppointment(app._id);
                        return (
                            <div key={app._id} className="appointment-card">
                                <div className="card-top">
                                    <div className="doctor-info">
                                        <div className="avatar-mini">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3>{app.doctorName}</h3>
                                            <span>{app.discription}</span>
                                        </div>
                                    </div>
                                    <div className={`status-badge ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </div>
                                </div>

                                <div className="card-details">
                                    <div className="detail-item">
                                        <Calendar size={16} />
                                        <span>{new Date(app.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>{app.availableTime || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <User size={16} />
                                        <span>Age: {app.age}</span>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    {app.status === 'pending' && (
                                        <>
                                            <button className="cancel-btn"><XCircle size={16} /> Cancel</button>
                                            <button className="chat-btn"onClick={() => setToogle(toogle===app._id ? null : app._id)}><MessageCircle size={16} /> Chat</button>
                                            {toogle === app._id && <ChatComponent roomId={app._id} user={user} isopen={()=>setToogle(null)}/>}
                                        </>
                                    )}
                                    {app.status === 'confirm' && (
                                        <>
                                            <button className="cancel-btn"><XCircle size={16} /> Cancel</button>
                                            <button className="chat-btn"onClick={() => setToogle(toogle===app._id ? null : app._id)}><MessageCircle size={16} /> Chat</button>
                                            {toogle === app._id && <ChatComponent roomId={app._id} user={user} isopen={()=>setToogle(null) } targetUserId={app.doctorId}/>}
                                        </>
                                    )}
                                    {app.status === 'complete' && prescription && (
                                        <button 
                                            className="download-btn"
                                            onClick={() => downloadPDF(prescription._id, `prescription-${app._id}.pdf`)}
                                        >
                                            <Download size={16} /> Download Prescription
                                        </button>
                                    )}
                                    {app.status === 'complete' && !prescription && (
                                        <span className="no-prescription">No prescription available</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-msg">No appointments found in this category.</div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;