import React, { useState } from "react";
import { useAuth } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn, Shield,LogOut} from "lucide-react"; 
import "./login.scss"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); 

        const result = await login({ email, password });
        console.log(result)

        if (result?.success) {
            if (localStorage.getItem('role') === "admin") navigate("/admin-dashboard");
            else navigate("/user-dashboard");
        } else {
            setError("Worng email or password");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon">
                        <Shield size={28} />
                    </div>
                    <h2>Welcome Back</h2>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="error-box">{error}</div>}

                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        <LogIn size={18} />
                        <span>Sign In</span>
                    </button>
                <button onClick={()=>navigate('/')} className="login-btn"style={{background:"green",marginTop:"10px"}}> <LogOut size={20}/>Back to Home</button>
                </form>
                

                {/* ... আগের কোড ... */}


                <div className="login-footer">
                    <p>Don't have an account? 
                        <span onClick={() => navigate("/register")} className="register-link">
                            Create an Account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;