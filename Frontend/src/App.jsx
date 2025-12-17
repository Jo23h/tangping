import './App.css'
import NavBar from './components/NavBar/NavBar'
import MainSection from './components/MainSection/MainSection'
import MemoSection from './components/MemoSection/MemoSection'

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <MainSection />
      <MemoSection />
    </div>
  )
}

export default App
