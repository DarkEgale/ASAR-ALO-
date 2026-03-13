import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/authContext';
import DoctorSidebar from '../../Components/Common/DoctorSideBar/DoctorSidebar';
import { Users, Clock, CheckCircle, BadgeCheck, Search, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './doctorDashboard.scss';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [appointments, setAppiontments] = useState([]);
    const [doctor,setdoctor]=useState(null)
    
    // Filtering States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/doctor-login');
        } else {
            fetchAppointments();
            fetchDoctorDashboard()
        }
    }, []);


    const fetchDoctorDashboard=async()=>{
        const res=await fetch('https://asar-alo.onrender.com/api/auth/doctors/my',{
            method:"GET",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(!res.ok){
            throw new Error("Error during Fecth Dashboard");
            return
        }

        const doctorData=await res.json()
        setdoctor(doctorData.doctor)
        console.log(doctorData)
        console.log(doctor)
    }


    const fetchAppointments = async () => {
        try {
            const res = await fetch('https://asar-alo.onrender.com/api/auth/doctors/my/appiontments', {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setAppiontments(data.DoctorAppiontments || []);
                console.log('Data',data)
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    console.log(user)


    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        }).reverse();

        return last7Days.map(dateLabel => {
            const count = appointments.filter(appt => 
                new Date(appt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) === dateLabel
            ).length;
            return { name: dateLabel, appointments: count };
        });
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`https://asar-alo.onrender.com/api/auth/doctors/modify/status/${id}`, {
                method: "PATCH",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) fetchAppointments();
        } catch (error) {
            console.error("Update Error:", error);
        }
    };

    const filteredData = appointments.filter((item) => {
        const matchesSearch = item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.userId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = filterStatus === 'all' || item.status === filterStatus;
        const apptDate = new Date(item.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        let matchesDate = true;
        if (dateFilter === 'today') {
            matchesDate = apptDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'next3days') {
            const threeDaysLater = new Date();
            threeDaysLater.setDate(today.getDate() + 3);
            matchesDate = apptDate >= today && apptDate <= threeDaysLater;
        } else if (dateFilter === 'next7days') {
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(today.getDate() + 7);
            matchesDate = apptDate >= today && apptDate <= sevenDaysLater;
        }
        return matchesSearch && matchesTab && matchesDate;
    });

    const pendingCount = appointments.filter(item => item.status === 'pending').length;
    const completedCount = appointments.filter(item => item.status === 'completed').length;
    const confirmCount = appointments.filter(item => item.status === 'confirmed').length;

    return (
        <div className="doctor-dashboard-container">
            <DoctorSidebar />
            <main className="dashboard-main">
                <header className="top-bar">
                    <div className="welcome-msg">
                        <h1>Dr. {doctor?.name || "Specialist"}</h1>
                        <p>Total Appointments: {appointments.length}</p>
                    </div>
                </header>

                {/* Stats Boxes */}
                <div className="stats-wrapper">
                    <div className="stat-box">
                        <div className="icon-container blue"><Users size={24} /></div>
                        <div className="stat-content"><h3>{appointments.length}</h3><span>Total</span></div>
                    </div>
                    <div className="stat-box">
                        <div className="icon-container orange"><Clock size={24} /></div>
                        <div className="stat-content"><h3>{pendingCount}</h3><span>Pending</span></div>
                    </div>
                    <div className="stat-box">
                        <div className="icon-container green"><BadgeCheck size={24} /></div>
                        <div className="stat-content"><h3>{confirmCount}</h3><span>Confirmed</span></div>
                    </div>
                    <div className="stat-box">
                        <div className="icon-container green"><CheckCircle size={24} /></div>
                        <div className="stat-content"><h3>{completedCount}</h3><span>Completed</span></div>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Left Side: Table */}
                    <section className="appointment-list-card">
                        <div className="card-header-actions">
                            <h2>Patient Appointments</h2>
                            <div className="controls">
                                <div className="search-input-group">
                                    <Search size={16} />
                                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="date-filter-group">
                                    <Calendar size={16} />
                                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                                        <option value="all">All Dates</option>
                                        <option value="today">Today Only</option>
                                        <option value="next3days">Next 3 Days</option>
                                        <option value="next7days">Next 7 Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="filter-tabs">
                            {['all', 'pending', 'confirmed', 'completed'].map((tab) => (
                                <button key={tab} className={filterStatus === tab ? 'active' : ''} onClick={() => setFilterStatus(tab)}>
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="appt-table">
                                <thead>
                                    <tr>
                                        <th>Patient Name</th>
                                        <th>Age</th>
                                        <th>Date</th>
                                        <th>Current Status</th>
                                        <th>Update</th>
                                        <th>Prescription</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                            <tr key={item._id}>
                                                <td><div className="patient-info"><span>{item.patientName}</span><small>ID: {item.userId}</small></div></td>
                                                <td>{item.age} Yrs</td>
                                                <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                                                <td><span className={`status-tag ${item.status}`}>{item.status}</span></td>
                                                <td>
                                                    <select className="status-select" value={item.status} onChange={(e) => handleStatusUpdate(item._id, e.target.value)}>
                                                        <option value="pending">Pending</option>
                                                        <option value="confirm">Confirm</option>
                                                        <option value="complete">Complete</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="write-prescription-btn"
                                                        onClick={() => navigate('/prescription-writer', { state: { appointmentId: item._id, patientName: item.patientName } })}
                                                    >
                                                        Write Prescription
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="no-data">No data found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Right Side: Graph Statistics */}
                    <section className="statistics-card">
                        <div className="card-header">
                            <div className="title-area">
                                <TrendingUp size={20} color="var(--primary-color)" />
                                <h2>Today's Insights</h2>
                            </div>
                            <small>Appointment Trends (Last 7 Days)</small>
                        </div>

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={getChartData()}>
                                    <defs>
                                        <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="appointments" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorAppt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="quick-summary">
                            <div className="summary-item">
                                <span>Pending Ratio</span>
                                <div className="progress-bar"><div className="fill orange" style={{width: `${(pendingCount/appointments.length)*100}%`}}></div></div>
                            </div>
                            <div className="summary-item">
                                <span>Completion Rate</span>
                                <div className="progress-bar"><div className="fill green" style={{width: `${(completedCount/appointments.length)*100}%`}}></div></div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;