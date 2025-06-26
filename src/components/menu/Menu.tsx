import React, { useState, useEffect, useRef } from "react";
import "./Menu.css";

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-toggle" onClick={() => setOpen((prev) => !prev)}>
        ☰ Menu
      </button>

      {open && (
        <nav className="menu">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Menu;