import { NavLink } from "react-router-dom"
import Icon from "../Icon/Icon"
import css from "./Header.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { Modal } from "../Auth/Modal.tsx";       

type AuthMode = 'login' | 'register';

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [authMode, setAuthMode] = useState<AuthMode | null>(null);

    const { isLoggedIn, user, logout } = useAuth()

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto"
    }, [menuOpen])

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
   if (e.target instanceof HTMLElement && e.target.classList.contains(css.overlay)) {
    setMenuOpen(false);
  }
  };


  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  }

    return (
        <header className={css.header}>
            <NavLink className={css.navItem} to="/"><span className={css.logo}>psychologists.<span className={css.logoSpan}>services</span></span></NavLink>
            <nav className={css.nav}>
                <NavLink className={css.navItem} to="/">Home</NavLink>
                <NavLink className={({ isActive }) =>
            `${css.navItem} ${isActive ? css.active : ""}`
          } to="psychologists">
                    Psychologists                  
                </NavLink>
                {isLoggedIn &&  <NavLink className={({ isActive }) =>
            `${css.navItem} ${isActive ? css.active : ""}`
          } to="favorites">Favorites</NavLink>}
            </nav>

            {isLoggedIn ? <div className={css.loggedin}>
                <div className={css.profile}> 
                <div className={css.iconProfile}>
                    <Icon name="profile" width={16} height={16}/>
                </div>
                <span className={css.name}>{user ? String(user) : ""}</span>
                </div>
                <button onClick={handleLogout} type="submit" className={css.logoutBtn}>Log out</button>
            </div> :  <div className={css.buttons}>
                <button type="submit" className={css.loginBtn} onClick={() => setAuthMode('login')}>Log In</button>
                <button type="submit" className={css.registrationBtn} onClick={() => setAuthMode('register')}>Registration</button>
            </div>}
            <button className={css.iconMenu} onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name="menu" width={20} height={20}/>
            </button>

            {menuOpen && (
                <div className={css.overlay} onClick={handleOverlayClick}>
                 <div className={css.mobileMenu} >
                <nav className={css.navMob}>
                <NavLink className={css.navItem} to="/">Home</NavLink>
                <NavLink className={({ isActive }) =>
            `${css.navItem} ${isActive ? css.active : ""}`
          } to="psychologists">
                    Psychologists                  
                </NavLink>
                {isLoggedIn &&  <NavLink className={({ isActive }) =>
            `${css.navItem} ${isActive ? css.active : ""}`
          } to="favorites">Favorites</NavLink>}
            </nav>

            {isLoggedIn ? <div className={css.loggedinMob}>
                <div className={css.profile}> 
                <div className={css.iconProfile}>
                    <Icon name="profile" width={16} height={16}/>
                </div>
                <span className={css.name}>{user ? String(user) : ""}</span>
                </div>
                <button onClick={handleLogout} type="submit" className={css.logoutBtn}>Log out</button>
            </div> :  <div className={css.buttonsMob}>
                <button type="submit" className={css.loginBtn} onClick={() => setAuthMode('login')}>Log In</button>
                <button type="submit" className={css.registrationBtn} onClick={() => setAuthMode('register')}>Registration</button>
            </div>}
            </div>
                </div>
        )}
        {authMode && <Modal mode={authMode} onClose={() => setAuthMode(null)}/>}
        </header>
    )
}
