import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/authContext';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    FileText, 
    UserCircle, 
    Settings, 
    LogOut, 
    HeartPulse 
} from 'lucide-react';
import './userSidebar.scss';

const UserSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/user-dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/my-appointments', name: 'Appointments', icon: <CalendarCheck size={20} /> },
        { path: '/my-reports', name: 'My Reports', icon: <FileText size={20} /> },
        { path: '/user-profile', name: 'Profile', icon: <UserCircle size={20} /> },
        { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="user-sidebar">
            <div className="logo-section">
                <div className="logo-icon">
                    <HeartPulse size={24} />
                </div>
                <h2>HealthSync</h2>
            </div>

            <nav className="nav-links">
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

            <div className="logout-section">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;