import React from 'react';
import './contact.scss';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Navbar from '../../Components/Common/NavBar/Navbar';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <section className="contact-section">
        <Navbar/>
      <div className="contact-container">
        
        <header className="contact-header">
          <h2 className="sub-title">Get In Touch</h2>
          <h1>Contact Health Sync Support</h1>
          <div className="header-line"></div>
        </header>

        <div className="contact-wrapper">
          {/* Left Side: Contact Form */}
          <div className="form-container">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Tell us how we can help..." rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right Side: Contact Info Cards */}
          <div className="info-container">
            <div className="info-card">
              <div className="icon-box"><Phone size={24} /></div>
              <div className="info-text">
                <h4>Call Us</h4>
                <p>+880 1234 567 890</p>
                <p>+880 1987 654 321</p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box"><Mail size={24} /></div>
              <div className="info-text">
                <h4>Email Us</h4>
                <p>support@healthsync.top</p>
                <p>info@mdshimulhossen.top</p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box"><MapPin size={24} /></div>
              <div className="info-text">
                <h4>Visit Us</h4>
                <p>Level-4, Health Tower, Natore,</p>
                <p>Rajshahi Division, Bangladesh</p>
              </div>
            </div>

            <div className="info-card chat-card">
              <div className="icon-box"><MessageSquare size={24} /></div>
              <div className="info-text">
                <h4>Live Chat</h4>
                <p>Our experts are online to help you.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}