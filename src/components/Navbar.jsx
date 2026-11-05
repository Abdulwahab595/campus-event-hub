import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router'
import { logoutUser } from '../store/authSlice'

function Navbar() {
  const user = useSelector((state) => state.auth.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className="site-header">
      <div className="navbar">
        <Link className="site-name" to="/">Campus Event Hub</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>Events</NavLink>
          {user?.role === 'student' && <NavLink to="/my-registrations">My Registrations</NavLink>}
          {user?.role === 'organizer' && <NavLink to="/organizer">Organizer</NavLink>}
          {user ? (
            <>
              <span>{user.name} ({user.role})</span>
              <button className="logout-button" type="button" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
