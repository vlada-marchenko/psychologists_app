import { Routes, Route } from 'react-router-dom'
import { Header } from '../Header/Header.tsx'
// import Psychologists from '../../pages/Psychologists/Psychologists.tsx'
import Home from '../../pages/Home/Home.tsx'
// import Favorites from '../../pages/Favorites/Favorites.tsx'

function App() {
// const isAuth = false

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        {/* <Route path="/psychologists" element={<Psychologists />}/> */}
        {/* <Route path="/favorites" element={isAuth && <Favorites /> }/> */}
      </Routes>
    </div>
  )
}

export default App
