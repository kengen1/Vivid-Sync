/*
  PURPOSE OF COMPONENT:
  - create a virtual version of the LED strip board display
  - let the user create custom images to display
  - store these images as an array of hexValues
  - send the the array in JSON format to the flask server on the raspberry pi
  - Pi will then display the image if online

  LIMITATIONS:
  - component currently doesn't function with existing features such as the scheduler
  - in the future the send to pi function should be replaced with the creation of file and schedule records in the database
*/

import React, { useState, useEffect } from "react";
import Led from "./Led";
import axios from "axios";

function Grid({ selectedColor }) {
  //these can be changed if future implementations of the project involve dynamic image sizes (or a bigger board size)
  const numRows = 16;
  const numCols = 16;


  const defaultColor = "#333333";

  // keep track of the hexValues associated with the users drawing
  const [hexValues, setHexValues] = useState(Array(numRows * numCols).fill(defaultColor));

  // validation to ensure users aren't sending multiple requests within 120 time frame
  const [lastClicked, setLastClicked] = useState(() => {
    const savedTimestamp = localStorage.getItem("lastClicked");
    return savedTimestamp ? new Date(savedTimestamp) : null;
  });

  const calculateRemainingTime = () => {
    if (!lastClicked) return 0;
    const currentTime = new Date();
    const timeElapsed = (currentTime - lastClicked) / 1000;
    const remainingTime = Math.max(120 - timeElapsed, 0);
    return remainingTime;
  };

  const [countdown, setCountdown] = useState(calculateRemainingTime);

  useEffect(() => {
    let interval;
    if (lastClicked) {
      setCountdown(calculateRemainingTime);
      interval = setInterval(() => {
        setCountdown((prevCountdown) => Math.max(prevCountdown - 1, 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lastClicked]);

  useEffect(() => {
    if (lastClicked) {
      localStorage.setItem("lastClicked", lastClicked.toISOString());
    }
  }, [lastClicked]);

  const isButtonDisabled = countdown > 0;


  // send the hexArray in a JSON format so that the flask server and python code on the Raspberry pi can understand what to display
  const handleSendToPi = async () => {
    setLastClicked(new Date());

    try {
      // alongside the hexArray, the request must include an end time (set to 2 mins in the future but can be changed if you want to display for longer)
      // display the content for 2 minutes
      const sydneyTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }));
      sydneyTime.setMinutes(sydneyTime.getMinutes() + 2);
      const etime = `${String(sydneyTime.getHours()).padStart(2, '0')}:${String(sydneyTime.getMinutes()).padStart(2, '0')}`;
      const response = await axios.post('http://54.252.255.57:3001/send-to-pi', { message: hexValues, etime });
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const [grid, setGrid] = useState(Array(numRows).fill().map(() => Array(numCols).fill(defaultColor)));

  // clears 2D array of its existing values and resets them back to black
  const resetGrid = () => {
    setGrid(Array(numRows).fill().map(() => Array(numCols).fill(defaultColor)));
    setHexValues(Array(numRows * numCols).fill(defaultColor));
  };

  // handle changing values and changing multiple grid elements in a single click
  const [isMousePressed, setIsMousePressed] = useState(false);

  const handleLedClick = (row, col) => {
    const newGrid = [...grid];
    const index = row * numCols + col;
    newGrid[row][col] = newGrid[row][col] === selectedColor ? defaultColor : selectedColor;
    const newHexValues = [...hexValues];
    newHexValues[index] = newGrid[row][col];
    setGrid(newGrid);
    setHexValues(newHexValues);
  };

  const handleMouseEnter = (row, col) => {
    if (isMousePressed) {
      const newGrid = [...grid];
      const index = row * numCols + col;
      newGrid[row][col] = selectedColor;
      const newHexValues = [...hexValues];
      newHexValues[index] = newGrid[row][col];
      setGrid(newGrid);
      setHexValues(newHexValues);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="bg-black rounded-lg px-20"
        style={{
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div
          onMouseDown={() => setIsMousePressed(true)}
          onMouseUp={() => setIsMousePressed(false)}
          onMouseLeave={() => setIsMousePressed(false)}
          className="m-10"
        >
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((color, colIndex) => (
                <div className="mr-3">
                  <Led
                    key={`${rowIndex}-${colIndex}`}
                    color={color}
                    onClick={() => handleLedClick(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    isMousePressed={isMousePressed}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            className="bg-[#A20B32] text-white hover:bg-red-700 p-2 m-2  rounded font-k2d transform transition duration-200 
              hover:scale-110"
            style={{ width: "100px" }}
            onClick={resetGrid}
          >
            Clear
          </button>
          <button
            className="bg-[#A20B32] text-white hover:bg-red-700 p-2 m-2 rounded font-k2d transform transition duration-200 
          hover:scale-110 "
            style={{ width: "100px" }}
            onClick={handleSendToPi}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? `${Math.ceil(countdown)}s` : "Send to Pi"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Grid;
