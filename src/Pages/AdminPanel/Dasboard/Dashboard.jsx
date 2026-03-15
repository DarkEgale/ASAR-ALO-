import { useState, useEffect } from "react";
import "./Dashboard.scss";

// Components
import Sidebar from "../../../Components/Common/Admin/Sidebar";
import StatCards from "../../../Components/Common/Admin/StatCards";
import AnalyticsChart from "../../../Components/Common/Admin/AnalyticsChart";
import DataTable from "../../../Components/Common/Admin/DataTable";
import DoctorRegistration from "../../DcotorRegistration/DoctorRegistration";

// Icons for Modals
import { X, Stethoscope, UserCog, Activity } from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState([]); 
    const [activeTab, setActiveTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [doctorForm, setDoctorForm] = useState({ 
        name: "", email: "", password: "", specialization: "", phone: "", availableTime: "" 
    });

    const token = localStorage.getItem('token');
    const BASE_URL = 'https://asar-alo.onrender.com/api/admin/auth';

    const fetchData = async (tab) => {
        setLoading(true);
        setStatusFilter("all");
        let endpoint = tab === 'appointments' ? 'appiontment' : tab === 'doctors' ? 'doctor' : 'user';
        
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/all`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const resData = await response.json();
            if (response.ok) {
                if (tab === "users") setData(resData.allUser || []);
                if (tab === "doctors") setData(resData.alldoctor || []); 
                if (tab === "appointments") setData(resData.allappiontments || []);
            }
        } catch (error) { console.error("Fetch Error:", error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(activeTab); }, [activeTab]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
   
        let subPath = activeTab === 'doctors' ? 'doctor' : 
                      activeTab === 'appointments' ? 'appiontments' : 'user';
        
        try {
            const response = await fetch(`${BASE_URL}/${subPath}/update/${selectedItem._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(selectedItem)
            });
            if (response.ok) {
                alert("Successfully Updated Data!");
                setIsModalOpen(false);
                fetchData(activeTab);
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        let subPath = activeTab === 'doctors' ? 'doctor' : 
                      activeTab === 'appointments' ? 'appiontments' : 'user';
        try {
            await fetch(`${BASE_URL}/${subPath}/delete/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchData(activeTab);
        } catch (error) { console.error(error); }
    };

    const handleDoctorRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/doctor/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(doctorForm)
            });
            if (response.ok) {
                alert("Doctor Registered!");
                setIsDoctorModalOpen(false);
                setDoctorForm({ name: "", email: "", password: "", specialization: "", phone: "", availableTime: "" });
                if(activeTab === "doctors") fetchData("doctors");
            }
        } catch (error) { console.error(error); }
    };

    const filteredData = data.filter(item => {
        const nameToSearch = (item.name || item.patientName || "").toLowerCase();
        const matchesSearch = nameToSearch.includes(searchTerm.toLowerCase());
        if (activeTab !== 'appointments') return matchesSearch;
        const itemStatus = (item.status || "pending").toLowerCase();
        return matchesSearch && (statusFilter === "all" || itemStatus === statusFilter);
    });

    return (
        <div className="admin-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onAddDoctor={() => setIsDoctorModalOpen(true)} />

            <main className="content">
                <header className="top-bar">
                    <div className="search-box">
                        <input type="text" placeholder={`Search ${activeTab}...`} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="admin-profile">
                        <span>Admin Shimul</span>
                        <div className="avatar">S</div>
                    </div>
                </header>

                <StatCards data={data} activeTab={activeTab} />
                <DoctorRegistration activeTab={activeTab}/>

                {activeTab === 'appointments' && <AnalyticsChart data={data} />}

                <div className="page-header-flex">
                    <h2 className="capitalize">{activeTab} Management</h2>
                    {activeTab === 'appointments' && (
                        <div className="status-filter-group">
                            {['all', 'pending', 'confirmed', 'completed'].map((status) => (
                                <label key={status} className={`filter-label ${statusFilter === status ? 'active' : ''}`}>
                                    <input type="radio" name="statusFilter" value={status} checked={statusFilter === status} onChange={(e) => setStatusFilter(e.target.value)} />
                                    {status}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <DataTable 
                    data={filteredData} 
                    activeTab={activeTab} 
                    loading={loading} 
                    onEdit={(item) => {setSelectedItem({...item}); setIsModalOpen(true);}}
                    onDelete={handleDelete}
                />
            </main>

            {/* --- ADD DOCTOR MODAL --- */}
            {isDoctorModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content doctor-form">
                        <div className="modal-header">
                            <h3><Stethoscope /> New Doctor</h3>
                            <button onClick={() => setIsDoctorModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleDoctorRegister} className="form-grid">
                            <input required placeholder="Full Name" value={doctorForm.name} onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})} />
                            <input required placeholder="Email" type="email" value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} />
                            <input required placeholder="Password" type="password" value={doctorForm.password} onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})} />
                            <input required placeholder="Specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} />
                            <input required placeholder="Phone" value={doctorForm.phone} onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})} />
                            <input required placeholder="Available Time (e.g. 10-20)" value={doctorForm.availableTime} onChange={(e) => setDoctorForm({...doctorForm, availableTime: e.target.value})} />
                            <button type="submit" className="save-btn full-btn">Register Doctor</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDIT MODAL (DYNAMIC BASED ON TAB) --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3><UserCog /> Edit {activeTab === 'doctors' ? 'Doctor Info' : 'Details'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" value={selectedItem.name || selectedItem.patientName || ""} 
                                    onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value, patientName: e.target.value})} />
                            </div>

                            {activeTab === 'doctors' ? (
                                <>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={selectedItem.email || ""} 
                                            onChange={(e) => setSelectedItem({...selectedItem, email: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Specialization</label>
                                        <input type="text" value={selectedItem.specialization || ""} 
                                            onChange={(e) => setSelectedItem({...selectedItem, specialization: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="text" value={selectedItem.phone || ""} 
                                            onChange={(e) => setSelectedItem({...selectedItem, phone: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Available Time</label>
                                        <input type="text" value={selectedItem.availableTime || ""} 
                                            onChange={(e) => setSelectedItem({...selectedItem, availableTime: e.target.value})} />
                                    </div>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label>{activeTab === 'appointments' ? 'Status' : 'Role'}</label>
                                    <select 
                                        value={(activeTab === 'appointments' ? selectedItem.status : selectedItem.role) || "pending"} 
                                        onChange={(e) => setSelectedItem(activeTab === 'appointments' ? {...selectedItem, status: e.target.value} : {...selectedItem, role: e.target.value})}
                                    >
                                        {activeTab === 'appointments' ? (
                                            <>
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            )}

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}