import React, { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import Card from "../../Components/Common/Cards/Cards";
import Navbar from "../../Components/Common/NavBar/Navbar";
import Footer from "../../Components/Common/Footer/Footer";
import AppointmentBooking from "../../Components/Common/AppointmentBooking/AppointmentBooking";
import "./findDoctor.scss";

const FindDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [bookingModal, setBookingModal] = useState({ isOpen: false, doctor: null });

    const categories = ["All", "Cardiology", "Neurology", "Medicine", "Surgery", "Pediatrics"];

    const handleBookNow = (doctor) => {
        setBookingModal({ isOpen: true, doctor });
    };

    const closeBookingModal = () => {
        setBookingModal({ isOpen: false, doctor: null });
    };

    useEffect(() => {
        // Fetch doctors from API
        const fetchDoctors = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/auth/doctors/all');
                const data = await res.json();
                if (res.ok) {
                    setDoctors(data.Doctors || []);
                    setFilteredDoctors(data.Doctors || []);
                } else {
                    console.error('Failed to fetch doctors');
                    // Fallback to dummy data
                    const tempDoctors = [
                        { _id: 1, name: "Dr. Shimul", specialization: "Cardiology", fee: 1000 },
                        { _id: 2, name: "Dr. Ariful", specialization: "Neurology", fee: 1200 },
                    ];
                    setDoctors(tempDoctors);
                    setFilteredDoctors(tempDoctors);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                // Fallback to dummy data
                const tempDoctors = [
                    { _id: 1, name: "Dr. Shimul", specialization: "Cardiology", fee: 1000 },
                    { _id: 2, name: "Dr. Ariful", specialization: "Neurology", fee: 1200 },
                ];
                setDoctors(tempDoctors);
                setFilteredDoctors(tempDoctors);
            }
        };
        fetchDoctors();
    }, []);

    // সার্চ এবং ফিল্টার লজিক
    useEffect(() => {
        const filtered = doctors.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "All" || doc.specialization === activeCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredDoctors(filtered);
    }, [searchTerm, activeCategory, doctors]);

    return (
        <div className="find-doctor-page">
            <Navbar/>
            {/* হেডার সেকশন */}
            <header className="page-header">
                <h1>Find Your Specialist</h1>
                <p>Browse through our certified doctors and book an appointment</p>
            </header>

            {/* সার্চ এবং ফিল্টার বার */}
            <div className="search-filter-section">
                <div className="search-input-group">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search doctor by name, specialty..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="category-scroll">
                    {categories.map((cat) => (
                        <button 
                            key={cat}
                            className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* রেজাল্ট সেকশন */}
            <main className="doctor-list-grid">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <Card key={doctor._id} doctor={doctor} onBookNow={handleBookNow} />
                    ))
                ) : (
                    <div className="no-result">
                        <p>No doctors found in this category.</p>
                    </div>
                )}
            </main>
            <Footer/>

            {/* Appointment Booking Modal */}
            <AppointmentBooking
                doctor={bookingModal.doctor}
                isOpen={bookingModal.isOpen}
                onClose={closeBookingModal}
            />
        </div>
        
    );
};

export default FindDoctor;