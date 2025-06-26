import React, { useState } from "react";
import "./main.css";

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="main-header">
        <img src="logo.jpg" alt="Logo" className="round-logo" />
        <h1>AtoZ Servos</h1>
        <button className="menu-toggle" onClick={() => setOpen((o) => !o)}>☰ Menu</button>
        {open && (
          <nav className="menu">
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Login</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        )}
      </header>

      <div className="content">
        <p>Your go-to hub for smart servo-powered solutions — now beautifully responsive across all screens!</p>
      </div>
    </>
  );
};

export default App;