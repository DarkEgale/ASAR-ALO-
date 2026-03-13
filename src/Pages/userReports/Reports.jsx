import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowLeft, Calendar, Search, FileDown } from 'lucide-react';
import './Reports.scss';

const MedicalReports = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // ডামি রিপোর্ট ডাটা (পরবর্তীতে এপিআই থেকে আসবে)
    const [reports, setReports] = useState([
        { id: 1, title: "Blood Test Report", date: "2024-02-15", doctor: "Dr. Ariful Islam", fileUrl: "/reports/blood-test.pdf" },
        { id: 2, title: "X-Ray Chest", date: "2024-01-20", doctor: "Dr. Sarah Ahmed", fileUrl: "/reports/xray.pdf" },
        { id: 3, title: "ECG Summary", date: "2023-12-05", doctor: "Dr. Tanvir Hasan", fileUrl: "/reports/ecg.pdf" },
    ]);

    const handleDownload = (fileUrl, title) => {
        // ডাউনলোড লজিক: সরাসরি লিঙ্কে পাঠানো বা ফাইল ডাউনলোড শুরু করা
        window.open(`http://localhost:5001${fileUrl}`, '_blank');
        console.log(`Downloading ${title}...`);
    };

    return (
        <div className="reports-page">
            {/* উপরের নেভিগেশন বার */}
            <div className="top-bar">
                <button className="back-btn" onClick={() => navigate('/user-dashboard')}>
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <h1>Medical Reports</h1>
            </div>

            <div className="reports-container">
                {/* সার্চ ফিল্টার */}
                <div className="search-section">
                    <div className="search-input">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search reports by title..." 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* রিপোর্ট লিস্ট */}
                <div className="reports-list">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.id} className="report-card">
                                <div className="report-info">
                                    <div className="icon-box">
                                        <FileText size={24} />
                                    </div>
                                    <div className="details">
                                        <h3>{report.title}</h3>
                                        <div className="meta">
                                            <span><Calendar size={14} /> {report.date}</span>
                                            <span>• Prescribed by {report.doctor}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    className="download-btn" 
                                    onClick={() => handleDownload(report.fileUrl, report.title)}
                                >
                                    <Download size={18} />
                                    <span>Download PDF</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <FileDown size={48} />
                            <p>No medical reports found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalReports;