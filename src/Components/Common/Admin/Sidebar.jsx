import { Users, Stethoscope, Calendar, Activity, LogOut, UserPlus } from "lucide-react";
import '../../../Pages/AdminPanel/Dasboard/Dashboard.scss'


export default function Sidebar({ activeTab, setActiveTab }) {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <aside className="sidebar">
            <div className="logo-section">
                <Activity className="logo-icon" size={28} />
                <span>AsarAlo <small>v3.0</small></span>
            </div>
            
            <div className="sidebar-scroll">
                <div className="sidebar-section">
                    <p className="section-title">Main Menu</p>
                    <div 
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={18} /> <span>Users</span>
                    </div>
                    <div 
                        className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('doctors')}
                    >
                        <Stethoscope size={18} /> <span>Doctors</span>
                    </div>
                    <div 
                        className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('appointments')}
                    >
                        <Calendar size={18} /> <span>Appointments</span>
                    </div>
                </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} /> <span>Sign Out</span>
            </button>
        </aside>
    );
}