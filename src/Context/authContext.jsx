import { userLogin } from "../API/userLogin.js";
import { doctorLogin as doctorLoginRequest } from "../API/doctorLoginAPI.js"; 
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { userRegister } from "../API/userRegister.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Token Decode Error:", error);
                localStorage.removeItem('token'); 
                localStorage.removeItem('role');
            }
        }
        setLoading(false);
    }, []);

    const saveUserData = (token, role) => {
        localStorage.setItem('token', token);
        
        const decoded = jwtDecode(token);
        let userRole=decoded.role
        localStorage.setItem('role', userRole);
        console.log(userRole)
        setUser(decoded);
        setLoading(false);
    };

    const login = async ({ email, password }) => {
        try {
            const res = await userLogin({ email, password });
            console.log(res)
            if (res && res.token) {
                saveUserData(res.token, );
                return { success: true, };
            }
            return { success: false, message: "Invalid credentials" };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "Server error during login" };
        }
    };

const Register = async (formData) => {
    try {
        const res = await fetch('http://localhost:5001/api/auth/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            // সফল হলে শুধু success পাঠাবে
            return { success: true };
        } else {
            // ৪. ব্যাকএন্ড থেকে আসা এরর (যেমন: User already exists) রিটার্ন করবে
            return { success: false, message: data.message || "Registration failed" };
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return { success: false, message: "Server connection error!" };
    }
};;

    const doctorSignIn = async ({ email, password }) => {
        try {
            const res = await doctorLoginRequest({ email, password }); 
            if (res && res.token) {
                saveUserData(res.token, res.role || 'doctor');
                return { success: true, role: res.role || 'doctor' };
            }
            return { success: false, message: "Invalid doctor credentials" };
        } catch (error) {
            console.error("Doctor Login Error:", error);
            return { success: false, message: error.message || "Doctor login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, doctorSignIn, logout,Register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};