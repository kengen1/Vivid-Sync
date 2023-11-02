/*
    PURPOSE OF COMPONENT:
  - footer component that can be called in App.jsx so all existing pages have the same placement and details
*/

import React from 'react';
import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();

  //omitting the footer from specific pages in the application
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/"
  ) {
    return null;
  }

  return (
    <div className="flex justify-between items-center bg-black p-2.5 px-5 fixed bottom-0 left-0 w-full z-10 shadow-upward">
      <p className="text-white font-bold text-sm">Australia</p>
      <p className="text-white font-bold text-sm">Copyright © PS2318</p>
      <img src="/footerlogo.png" alt="Footer Logo" className="w-44 h-6 ml-2.5" />
    </div>
  );
}

export default Footer;
