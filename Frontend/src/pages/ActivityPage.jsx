import NavBar from '../components/Navbar/Navbar';
import Activity from '../components/Activity/Activity';

function ActivityPage() {
  return (
    <div className="app-container">
      <NavBar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Activity />
      </div>
    </div>
  );
}

export default ActivityPage;
