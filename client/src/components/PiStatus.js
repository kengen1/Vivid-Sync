/*
  PURPOSE OF COMPONENT:
  - check the online/offline status of the raspberry pi and LED strip board
  - send a ping to the flask server on the raspberry pi every minute
*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

function PiStatusIndicator() {
  const [status, setStatus] = useState("offline");

  // make get request to node server which will conduct the ping to the flask server
  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await axios.get("http://54.252.255.57:3001/api/piStatus");
        console.log("Response from server:", response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching status:", error);
        setStatus("offline");
      }
    };

    // initial fetch
    getStatus();

    // set interval to fetch status every minute
    const intervalId = setInterval(getStatus, 60000);
    // clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <div className="bg-[#A20B32] ">
        <div className="">
          <div
            className=" bg-white bg-opacity-50 flex w-1/6 items-left justify-start rounded-full p-3 border-2 border-opacity-50 "
            style={{
              width: "120px",
              borderColor: status === "online" ? "green" : "red",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: status === "online" ? "green" : "red",
              }}
            >
              <p className="absolute ml-8 uppercase font-k2d">{status}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PiStatusIndicator;
