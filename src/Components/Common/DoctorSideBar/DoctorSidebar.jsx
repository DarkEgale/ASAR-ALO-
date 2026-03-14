import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/authContext';
import { 
    LayoutDashboard, 
    CalendarDays, 
    Users, 
    ClipboardList, 
    UserCircle, 
    LogOut, 
    Activity,
    FileText
} from 'lucide-react';
import './DoctorSidebar.scss';

const DoctorSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/doctor-login');
    };

    const menuItems = [
        { path: '/doctor-dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/prescription-writer', name: 'Write Prescription', icon: <FileText size={20} /> },
        { path: '/appointments', name: 'Appointments', icon: <CalendarDays size={20} /> },
        { path: '/patients', name: 'Patients', icon: <Users size={20} /> },
        { path: '/prescriptions', name: 'Prescriptions', icon: <ClipboardList size={20} /> },
        { path: '/doctor-profile', name: 'Profile Settings', icon: <UserCircle size={20} /> },
    ];

    return (
        <aside className="doctor-sidebar">
            <div className="brand-logo">
                <div className="icon-box">
                    <Activity size={24} />
                </div>
                <h2>DocPanel</h2>
            </div>

            <nav className="nav-links">
                <button onClick={()=>navigate('/')} className="login"> Back to Home</button>
                {menuItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path} 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;