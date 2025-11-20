import { Routes, Route } from 'react-router-dom'
import { Header } from '../Header/Header.tsx'
import Psychologists from '../../pages/Psychologists/Psychologists.tsx'
import Home from '../../pages/Home/Home.tsx'
// import Favorites from '../../pages/Favorites/Favorites.tsx'
// import { useAuth } from '../../context/AuthContext.tsx';
import './App.css'

function App() {
// const { isLoggedIn } = useAuth();

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/psychologists" element={<Psychologists />}/> 
        {/* <Route path="/favorites" element={isLoggedIn ? <Favorites /> : <Navigate to="/" replace/>  }/> */}
      </Routes>
    </div>
  )
}

export default App
