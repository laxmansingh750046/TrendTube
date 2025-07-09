import React from 'react';
import { Container, Logo } from '../components';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className='fixed z-50 w-full'>
      <div className="relative py-3 shadow bg-slate-900 text-white">
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <Logo width="150px" />
            </Link>

            {/* Search Bar (middle) */}
            <div className="flex-1 max-w-xl mx-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-full text-black"
              />
            </div>

            {/* Empty div to balance the flex layout */}
            <div className="w-[150px]"></div>
          </div>
        </Container>
      </div>
    </header>  
  );
}

export default Header;