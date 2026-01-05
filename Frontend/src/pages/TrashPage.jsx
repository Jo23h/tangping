import NavBar from '../components/Navbar/Navbar';
import Trash from '../components/Trash/Trash';

function TrashPage() {
  return (
    <div className="app-container">
      <NavBar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Trash />
      </div>
    </div>
  );
}

export default TrashPage;
