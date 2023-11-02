/*
  PURPOSE OF PAGE:
  - let users create their own 16x16 images to display on the LED board
  - contains components Grid and its sub-component LED
*/

import React, { useState } from "react";
import Grid from "../components/Grid";

function Editor() {
  const [selectedColor, setSelectedColor] = useState("#0096FF");

  return (
    <div className=" bg-[url('/public/main.png')] bg-cover h-screen">
      <h1 className="pt-3 pb-3 font-k2d text-white text-center text-3xl">
        MAKE YOUR OWN DESIGN
      </h1>
      <div className="text-center mb-10">
        {" "}
        <label className="text-white font-k2d text-lg p-2 ">
          Choose your colour:
        </label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </div>
      <Grid selectedColor={selectedColor} />
    </div>
  );
}

export default Editor;
