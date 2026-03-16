import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X, LogIn } from 'lucide-react';
import './Navbar.scss';
import { useAuth } from '../../../Context/authContext';


const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const {user,doctor}=useAuth()


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
        
    }, []);
    return (
        <nav className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-inner">

                <div className="nav-logo" onClick={() => navigate('/')}>
                    <div className="logo-box">
                        <img 
                            src="/app-logo192.png" 
                            alt="Health Sync Logo" 
                            style={{ width: '60px', height: '60px' }} 
                        />
                    </div>
                    <h2>HealthSync</h2>
                </div>


                <div className="nav-links">
                    <NavLink to="/" className="link">Home</NavLink>
                    <NavLink to="/find-doctors" className="link">Find Doctors</NavLink>
                    <NavLink to="/services" className="link">Services</NavLink>
                    <NavLink to="/contact" className="link">Contact</NavLink>
                </div>


                <div className="nav-actions">
                    <button className="btn-login secondary" onClick={() => user?.doctorId?navigate('/doctor-dashboard'):navigate('/doctor-login')}>
                        {user?.doctorId?"Doctor Dashboard":"Doctor portal"}
                    </button>
                    <button className="btn-login primary" onClick={() => user&&user.role==='user'?navigate('user-dashboard'):navigate('/login')}>
                        {user&&user.role==="user"?"Dashboard":"Sing In"}
                    </button>
                </div>


                <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>


{isMobileMenuOpen && (
    <div className="mobile-menu-overlay">
        <NavLink to="/" className="link" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
        <NavLink to="/find-doctors" className="link" onClick={() => setIsMobileMenuOpen(false)}>Find Doctors</NavLink>
        <NavLink to="/services" className="link" onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink>
        <NavLink to="/contact" className="link" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
        
        
        <div className="mobile-nav-actions">
            <button className="btn-login secondary"style={{height:"35px"}} onClick={() => { navigate('/doctor-login'); setIsMobileMenuOpen(false); }}>
                Doctor Portal
            </button>
            <button className="btn-login primary"style={{height:"35px"}} onClick={() => { user?navigate('/user-dashboard'):navigate('/login'); setIsMobileMenuOpen(false); }}>
                {user?"Dashboard":"Sing In"}
            </button>
        </div>
    </div>
)}
        </nav>
    );
};

export default Navbar;