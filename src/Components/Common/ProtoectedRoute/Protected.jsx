

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // যদি টোকেন না থাকে, তবে তাকে জোর করে লগইন পেজে পাঠিয়ে দাও
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;