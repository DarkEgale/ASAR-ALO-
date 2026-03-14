import React from 'react';
import './services.scss';
import Navbar from '../../Components/Common/NavBar/Navbar';
// Lucide-react icons import
import { UserRoundSearch, CalendarCheck2, FileText, Ambulance } from 'lucide-react';

const servicesData = [
  {
    id: 1,
    title: "Expert Doctor Search",
    description: "Find the best specialists near you based on department and expertise.",
    icon: <UserRoundSearch size={32} strokeWidth={1.5} />,
  },
  {
    id: 2,
    title: "Instant Appointment",
    description: "Book your slot online within seconds and get instant confirmation.",
    icon: <CalendarCheck2 size={32} strokeWidth={1.5} />,
  },
  {
    id: 3,
    title: "Digital Prescription",
    description: "Access all your prescriptions and medical history from your dashboard.",
    icon: <FileText size={32} strokeWidth={1.5} />,
  },
  {
    id: 4,
    title: "Emergency Support",
    description: "Connect with emergency services and ambulances in your area 24/7.",
    icon: <Ambulance size={32} strokeWidth={1.5} />,
  }
];

export default function Services() {
  return (
    <section className="services-section" aria-labelledby="services-title">
        <Navbar/>
      <div className="services-container">
        
        <header className="services-header">
          <h2 className="sub-title">How We Help</h2>
          <h1 id="services-title">Comprehensive Healthcare Solutions</h1>
          <div className="header-line" aria-hidden="true"></div>
        </header>

        <div className="services-grid">
          {servicesData.map((service) => (
            <article key={service.id} className="service-card">
              <div className="icon-wrapper" aria-hidden="true">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}