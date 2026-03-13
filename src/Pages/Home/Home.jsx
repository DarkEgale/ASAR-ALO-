import React from 'react';
import Navbar from '../../Components/Common/NavBar/Navbar';
import Card from '../../Components/Common/Cards/Cards';
import Footer from '../../Components/Common/Footer/Footer';
import AppointmentBooking from '../../Components/Common/AppointmentBooking/AppointmentBooking';
import { useEffect, useState } from 'react';

import './Home.scss';

const Home = () => {

    const[doctors,setDoctors]=useState([])
    const [bookingModal, setBookingModal] = useState({ isOpen: false, doctor: null });

    useEffect(()=>{
        fecthDoctors()
    },[])
    
    const fecthDoctors=async()=>{
        const res=await fetch("http://localhost:5001/api/auth/doctors/all",{
            method:"GET",
            headers:{
                'content-type':'application/json'
            }
        })
        if(!res.ok){
            throw new Error("Error during fecth doctors");
            
        }

        const DoctorsData= await res.json()
        setDoctors(DoctorsData.Doctors)
    }

    const handleBookNow = (doctor) => {
        setBookingModal({ isOpen: true, doctor });
    };

    const closeBookingModal = () => {
        setBookingModal({ isOpen: false, doctor: null });
    };


   

    return (
        <div className="home-page">
            {/* ১. ন্যাভিগেশন বার */}
            <Navbar />

            <main className="main-content">
                {/* ২. হিরো সেকশন (আপনার আলাদা কম্পোনেন্ট থাকলে এখানে বসবে) */}
                <section className="hero-area">
                    {/* <Hero /> */}
                    <div style={{textAlign: 'center', padding: '100px 0'}}>
                        <h1 style={{color: 'var(--text-main)', fontSize: '40px'}}>Find Your Best Doctor</h1>
                        <p style={{color: 'var(--text-muted)'}}>Manage your health with ease and trust.</p>
                    </div>
                </section>

                {/* ৩. কার্ড গ্রিড সেকশন */}
                <section className="doctor-list-section">
                    <h2 style={{ marginBottom: '30px', color: 'var(--text-main)' }}>Featured Doctors</h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: '25px' 
                    }}>
                        {doctors.map((item) => (
                            <Card key={item._id} doctor={item} onBookNow={handleBookNow} />
                        ))}
                    </div>
                </section>

                {/* ৪. অন্য কোনো সেকশন থাকলে এখানে যোগ করবেন */}
                <section className="extra-section">
                    {/* <Services /> or <Testimonials /> */}
                </section>
            </main>

            {/* Appointment Booking Modal */}
            <AppointmentBooking
                doctor={bookingModal.doctor}
                isOpen={bookingModal.isOpen}
                onClose={closeBookingModal}
            />

            {/* ৫. ফুটার */}
            <Footer />
        </div>
    );
};

export default Home;