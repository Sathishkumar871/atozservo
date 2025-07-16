import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Explore from './components/Explore';
import Category from './components/Category';
import Chat from './components/Chat';
import ServiceDetails from './components/ServiceDetails';
import ChatRoom from './components/ChatRoom';
import EditProfile from './components/EditProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import socket from './socket';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { ServiceProvider } from './contexts/ServiceContext';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket Connected:", socket.id);
    });
    socket.emit("test", "Hello server from client!");
    socket.on("server-message", (data) => {
      console.log("Server says:", data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ServiceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/category" element={<Category />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route
            path="/edit-profile"
            element={
              <EditProfile
                user={{ email: "sample@example.com" }}
                onClose={() => console.log("Close EditProfile")}
                onComplete={() => console.log("Profile completed")}
              />
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        pauseOnHover
        closeOnClick
      />
    </ServiceProvider>
  );
}

export default App;