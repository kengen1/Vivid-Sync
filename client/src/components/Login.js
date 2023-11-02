/*
  PURPOSE OF COMPONENT:
  - authenticate user access to the web application

  LIMITATIONS:
  - users can bypass this by entering a different file directory into the browser
*/

import React from "react";
import { HiLockClosed, HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const [error, setError] = useState(null); // State variable for error message

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLogInClick() {
    const userData = {
      email,
      password,
    };

    // making post request to node server --> database to see if the user email and password match
    fetch("http://54.252.255.57:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((Response) => {
        console.log("test");
        if (Response.ok) {
          console.log("Login successful");

          // user email is stored for usage in other components (such as navbar and mySchedule)
          localStorage.setItem("email", userData.email);

          // session creation where users will be logged out after an hour
          setTimeout(() => {
            localStorage.removeItem("email");
            console.log("User has been automatically logged out after an hour");
            history("/");
          }, 3600000);
          history("/home");
        } else {
          setError("Invalid login credentials"); // Set error message
        }
      })
      .catch((error) => {
        setError("Invalid login credentials"); // Set error message
      });
  }

  return (
    <div
      className=" bg-[url('/public/login.png')] bg-cover flex flex-col justify-center items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          width: "1000px",
          padding: "85px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left section for Vivid Sync logo and description */}
        <div style={{ width: "60%" }}>
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <div className="font-k2d text-[#A20B32] text-6xl bold tracking-widest">
              VIVID SYNC
            </div>
            <div className="flex justify-center">
              <img src="logov.png" alt="logo" className="w-100 h-40"></img>
            </div>
            <div
              style={{ marginTop: "50px", color: "black" }}
              className="font-k2d text-xl"
            >
              Syncing Worlds through RGB
            </div>
          </div>
        </div>

        {/* Right section for the login form */}
        <div
          style={{
            width: "40%",
            borderLeft: "5px solid #A20B32  ",
            paddingLeft: "40px",
          }}
        >
          {!error && (
            <div style={{ marginBottom: "40px", textAlign: "center" }}>
              <div
                style={{ fontSize: "24px", fontWeight: "500", color: "black" }}
              >
                Welcome Back
              </div>
            </div>
          )}

          {error && (
            <div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "500",
                    color: "black",
                  }}
                >
                  Welcome Back
                </div>
              </div>
              <p className=" flex justify-center p-2 font-k2d text-[#d93025] text-l">
                {error}
              </p>
            </div>
          )}

          <div className="relative mb-5 flex items-center text-gray-400 focus-within:text-gray-600">
            <HiMail className="w-5 h-5 absolute ml-3 pointer-events-none" />
            <input
              name="Email"
              type="text"
              placeholder="Email"
              className=" pr-3 pl-10 pt-3 pb-3 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
              style={{
                width: "100%",
              }}
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="relative mb-5 flex items-center text-gray-400 focus-within:text-gray-600">
            <HiLockClosed className="w-5 h-5 absolute ml-3 pointer-events-none" />

            <input
              name="Password"
              type="password"
              placeholder="Password"
              className=" pr-3 pl-10 pt-3 pb-3 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2"
              style={{
                width: "100%",
              }}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <button
              className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 rounded font-k2d transform transition duration-200 
              hover:scale-110"
              style={{ width: "150px" }}
              onClick={handleLogInClick}
            >
              LOGIN
            </button>
          </div>

          <div style={{ textAlign: "center", fontSize: "16px" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black rounded font-semibold transition duration-200 ease-in-out transform hover:scale-110 hover:cursor-pointer active:scale-90 hover:underline "
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="flex absolute  bottom-0">
        <img className=" h-20  " src="WSU.png" alt="logo"></img>
      </div>
    </div>
  );
}

export default Login;
