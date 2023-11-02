/*
    PURPOSE OF PAGE:
    - not currently in use for application
    - placeholder component to test how the profile card would function
*/

import React, { useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

function Profile({ showProfileDropdown, setShowProfileDropdown }) {
    const dropdownRef = useRef(null);

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowProfileDropdown]);

    if (!showProfileDropdown) return null;

    return (
        <div ref={dropdownRef} className="absolute mt-2 w-48 rounded-md shadow-lg bg-white z-10">
            <div className="py-1">
                <span className="block px-4 py-2 text-sm">Username</span>
                <Link to="../pages/Schedule.js" className="block px-4 py-2 text-sm hover:bg-gray-300">My Schedule</Link>
                <button onClick={() => { /* Handle Log off */ }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-300">
                    Log off
                </button>
            </div>
        </div>
    );
}

export default Profile;
