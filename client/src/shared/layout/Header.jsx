import React, { useState } from 'react';
import { Container, Logo, LogoutButton } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react'; 

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/register', active: !authStatus },
  ];

  const handleNavClick = (slug) => {
    navigate(slug);
    setMenuOpen(false); 
  };

  return (
    <header className="relative py-3 shadow bg-gray-500 text-white">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo width="150px" />
          </Link>

          {/* Hamburger icon (mobile only) */}
          <button
            className="sm:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop nav */}
          <ul className="hidden sm:flex ml-auto gap-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavClick(item.slug)}
                      className="px-4 py-2 hover:bg-blue-100 hover:text-black rounded-full"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      
        
        {menuOpen && (
          <ul className="absolute top-full left-0 w-full bg-gray-600 sm:hidden flex flex-col items-start px-4 py-2 space-y-2 shadow-lg z-50">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavClick(item.slug)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-100 hover:text-black rounded"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        )}
        </Container>
    </header>
  );
}

export default Header;