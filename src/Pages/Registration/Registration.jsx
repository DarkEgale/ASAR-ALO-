import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../Context/authContext";
import "./register.scss";

const Register = () => {
    const navigate = useNavigate();
    const {Register,user}=useAuth()
    const {message,setMessage}=useState('')
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    

    const result = await Register(formData);

    if (result.success) {

        console.log("Registration Successful!");

        navigate('/login'); 
    } else {

        setError(result.message); 
    }
};

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <div className="logo-icon">
                        <UserPlus size={28} />
                    </div>
                    <h2>Create Account</h2>
                    <p>Start your journey with us today</p>
                </div>

                <form className="register-form" onSubmit={handleRegister}>
                    {error && <div className="error-box">{error}</div>}

                    <div className="input-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="icon" />
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="icon" />
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="icon" />
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-btn">
                        <span>Get Started</span>
                        <UserPlus size={18} />
                    </button>
                </form>

                <div className="register-footer">
                    <p>Already have an account? 
                        <span onClick={() => navigate("/login")} className="login-link">
                             Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;