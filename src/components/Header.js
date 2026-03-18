import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { 
  FaShoppingBag, FaBars, FaTimes, FaUser, FaSignInAlt, 
  FaUserPlus, FaClipboardList, FaHeart, FaSignOutAlt, FaChevronDown 
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '../context/FirebaseContext';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  const [houseOpen, setHouseOpen] = useState(false);
   const [Othersopen, setOthersopen] = useState(false);
     const [afsopen, setafsopen] = useState(false);
     const [searchOpen, setSearchOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout } = useFirebase();

  const isLoggedIn = !!user;
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleNavigation = (path) => {
    setDeskOpen(false);
    setHouseOpen(false);
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
    <header className="main-header">
      <div className="header-container">
        
        {/* LOGO */}
        <div className="logo-section">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src="/images/afs1.jpeg" className="brand-logo" alt="AFS Logo" />
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className={`nav-links ${menuOpen ? 'mobile-active' : ''}`}>
          <NavLink to="/" className="nav-item">Home</NavLink>
          
          {/* DESK DROPDOWN */}
          <div 
            className="nav-item dropdown-trigger" 
            onMouseEnter={() => setDeskOpen(true)} 
            onMouseLeave={() => setDeskOpen(false)}
          >
            <div className="nav-label-content">
              Desk Name Plates <FaChevronDown className="arrow-icon"/>
            </div>
            <AnimatePresence>
              {deskOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="mega-menu"
                >
                  <div className="mega-menu-content">
                    <div className="menu-column">
                      <h6>Browse By Profession</h6>
                      <div className="menu-item-row" onClick={() => handleNavigation('/desk/doctors')}>Doctors & Dentists</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/desk/lawyers')}>Lawyers & Judges</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/desk/teachers')}>Teachers</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/desk/police')}>Police Officers</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* HOUSE DROPDOWN */}
          <div 
            className="nav-item dropdown-trigger" 
            onMouseEnter={() => setHouseOpen(true)} 
            onMouseLeave={() => setHouseOpen(false)}
          >
            <div className="nav-label-content">
              House Name Plates <FaChevronDown className="arrow-icon"/>
            </div>
            <AnimatePresence>
              {houseOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="mega-menu"
                >
                  <div className="mega-menu-content">
                    <div className="menu-column">
                      <h6>Styles & Features</h6>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/cutout')}>Cutout Plates</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/led')}>LED Name Plates</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/hanging')}>Hanging Plates</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/photo')}>Photo Plates</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/wallpapers" className="nav-item">Wallpapers</NavLink>
            <div 
            className="nav-item dropdown-trigger" 
            onMouseEnter={() => setOthersopen(true)} 
            onMouseLeave={() => setOthersopen(false)}
          >
            <div className="nav-label-content">
              Others <FaChevronDown className="arrow-icon"/>
            </div>
            <AnimatePresence>
              {Othersopen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="mega-menu"
                >
                  <div className="mega-menu-content">
                    <div className="menu-column">
                   
                      <div className="menu-item-row" onClick={() => handleNavigation('/Others/gst')}>Gst Name boards</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/lawyers')}>Kids Room Signs</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/teachers')}>Signages</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/house/police')}>Clocks</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
           
            <div 
            className="nav-item dropdown-trigger" 
            onMouseEnter={() => setafsopen(true)} 
            onMouseLeave={() => setafsopen(false)}
          >
            <div className="nav-label-content">
              AFS <FaChevronDown className="arrow-icon"/>
            </div>
            <AnimatePresence>
              {afsopen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="mega-menu"
                >
                  <div className="mega-menu-content">
                    <div className="menu-column">
                   
                      <div className="menu-item-row" onClick={() => handleNavigation('/gallery')}>Gallery</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/review')}>Review</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/about')}>About Us</div>
                      <div className="menu-item-row" onClick={() => handleNavigation('/contact')}>Contact Us</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
{/* 🔍 SEARCH */}
<div className="search-box">

  <div 
    className="search-icon"
    onClick={() => setSearchOpen(!searchOpen)}
  >
    <FaSearch />
  </div>

  {searchOpen && (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
  )}

</div>
        {/* ACTIONS */}
        <div className="header-actions">
          <div 
            className="account-wrapper" 
            onMouseEnter={() => setDropdownOpen(true)} 
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="btn-account">
              <FaUser /> <span>Account</span>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="account-dropdown"
                >
                  {!isLoggedIn ? (
                    <>
                      <div className="drop-link" onClick={() => handleNavigation('/login')}><FaSignInAlt/> Sign In</div>
                      <div className="drop-link" onClick={() => handleNavigation('/register')}><FaUserPlus/> Sign Up</div>
                    </>
                  ) : (
                    <>
                      <div className="drop-link" onClick={() => handleNavigation('/orders')}><FaClipboardList/> Orders</div>
                      <div className="drop-link" onClick={() => handleNavigation('/wishlist')}><FaHeart/> Wishlist {wishlistCount > 0 && <span className="badge-small">{wishlistCount}</span>}</div>
                      <div className="dropdown-divider"></div>
                      <div className="drop-link logout" onClick={handleLogout}><FaSignOutAlt/> Logout</div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


    <Link to="/cart" className="cart-btn">
  <div className="cart-icon-wrapper">
    <FaShoppingBag />
    {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
  </div>
</Link>

          <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </header>
   {searchOpen && (
  <div className="search-bar-full">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input-full"
    />
  </div>
)}
</>
  );
};

export default Header;