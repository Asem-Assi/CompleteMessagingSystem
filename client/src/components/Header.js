import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';

const Header = () => {
  const { user, handleLogout } = useContext(Context);
  const navigate = useNavigate();



  return (
    <header>
      <div className='shadow-md flex items-center justify-center h-16 relative'>
        <img  className='h-16' alt='logo' />
        <div>
          {user?.name ? (
            <>
              <div className='absolute left-4'>{user?.name}</div>
              <button onClick={handleLogout} className='absolute right-4'>
                Logout
              </button>
            </>
          ) : (
            <div className='absolute left-4'>
              <button onClick={() => navigate('/signin')}>Sign in</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
