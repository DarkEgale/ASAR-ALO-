import React, { useState, useEffect } from "react";
import { Camera, Mail, User, Phone, Save, Loader, ShieldCheck } from "lucide-react";
import { useAuth } from "../../Context/authContext"; // আপনার পাথ অনুযায়ী
import "./doctorProfile.scss";

const DoctorProfile = () => {
    const { setUser } = useAuth();
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

    // Fetch Doctor Profile
    const fetchDoctor = async () => {
        try {
            const res = await fetch('https://asar-alo.onrender.com/api/auth/doctors/my', {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) throw new Error("Unable to connect Server");

            const doctorData = await res.json();
            const data = doctorData.doctor;

            // Set form data
            setFormData({
                name: data.name,
                email: data.email,
                phone: data.phone || "",
                specialization: data.specialization || "",
                availableTime: data.availableTime || ""
            });
            if (data.image) {
                setPreviewUrl(`https://asar-alo.onrender.com${data.image}`);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    // Handle Image Change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Update Profile
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
            data.append("profileImage", selectedImage);
        }

        try {
            const res = await fetch("https://asar-alo.onrender.com/api/auth/doctors/update-profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                if (result.doctor.image) {
                    setPreviewUrl(`https://asar-alo.onrender.com${result.doctor.image}`);
                }
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: result.message || "Update failed" });
            }
        } catch (error) {
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
                    {/* Avatar Upload Section */}
                    <div className="avatar-section">
                        <div className="image-wrapper">
                            <img src={previewUrl} alt="Doctor Profile" />
                            <label className="camera-icon">
                                <Camera size={18} />
                                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
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

                        <div className="input-group disabled">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="icon" />
                                <input type="email" value={formData.email} disabled />
                            </div>
                            <small>Email address is linked to your identity.</small>
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <Phone size={18} className="icon" />
                                <input
                                    type="text"
                                    placeholder="+880 1XXX XXXXXX"
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