import React, { StrictMode, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/authContext';
import './App.css';

import Home from './Pages/Home/Home';
import Login from './Pages/Login/login';
import ProtectedRoute from './Components/Common/ProtoectedRoute/Protected';

const Registration = lazy(() => import('./Pages/Registration/Registration'));
const DoctorLogin = lazy(() => import('./Pages/DoctorLogin/doctorLogin'));
const AdminDashboard = lazy(() => import('./Pages/AdminPanel/Dasboard/Dashboard'));
const UserDashboard = lazy(() => import('./Pages/User/UserDashbroad'));
const Footer = lazy(() => import('./Components/Common/Footer/Footer'));
const DoctorDashboard = lazy(() => import('./Pages/Doctor/DoctorDashboard'));
const DoctorProfile = lazy(() => import('./Pages/Doctor/DoctorProfile'));
const PrescriptionWriter = lazy(() => import('./Pages/Doctor/PrescriptionWriter'));
const DoctorPrescriptions = lazy(() => import('./Pages/Doctor/DoctorPrescriptions'));
const FindDoctor = lazy(() => import('./Pages/FindDoctor/findDoctor'));
const Profile = lazy(() => import('./Pages/Profile/profile'));
const MedicalReports = lazy(() => import('./Pages/userReports/Reports'));
const MyAppointments = lazy(() => import('./Pages/userAppiontments/UserAppiontments'));
const Services = lazy(() => import('./Pages/Services/services'));
const Contact = lazy(() => import('./Pages/Contact/contact'));

const Loader = () => (
  <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
    Loading Health Sync...
  </div>
);

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path='/footer' element={<Footer/>}/>
                
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/doctor-login" element={<DoctorLogin />} />
                
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

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;