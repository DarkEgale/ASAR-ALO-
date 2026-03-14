import React, { StrictMode } from 'react';
// HashRouter বদলে BrowserRouter ব্যবহার করা হয়েছে
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/authContext';
import './App.css';

import Registration from './Pages/Registration/Registration';
import Login from './Pages/Login/login';
import DoctorLogin from './Pages/DoctorLogin/doctorLogin';
import AdminDashboard from './Pages/AdminPanel/Dasboard/Dashboard';
import UserDashboard from './Pages/User/UserDashbroad';
import Footer from './Components/Common/Footer/Footer';
import Home from './Pages/Home/Home';
import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import DoctorProfile from './Pages/Doctor/DoctorProfile';
import PrescriptionWriter from './Pages/Doctor/PrescriptionWriter';
import DoctorPrescriptions from './Pages/Doctor/DoctorPrescriptions';
import ProtectedRoute from './Components/Common/ProtoectedRoute/Protected';
import FindDoctor from './Pages/FindDoctor/findDoctor';
import Profile from './Pages/Profile/profile';
import MedicalReports from './Pages/userReports/Reports';
import MyAppointments from './Pages/userAppiontments/UserAppiontments';
import Services from './Pages/Services/services';
import Contact from './Pages/Contact/contact';

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Home/>} />
              <Route path='/footer' element={<Footer/>}/>
              
              {/* Public Routes */}
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctor-login" element={<DoctorLogin />} />
              
              {/* Dashboards (Role/Schema specific) */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              <Route path="/user-dashboard" element={
                <ProtectedRoute>
                  <UserDashboard/>
                </ProtectedRoute>
              } />

              <Route path='/doctor-dashboard' element={
                <ProtectedRoute>
                  <DoctorDashboard/>
                </ProtectedRoute>
              }/>
              <Route path='/doctor-profile' element={
                <ProtectedRoute>
                  <DoctorProfile/>
                </ProtectedRoute>
              }/>
              <Route path='/prescription-writer' element={
                <ProtectedRoute>
                  <PrescriptionWriter/>
                </ProtectedRoute>
              }/>
              <Route path='/prescriptions' element={
                <ProtectedRoute>
                  <DoctorPrescriptions/>
                </ProtectedRoute>
              }/>
              <Route path='/user-profile' element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              }/>

              <Route path='/my-reports' element={
              <ProtectedRoute>
                <MedicalReports/>
              </ProtectedRoute>
              }/>

              <Route path='/my-appointments' element={
                <ProtectedRoute>
                  <MyAppointments/>
                </ProtectedRoute>
              }/>

              <Route path='/find-doctors' element={<FindDoctor/>}/>
              <Route path='/services' element={<Services/>}/>
              <Route path='/contact' element={<Contact/>}/>

              {/* Catch-all to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;