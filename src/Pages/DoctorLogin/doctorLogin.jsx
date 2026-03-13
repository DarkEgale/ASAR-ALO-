import React, { useState } from "react";
import { useAuth } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";
import { Stethoscope, LogIn, Loader2 } from "lucide-react";
import "./doctorLogin.scss";

const DoctorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { doctorSignIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const result = await doctorSignIn({ email, password });

            if (result.success) {
                navigate("/doctor-dashboard");
            } else {
                setError(result.message || "Invalid doctor credentials");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="doctor-login-page">
            <div className="login-card">
                <div className="header">
                    <div className="icon-wrapper">
                        <Stethoscope size={32} />
                    </div>
                    <h2>Doctor Login</h2>
                    <p>Enter your credentials to access your portal</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <label>Professional Email</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="doctor@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Login to Dashboard</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorLogin;