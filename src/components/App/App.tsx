import { Routes, Route } from 'react-router-dom'
import { Header } from '../Header/Header.tsx'
import Psychologists from '../../pages/Psychologists/Psychologists.tsx'
import Home from '../../pages/Home/Home.tsx'
import Favorites from '../../pages/Favorites/Favorites.tsx'
import './App.css'
import { Toaster } from 'react-hot-toast'
import isLoggedIn from '../../pages/Psychologists/Psychologists.tsx'
import { Navigate } from 'react-router-dom'

function App() {

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/psychologists" element={<Psychologists />}/> 
        <Route path="/favorites" element={isLoggedIn() ? <Favorites /> : <Navigate to="/" replace/>  }/> 
      </Routes>
      <Toaster position='top-center'/>
    </div>
  )
}

export default App
