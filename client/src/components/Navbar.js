/*
  PURPOSE OF COMPONENT:
  - basic navigation across web application
  - dynamically changes when screen side is reduced to show hamburger button
*/

import React, { useState } from "react";
import { HiOutlineX, HiOutlineMenuAlt2, HiUserCircle } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [toggleNav, setToggleNav] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const location = useLocation();
  const email = localStorage.getItem("email");

  const handleNavToggle = () => {
    setToggleNav(!toggleNav);
  };

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const handleOnClose = () => {
    setShowProfileCard(false);
  };

  // prevent rendering the Navbar on the login page
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/"
  ) {
    return null;
  }

  return (
    <div className="w-full bg-white text-black font-k2d">
      <div className="flex w-full items-center justify-between p-4 bg-white text-black">
        <div className="flex justify-start flex-auto">
          <Link
            to="/home"
            onClick={handleOnClose}
            className="flex items-center"
          >
            <img src="logov.png" alt="logo" className="w-100 h-10"></img>
            <span className="text-5xl text-[#A20B32] font-bold">
              VIVID SYNC
            </span>
          </Link>
        </div>
        <span
          onClick={handleNavToggle}
          className="flex md:hidden text-4xl items-center"
        >
          {toggleNav ? <HiOutlineX /> : <HiOutlineMenuAlt2 />}
        </span>
        <div className=" flex justify-end flex-auto">
          <div className="hidden md:flex items-center justify-end flex-grow">
            <div className=" p-4 text-2xl hover:underline">
              <Link to="/home" onClick={handleOnClose}>
                Home
              </Link>
            </div>
            <div className=" p-4 text-2xl hover:underline">
              <Link to="/schedule" onClick={handleOnClose}>
                Schedule
              </Link>
            </div>
            <div className=" p-4 text-2xl hover:underline">
              <Link to="/editor" onClick={handleOnClose}>
                Editor
              </Link>
            </div>
          </div>
          <div className="p-6 hidden md:flex items-center space-x-4 relative">
            <HiUserCircle
              className="text-4xl cursor-pointer"
              onClick={toggleProfileCard}
            />
            {showProfileCard && (
              <div
                className=" bg-white"
                style={{
                  width: "250px",
                  zIndex: 1000,
                  position: "absolute",
                  top: "60px",
                  right: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 15px rgba(0,0,0,0.5)",
                }}
              >
                <div className="text-right ">
                  <button className="text-black  " onClick={handleOnClose}>
                    X{" "}
                  </button>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <HiUserCircle className="text-4xl mb-4 h-13 w-13" />
                  <h2 className="text-xl md:uppercase font-semibold">
                    {email}
                  </h2>
                </div>
                <Link
                  to="/personalschedule"
                  className="block text-center mb-2 border-t border-gray-300 pt-2"
                  onClick={toggleProfileCard}
                >
                  My Schedule
                </Link>
                <Link
                  to="/"
                  className="block text-center text-red-500 hover:underline border-t border-gray-300 py-2"
                  onClick={toggleProfileCard}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-white shadow-sm p-4 ${
          toggleNav ? "" : "hidden"
        } transition-all duration-300 flex flex-col items-center`}
      >
        <ul className="flex flex-col items-center justify-center gap-4">
          <li className="text-2xl">
            <Link to="/Home">Home</Link>
          </li>
          <li className="text-2xl">
            <Link to="/schedule">Schedule</Link>
          </li>
          <li className="text-2xl">
            <Link to="/editor">Editor</Link>
          </li>
          <li className="text-2xl">
            <HiUserCircle
              className="text-4xl cursor-pointer"
              onClick={toggleProfileCard}
            />
            {showProfileCard && (
              <div
                style={{
                  width: "250px",
                  zIndex: 1000,
                  position: "absolute",
                  top: "60px",
                  right: "10px",
                  background: "#fff",
                  padding: "30px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
                }}
              >
                <div className="flex flex-col items-center mb-4">
                  <HiUserCircle className="text-4xl mb-4" />
                  <h2 className="text-xl font-semibold">{email}</h2>
                </div>
                <Link
                  to="/personalschedule"
                  className="block text-center mb-2 border-t border-gray-300 pt-2"
                  onClick={toggleProfileCard}
                >
                  My Schedule
                </Link>
                <Link
                  to="/"
                  className="block text-center text-red-500 hover:underline border-t border-gray-300 pt-2"
                  onClick={toggleProfileCard}
                >
                  Logout
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
