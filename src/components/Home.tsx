// Home.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Menu from "./Menu";
import Notification from "./Notification";
import BottomNav from "./BottomNav";
import PostServiceForm from "./PostServiceForm";
import LoginPanel from "./LoginPanel";
import "./Home.css";
import { toast } from "react-toastify";

const Home = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  


  
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("/api/otp/check-session", { token })
        .then((res) => {
          if (res.data.valid) {
            setUser({ email: res.data.email });
          } else {
            localStorage.removeItem("token");
            setShowLogin(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setShowLogin(true);
        });
    } else {
      setShowLogin(true);
    }
  }, []);

  const handlePostClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowPostForm(true);
    }
  };

  return (
    <>
      <header className="sticky-header">
        <div className="header-content">
          <div className="logo-section">
            <img
              src="https://res.cloudinary.com/dlkborjdl/image/upload/v1751882045/WhatsApp_Image_2025-07-05_at_22.20.45_59cde82e_cavjfj.jpg"
              alt="AtoZ Logo"
              className="app-logo"
            />
            <span className="logo-text">atozservo</span>
          </div>

          <SearchBar />
          <Menu user={user} setUser={setUser} />

          {/* ✅ Pass isPanelOpen as prop to Notification */}
          <Notification isPanelOpen={isPanelOpen} />
        </div>
      </header>

      <main className="scrollable-content">
        <div className="long-box">
          <h1>Welcome to AtoZ Services!</h1>
        </div>
      </main>

      {showPostForm && (
        <PostServiceForm
          onClose={() => setShowPostForm(false)}
          user={user}
          openLogin={() => setShowLogin(true)}
        />
      )}

      {showLogin && (
        <LoginPanel
          onClose={() => setShowLogin(false)}
          onLogin={(userInfo) => {
            setUser(userInfo);
            toast.success("✅ Login Successful!");
            setShowLogin(false);
          }}
        />
      )}

      <BottomNav
    user={user}
    openLogin={() => setShowLogin(true)}
    openPost={handlePostClick}
     />
    </>
  );
};

export default Home;
