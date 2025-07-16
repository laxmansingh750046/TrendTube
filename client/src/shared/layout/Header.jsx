import {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Container, Logo } from '../components';
import { Link } from 'react-router-dom';
import { Search , ArrowLeft} from 'lucide-react'

function Header() {
  const [query, setQuery] = useState("");
  const [showLogo, setShowLogo] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [showArrowLeft, setShowArrowLeft] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  // Get auth state from Redux
  const isLoggedIn = useSelector(state => state.auth.status);
  const avatarUrl = useSelector(state => state.auth.user?.avatar);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowLogo(true);
      setShowSearch(true);
      setShowArrowLeft(false);
    } else {
      setShowLogo(true);
      setShowSearch(false);
      setShowArrowLeft(false);
    }
  }, [isMobile]);

  const handleSearch = (e) => {
    e.preventDefault();
  };
  
  const handleSearchIconInMini = () => {
    setShowLogo(false);
    setShowSearch(false);
    setShowArrowLeft(true);
  };

  const handleArrowLeft = () => {
    setShowLogo(true);
    setShowSearch(true);
    setShowArrowLeft(false);
  };
   
  return (
    <header className='fixed h-20 z-50 w-full'>
      <div className="relative py-3 shadow bg-slate-900 text-white">
        <Container>
          <div className="flex items-center justify-between">
            {/* Left side - Logo or Back arrow */}
            <div className="flex items-center">
              {showLogo && (
                <Link to="/">
                  <Logo 
                    width="150px" 
                    height='150px'
                    className=''
                  />
                </Link>
              )}
              
              {showArrowLeft && (
                <button 
                  onClick={handleArrowLeft}
                  className='text-white hover:text-gray-300 transition-colors mr-2'
                >
                  <ArrowLeft className='h-5 w-5'/>
                </button>
              )}
            </div>

            {/* Middle - Search form */}
            <div className="flex-1 max-w-md mx-4">
              {!showSearch && (
                <form
                  onSubmit={handleSearch}
                  className='flex items-center w-full px-4 py-2 
                    bg-white border border-gray-300 rounded-full shadow-sm 
                    focus-within:ring-2 focus-within:ring-blue-500'
                >
                  <input
                    autoFocus
                    type='text'
                    placeholder='search...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className='flex-1 bg-transparent outline-none px-2 text-black text-sm sm:text-base'
                  />
                  <button
                    type='submit'
                    className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'
                  >
                    <Search className='w-5 h-5'/>
                  </button>
                </form>
              )}
            </div>

            {/* Right side - Search icon or Avatar */}
            <div className="flex items-center">
              {showSearch && (
                <button
                  onClick={handleSearchIconInMini}
                  className='text-white hover:text-gray-300 transition-colors mr-4'
                >
                  <Search className='w-5 h-5'/>
                </button>
              )}

              {/* Show avatar if user is logged in */}
              {isLoggedIn && avatarUrl && (
                <Link to="/profile">
                  <img 
                    src={avatarUrl} 
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>
    </header>  
  );
}

export default Header;