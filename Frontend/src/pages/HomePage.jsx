import NavBar from '../components/Navbar/Navbar';
import Home from '../components/Home/Home';

function HomePage() {
  return (
    <div className="app-container">
      <NavBar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Home />
      </div>
    </div>
  );
}

export default HomePage;
