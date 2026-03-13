import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Brand Info */}
                <div className="footer-info">
                    <div className="footer-logo">
                        <div className="logo-icon"><HeartPulse size={24} /></div>
                        <h2>HealthSync</h2>
                    </div>
                    <p>Your trusted partner for health management. Book appointments with top doctors in Natore and across the country instantly.</p>
                    <div className="social-links">
                        <a href="#" className="social-icon"><Facebook size={18} /></a>
                        <a href="#" className="social-icon"><Twitter size={18} /></a>
                        <a href="#" className="social-icon"><Instagram size={18} /></a>
                        <a href="#" className="social-icon"><Linkedin size={18} /></a>
                    </div>
                </div>

                {/* Useful Links */}
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/find-doctors">Find Doctors</Link></li>
                        <li><Link to="/services">Our Services</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className="footer-links">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                        <li><Link to="/doctor-login">Doctor Portal</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="footer-newsletter">
                    <h4>Stay Updated</h4>
                    <p>Subscribe to get health tips and new doctor updates.</p>
                    <div className="subscribe-form">
                        <input type="email" placeholder="Your email address" />
                        <button><Send size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} HealthSync Natore. All rights reserved.</p>
                <div className="legal-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;