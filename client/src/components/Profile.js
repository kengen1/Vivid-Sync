/*
  PURPOSE OF COMPONENT:
  - component is not in use current as the profile card was defined in the Navbar component
*/

import React from "react";

function Profile({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className=" flex bg-black items-right justify-right ">
      <div className=" block border corder-black bg-white p-2 rounded ">
        <button className="items-right justify-right" onClick={onClose}>X</button>
        <p>Edit Account</p>
        <p>Personal Schedule</p>
        <p>Logout</p>
      </div>
    </div>
  );
}

export default Profile;
