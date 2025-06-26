import React from "react";
import Menu from "./components/menu/Menu";
import "./components/menu/Menu.css";

function App() {
  return (
    <>
      <header className="main-header">
        <img src="/logo.png" alt="Logo" className="round-logo" />
        <h1>AtoZ Servos</h1>
        <Menu />
      </header>

      <div className="content">
        <p>
          Your go-to hub for smart servo-powered solutions — now beautifully
          responsive across all screens!
        </p>
      </div>
    </>
  );
}

export default App;