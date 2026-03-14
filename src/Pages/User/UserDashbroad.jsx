import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/authContext';
import UserSidebar from '../../Components/Common/Sidebar/Sidebar';
import { Calendar, ClipboardList, Activity, User, Download,ArrowRight,ArrowLeft} from "lucide-react";
import "./userdashboard.scss";
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const[user,setUser]=useState(null)
    const [prescriptions, setPrescriptions] = useState([]);
    const [toogle,setToogle]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        fetchUser()
        fetchPrescriptions()
    },[])


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
            console.error('Error fetching prescriptions:', error);
        }
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
            alert('Failed to download prescription. Please try again..');
        }
    };

    const handelToogle=()=>{
        if(toogle === true){
            setToogle(false)
        }else{
            setToogle(true)
        }
    }

    return (
        <div className="user-dashboard">
            {
                toogle&&
                <UserSidebar/>
            }
            
            <main className="dashboard-content">
                <header className='header'>
                    <label htmlFor=""onClick={handelToogle}>{!toogle===true?<ArrowRight/>:<ArrowLeft/>}</label>
                    <div className="welcome-text">

                        <h1> {user?.name || "User"}!</h1>
                    </div>
                    <div className="user-profile">
                        <div className="avatar" onClick={()=>navigate('/user-profile')}><img src={`https://asar-alo.onrender.com${user?.image}`} alt="" /></div>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="icon-box blue"><Calendar size={24} /></div>
                        <div className="stat-info">
                            <h3>02</h3>
                            <span>Upcoming Appointments</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-box green"><ClipboardList size={24} /></div>
                        <div className="stat-info">
                            <h3>12</h3>
                            <span>Total Reports</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-box blue"><Activity size={24} /></div>
                        <div className="stat-info">
                            <h3>Normal</h3>
                            <span>Last Checkup Status</span>
                        </div>
                    </div>
                </div>

                <section className="main-section">
                    <div className="section-header">
                        <h2>Recent Prescriptions</h2>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="table-responsive">
                        {prescriptions.length > 0 ? (
                            <table className="prescription-table">
                                <thead>
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Diagnosis</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescriptions.slice(0, 5).map(prescription => (
                                        <tr key={prescription._id}>
                                            <td>{prescription.doctorName}</td>
                                            <td title={prescription.diagnosis} className="diagnosis-cell">
                                                {prescription.diagnosis.split(" ").slice(0,3).join(" ")}...</td>
                                            <td>{new Date(prescription.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button 
                                                    className="download-btn"
                                                    onClick={() => downloadPDF(prescription._id, `prescription-${prescription._id}.pdf`)}
                                                    title='Download'
                                                >
                                                    <Download size={16} />
                                                    
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{color: 'var(--text-muted)'}}>No recent prescriptions found.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;