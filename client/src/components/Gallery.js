/*
  PURPOSE OF COMPONENT:
  - gallery component contains itself and the piStatus component
  - piStatus is used to show the user whether the raspberry pi flask server is online/offline
  - gallery is used to display all existing images in the linked S3 bucket
  - user can interact with the gallery by clicking on specific images which updates the GalleryContext component in real time
*/

import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useGallery } from "../context/GalleryContext";
import { HiAdjustments, HiRefresh } from "react-icons/hi"; // Import icons
import axios from "axios";
import { RxDragHandleDots1 } from "react-icons/rx";

function Gallery({ images, refreshImages }) {               // the image keys and urls from S3 are passed through as parameters (used to display content in the gallery)
  const { selectedImages, toggleSelection } = useGallery(); // access context variable which keeps track of what images have been selected
  const [sortOrder, setSortOrder] = useState("asc");        // add state for sorting order
  const [status, setStatus] = useState("offline");          // initialize state for raspberry pi status

  // sort the images based on the current sort order
  const sortedImages = [...images];
  if (sortOrder === "asc") {
    sortedImages.sort((a, b) => a.Key.localeCompare(b.Key));
  } else if (sortOrder === "desc") {
    sortedImages.sort((a, b) => b.Key.localeCompare(a.Key));
  }

  // toggle between 'asc', 'desc', and 'normal'
  const toggleSortOrder = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    }
  };

  // make an api call to node server
  // sends a ping to the flask server on the raspberry pi and awaits a response
  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await axios.get(
          "http://54.252.255.57:3001/api/piStatus"
        );
        console.log("Response from server:", response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching status:", error);
        setStatus("offline");
      }
    };

    getStatus();                                            // initial fetch

    const intervalId = setInterval(getStatus, 60000);       // set interval to fetch raspberry pi status every minute

    return () => clearInterval(intervalId);                 // clear the interval when the component is unmounted
  }, []);

  return (
    <Card>
      <div>
        <h1 className="pt-3 pb-3 font-k2d text-white text-center text-3xl">
          BROWSE THE GALLERY TO SYNC THE WORLD
        </h1>
        <div className="flex justify-center items-center bg-[#a11732] py-3">
          <div
            className=" bg-white bg-opacity-75 flex w-1/6 items-left justify-start rounded-full p-3 border-2 border-opacity-50 "
            style={{
              width: "200px",
              borderColor: status === "online" ? "green" : "red",
            }}
          >
            <RxDragHandleDots1
              className="w-8 h-7 "
              style={{
                color: status === "online" ? "green " : "red",
              }}
            />

            <p
              className="ml-8 uppercase font-k2d text-black"
              style={{
                color: status === "online" ? "green" : "red",
              }}
            >
              {status}
            </p>
          </div>
        </div>
        <div className="flex justify-between pt-3">
          <div></div>
          <div className=" md:w-4/6 max-h-[60vh] bg-black bg-opacity-30 backdrop-blur-sm p-5 rounded-md">
            <div className="grid justify-end mr-6">
              <div>
                <button
                  className="font-k2d py-3 px-6 rounded-full text-xl mr-2 text-black"
                  onClick={refreshImages}
                >
                  <HiRefresh className="inline-block align-middle text-2xl text-white" />
                </button>
                <button
                  className="font-k2d py-3 px-6 rounded-full text-xl text-white"
                  onClick={toggleSortOrder}
                >
                  <HiAdjustments className="inline-block align-middle text-2xl text-white" />{" "}
                  ({sortOrder})
                </button>
              </div>
            </div>
            <div
              className="max-h-[40vh] overflow-y-auto"
              style={{ overflowX: "hidden", paddingRight: "30px" }}
            >
              <div className="-m-1 flex flex-wrap md:-m-2 pt-4">
                {Array.isArray(sortedImages) && sortedImages.length > 0 ? (
                  sortedImages.map((image, index) => (
                    <div
                      key={index}
                      className="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-1 md:p-2"
                    >
                      <div
                        onClick={() => toggleSelection(image.Key)}
                        className={`relative ${
                          selectedImages.includes(image.Key)
                            ? "bg-blue-200"
                            : ""
                        } cursor-pointer transition duration-300 rounded-lg`}
                      >
                        <img
                          className={`hover:scale-110 transform transition duration-200 block mx-auto h-full object-cover object-center rounded-lg shadow-md ${
                            selectedImages.includes(image.Key)
                              ? "opacity-80"
                              : ""
                          }`}
                          src={image.imageUrl}
                          alt={image.Key}
                        />
                        {selectedImages.includes(image.Key) && (
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-blue-600 bg-opacity-30 text-white font-semibold rounded-lg"
                            onClick={() => toggleSelection(image.Key)}
                          >
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No images found.</p>
                )}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </Card>
  );
}

export default Gallery;
