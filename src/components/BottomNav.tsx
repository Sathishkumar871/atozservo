import React from 'react';
import { TbSmartHome } from 'react-icons/tb';
import { MdOutlineExplore } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { BsFillChatRightHeartFill } from 'react-icons/bs';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

interface BottomNavProps {
  user: any;
  openLogin: () => void;
  openProfile: () => void;
  openPost: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  user,
  openLogin,
  openProfile,
  openPost,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProtectedRoute = (path: string) => {
    if (!user) {
      openLogin();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <TbSmartHome className="icon" />
        <div className="nav-label">Home</div>
      </div>

      <div
        className={`nav-item ${location.pathname === '/explore' ? 'active' : ''}`}
        onClick={() => navigate('/explore')}
      >
        <MdOutlineExplore className="icon" />
        <div className="nav-label">Explore</div>
      </div>

      <div className="post-button-wrapper" onClick={openPost}>
        <div className="post-glow-circle">
          <FiPlusCircle className="post-icon" />
        </div>
      </div>

      <div
        className={`nav-item ${location.pathname === '/category' ? 'active' : ''}`}
        onClick={() => navigate('/category')}
      >
        <BiCategory className="icon" />
        <div className="nav-label">Category</div>
      </div>

      <div
        className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}
        onClick={() => handleProtectedRoute('/chat')}
      >
        <BsFillChatRightHeartFill className="icon" />
        <div className="nav-label">Chat</div>
      </div>
    </div>
  );
};

export default BottomNav;
