/*
  PURPOSE OF COMPONENT:
  - validation of signup inputs
  - create a new record in the database for a valid user
*/

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiLockClosed, HiMail, HiUser } from "react-icons/hi";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [nameErr, setnameErr] = useState("");
  const [emailerr, setemailerr] = useState("");
  const [passworderr, setpassworderr] = useState("");
  // email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // password regex pattern
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validate = () => {
    const errors = {};

    if (!firstName || !lastName) {
      errors.firstName = "First Name and Last Name required";
    }

    if (!email) {
      errors.email = "Email required";
    }
    if (email !== "") {
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email.";
      }
    }
    if (!password || !confirmPassword) {
      errors.password = "Password required";
    }
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        errors.password = "Passwords do not match ";
      }
      if (!passwordRegex.test(password)) {
        errors.password = "Password must:\n" +
        "• Be at least 8 characters long\n" +
        "• Include at least one lowercase letter\n" +
        "• Include at least one uppercase letter\n" +
        "• Include at least one digit\n" +
        "• Include at least one special character (@$!%*?&)";
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  // Event handlers to update state when input values change
  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }
  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  // event handler for the SIGN UP button
  async function handleSignUpClick() {
    const errors = validate();

    // construct the data to send in the POST request
    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    if (errors) {
      setnameErr(errors.firstName);
      setemailerr(errors.email);
      setpassworderr(errors.password);
    } else {
      try {
        // check if a user with the same email already exists
        const response = await fetch("http://54.252.255.57:3001/api/userExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email }),
        });

        if (response.status === 200) {
          setemailerr('A user with this email already exists');
          return;
        } else if (response.status !== 404) {
          throw new Error('Failed to check if user exists');
        }

        // make a POST request to the /register endpoint
        fetch("http://54.252.255.57:3001/api/signUp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }).catch((error) => {
          console.error("Error:", error);
        });
        setIsOpen(true);

      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  return (
    <div
      className="bg-[url('/public/Signup.png')] bg-cover flex flex-col justify-center items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          width: "1000px",
          padding: "50px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <div className="flex items-center justify-center font-k2d text-[#A20B32] text-6xl font-bold">
            <p className="mr-2">VIVID</p>
            <img src="logov.png" alt="logo" className="w-20" />
            <p className="ml-2">SYNC</p>
          </div>
        </div>

        <div
          className="mb-5"
          style={{ fontSize: "24px", fontWeight: "500", color: "black" }}
        >
          Get Started
        </div>

        {nameErr && (
          <div className="mb-5">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="relative flex w-1/2  items-center text-gray-400 focus-within:text-gray-600">
                <HiUser className="w-5 h-5 absolute ml-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="First Name"
                  className=" pr-3 pl-10 pt-3 pb-3 w-full mr-8 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </div>
              <div className="relative flex w-1/2 items-center text-gray-400 focus-within:text-gray-600">
                <HiUser className="w-5 h-5 absolute ml-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Last Name"
                  className=" pr-3 pl-10 pt-3 pb-3 w-full bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </div>
            </div>
            <p className=" font-k2d flex mt-2 justify-start text-[#d93025] text-sm">
              {nameErr}
            </p>
          </div>
        )}

        {!nameErr && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div className="relative mb-5 flex w-1/2  items-center text-gray-400 focus-within:text-gray-600">
              <HiUser className="w-5 h-5 absolute ml-3 pointer-events-none" />
              <input
                type="text"
                placeholder="First Name"
                className=" pr-3 pl-10 pt-3 pb-3 w-full mr-8 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div className="relative mb-5 flex w-1/2 items-center text-gray-400 focus-within:text-gray-600">
              <HiUser className="w-5 h-5 absolute ml-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Last Name"
                className=" pr-3 pl-10 pt-3 pb-3 w-full bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
          </div>
        )}

        {emailerr && (
          <div className="mb-5">
            <div className="relative flex w-full items-center text-gray-400 focus-within:text-gray-600">
              <HiMail className="w-5 h-5 absolute ml-3 pointer-events-none" />
              <input
                type="email"
                placeholder="Email"
                className=" pr-3 pl-10 pt-3 pb-3 w-full  bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <p className=" font-k2d flex mt-2 justify-start text-[#d93025] text-sm">
              {emailerr}
            </p>
          </div>
        )}

        {!emailerr && (
          <div className="relative mb-10 flex w-full items-center text-gray-400 focus-within:text-gray-600">
            <HiMail className="w-5 h-5 absolute ml-3 pointer-events-none" />
            <input
              type="email"
              placeholder="Email"
              className=" pr-3 pl-10 pt-3 pb-3 w-full  bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        )}

        {passworderr && (
          <div className="mb-5">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="relative flex w-1/2  items-center text-gray-400 focus-within:text-gray-600">
                <HiLockClosed className="w-5 h-5 absolute ml-3 pointer-events-none" />
                <input
                  type="password"
                  placeholder="Password"
                  className=" pr-3 pl-10 pt-3 pb-3 w-full mr-8 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="relative flex w-1/2  items-center text-gray-400 focus-within:text-gray-600">
                <HiLockClosed className="w-5 h-5 absolute ml-3 pointer-events-none" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className=" pr-3 pl-10 pt-3 pb-3 w-full  bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
            </div>
            <p className="pl-2 font-k2d mt-2 text-left text-[#d93025] text-sm" style={{ whiteSpace: 'pre-line' }}>
              {passworderr}
            </p>
          </div>
        )}

        {!passworderr && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div className="relative mb-5 flex w-1/2  items-center text-gray-400 focus-within:text-gray-600">
              <HiLockClosed className="w-5 h-5 absolute ml-3 pointer-events-none" />
              <input
                type="password"
                placeholder="Password"
                className=" pr-3 pl-10 pt-3 pb-3 w-full mr-8 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="relative mb-5 flex w-1/2  items-center text-gray-400 focus-within:text-gray-600">
              <HiLockClosed className="w-5 h-5 absolute ml-3 pointer-events-none" />
              <input
                type="password"
                placeholder="Confirm Password"
                className=" pr-3 pl-10 pt-3 pb-3 w-full  bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2  "
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
          </div>
        )}

        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={handleSignUpClick}
            className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 rounded font-k2d transform transition duration-200 
              hover:scale-110"
            style={{ width: "150px" }}
          >
            {" "}
            SIGN UP
          </button>
        </div>

        <div style={{ fontSize: "16px" }}>
          Already have an account?{" "}
          <Link
            to="/"
            className="text-black rounded font-semibold transition duration-200 ease-in-out transform hover:scale-110 hover:cursor-pointer active:scale-90 hover:underline "
          >
            Log in
          </Link>
        </div>
      </div>
      <div>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex  items-center justify-center ">
            <div className=" bg-white pt-3 rounded-lg">
              <div className="p-3 text-black text-xl border-b-1 border-gray-200">
                Your account has been successfully created
              </div>
              <div className=" p-3 bg-white text-center rounded-b-lg">
                <Link to="/" onClick={handleOnClose}>
                  <button
                    className="bg-white text-[#A20B32] font-bold rounded"
                    onClick={handleOnClose}
                  >
                    OK
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <div className="flex absolute  bottom-0">
        <img className=" h-20  " src="WSU.png" alt="logo"></img>
      </div> */}
    </div>
  );
}

export default SignUp;
