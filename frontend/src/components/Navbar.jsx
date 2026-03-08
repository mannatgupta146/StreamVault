import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import './Navbar.scss';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Add scroll listener for glassmorphism effect
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">StreamVault</span>
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/tv-shows">TV Shows</Link></li>
          {user && <li><Link to="/favorites">Favorites</Link></li>}
        </ul>
      </div>
      
      <div className="navbar-right">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <Search size={20} className="icon" />
          <input 
            type="text" 
            placeholder="Movies, shows and more" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <Bell size={24} className="icon" />
        <div className="user-profile">
          {user ? (
            <button className="btn-logout" onClick={onLogout} style={{background: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <LogOut size={24} className="icon" />
              <span>{user.name}</span>
            </button>
          ) : (
            <Link to="/login" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <LogIn size={24} className="icon" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
