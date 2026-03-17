import React, { useState, useEffect } from "react";
import { Camera, Mail, User, Phone, Save, Loader, ShieldCheck } from "lucide-react";
import { useAuth } from "../../Context/authContext"; 
import "./doctorProfile.scss";

const DoctorProfile = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        availableTime: ""
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("/default-avatar.png");

    // ১. ডক্টর ডাটা ফেচ করা
    const fetchDoctor = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/auth/doctors/my', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) throw new Error("Unable to connect Server");

            const doctorData = await res.json();
            const data = doctorData.doctor;

            if (data) {
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    specialization: data.specialization || "",
                    availableTime: data.availableTime || ""
                });
                
                // ইমেজ পাথ চেক এবং সেট
                if (data.image && !data.image.includes('undefined')) {
                    // যদি ডাটাবেজে পাথ /uploads/ দিয়ে শুরু হয়, তবে ডাবল স্ল্যাশ এড়াতে format করা
                    const imagePath = data.image.startsWith('/') ? data.image : `/${data.image}`;
                    setPreviewUrl(`http://localhost:5001${imagePath}`);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error.message);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // লোকাল প্রিভিউ
        }
    };

    // ২. প্রোফাইল আপডেট করা
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const data = new FormData();
        data.append("name", formData.name);
        data.append("phone", formData.phone);
        data.append("specialization", formData.specialization);
        data.append("availableTime", formData.availableTime);
        
        if (selectedImage) {
            // গুরুত্বপূর্ণ: ব্যাকএন্ড রাউটে upload.single('profileImage') থাকলে এটাই দিন
            data.append("profileImage", selectedImage);
        }

        try {
            const res = await fetch("http://localhost:5001/api/auth/doctors/update-profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: data // FormData পাঠানোর সময় Content-Type হেডার দেওয়ার দরকার নেই
            });

            const result = await res.json();

            if (res.ok) {
                if (result.doctor && result.doctor.image && !result.doctor.image.includes('undefined')) {
                    const imagePath = result.doctor.image.startsWith('/') ? result.doctor.image : `/${result.doctor.image}`;
                    setPreviewUrl(`http://localhost:5001${imagePath}?t=${Date.now()}`);
                }
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: result.message || "Update failed" });
            }
        } catch (error) {
            console.error("Update Error:", error);
            setMessage({ type: "error", text: "Server error occurred" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="loader-container"><Loader className="spin" /></div>;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>Doctor Account Settings</h2>
                    <p>Update your personal information and profile picture</p>
                </div>

                <form onSubmit={handleUpdate} className="profile-form">
                    <div className="avatar-section">
                        <div className="image-wrapper">
                            <img 
                                src={previewUrl} 
                                alt="Doctor Profile" 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = "/default-avatar.png";
                                }} 
                            />
                            <label className="camera-icon" style={{ cursor: 'pointer' }}>
                                <Camera size={18} />
                                <input 
                                    type="file" 
                                    hidden 
                                    onChange={handleImageChange} 
                                    accept="image/*" 
                                />
                            </label>
                        </div>
                    </div>

                    {message.text && <div className={`alert-box ${message.type}`}>{message.text}</div>}

                    <div className="form-grid">
                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="icon" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper disabled">
                                <Mail size={18} className="icon" />
                                <input type="email" value={formData.email} disabled />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <Phone size={18} className="icon" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Specialization</label>
                            <div className="input-wrapper">
                                <ShieldCheck size={18} className="icon" />
                                <input
                                    type="text"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Available Time</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="e.g. 10:00 AM - 02:00 PM"
                                    value={formData.availableTime}
                                    onChange={(e) => setFormData({...formData, availableTime: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="update-btn" disabled={loading}>
                        {loading ? <Loader className="spin" size={18} /> : <Save size={18} />}
                        <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;