/*
  PURPOSE OF COMPONENT:
  - used to containerize other components in a div that has a standardized design
  - not much functionality other than maintaining consistent design across the app
*/

import React from "react";

const Card = ({ children }) => {
  return <div className="w-full relative pb-10  ">{children}</div>;
};

export default Card;
