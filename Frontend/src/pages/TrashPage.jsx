import NavBar from '../components/NavBar/Navbar';
import Trash from '../components/Trash/Trash';

function TrashPage() {
  return (
    <div className="app-container">
      <NavBar />
      <Trash />
      <div className="memo-section-placeholder"></div>
    </div>
  );
}

export default TrashPage;
