import { Trash2, UserCog, Clock } from "lucide-react";
import '../../../Pages/AdminPanel/Dasboard/Dashboard.scss'


export default function DataTable({ data, activeTab, loading, onEdit, onDelete }) {
    if (loading) return <div className="loader">Loading {activeTab}...</div>;

    return (
        <div className="table-wrapper">
            <table className="modern-table">
                <thead>
                    <tr>
                        <th>Basic Info</th>
                        <th>{activeTab === 'doctors' ? 'Expertise' : activeTab === 'users' ? 'Role' : 'Status'}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <div className="user-info">
                                    <div className="avatar">{(item.name || item.patientName || "A")[0]}</div>
                                    <div>
                                        <div className="name">{item.name || item.patientName}</div>
                                        <div className="sub">{item.email || item.phone}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {activeTab === 'doctors' ? (
                                    <div className="doctor-meta">
                                        <span className="spec-text">{item.specialization}</span>
                                        <small className="time-text"><Clock size={12}/> {item.availableTime}</small>
                                    </div>
                                ) : activeTab === 'users' ? (
                                    <span className="role-badge">{item.role || 'User'}</span>
                                ) : (
                                    <span className={`badge status-${(item.status || "pending").toLowerCase()}`}>
                                        {item.status || "Pending"}
                                    </span>
                                )}
                            </td>
                            <td>
                                <div className="action-btns">
                                    <button className="edit-btn" onClick={() => onEdit(item)}><UserCog size={16} /></button>
                                    <button className="delete-btn" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" className="empty-msg">No {activeTab} found..</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}