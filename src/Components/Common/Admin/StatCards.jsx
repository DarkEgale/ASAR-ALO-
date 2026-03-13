import '../../../Pages/AdminPanel/Dasboard/Dashboard.scss'


export default function StatCards({ data, activeTab }) {
    const stats = {
        total: data.length,
        pending: data.filter(i => i.status === 'pending').length,
        confirmed: data.filter(i => i.status === 'confirmed').length,
        completed: data.filter(i => i.status === 'completed').length,
    };

    return (
        <div className="stat-grid">
            <div className="stat-card">
                <h4>Total {activeTab}</h4>
                <p className="count">{stats.total}</p>
            </div>
            {activeTab === 'appointments' && (
                <>
                    <div className="stat-card pending">
                        <h4>Pending</h4>
                        <p>{stats.pending}</p>
                    </div>
                    <div className="stat-card confirmed">
                        <h4>Confirmed</h4>
                        <p>{stats.confirmed}</p>
                    </div>
                    <div className="stat-card completed">
                        <h4>Completed</h4>
                        <p>{stats.completed}</p>
                    </div>
                </>
            )}
        </div>
    );
}