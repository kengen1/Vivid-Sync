/*
  PURPOSE OF COMPONENT:
  - local storage of user email so that other components can display information retaining to the specific user logged in
*/

import { useEffect, useState } from "react";
import axios from "axios";

function SessionInfo() {
  const [data, setData] = useState("");

  useEffect(() => {
    // get request for data from the server
    axios
      .get("http://54.252.255.57:3001/api/session", {
        credentials: "include",
      })
      .then((response) => {
        // handle the response data
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <p>{data.email}</p>;
}

export default SessionInfo;
