import { Link, NavLink } from 'react-router'

function Navbar() {
  return (
    <header className="site-header">
      <div className="navbar">
        <Link className="site-name" to="/">Campus Event Hub</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>Events</NavLink>
          <NavLink to="/my-registrations">My Registrations</NavLink>
          <NavLink to="/organizer">Organizer</NavLink>
          <NavLink to="/login">Log in</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
