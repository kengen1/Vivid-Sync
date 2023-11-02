/*
  PURPOSE OF COMPONENT:
  - manipulate the gallery component
    - schedule selected images
    - delete selected images
    - upload new images from local device
*/

import React, { useState } from "react";
import Card from "./Card";
import UploadButtonModal from "./UploadButtonModal";
import { useGallery } from "../context/GalleryContext"; // Import the context hook to keep knowledge of what images are "selected"
import ScheduleButton from "./ScheduleButton";

function ManageGallery({ refreshImages }) {
  // Receive refreshImages as a prop
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { selectedImages } = useGallery(); // Access the selectedImages array from the context
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
  };
  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleDeleteAttempt = () => {
    if (selectedImages.length === 0) {
      setError("No images selected for deletion");
      setIsOpen(true);
      return;
    }

    // Show confirmation pop-up
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false); // close the confirmation pop-up
    handleDeleteClick(); // proceed with deletion
  };


  //function needs to remove images from both the database records and the S3 bucket (thus two POST requests and 2 endpoints)
  const handleDeleteClick = () => {
    // check if there are selected images to delete
    if (selectedImages.length === 0) {
      setError("No images selected for deletion");
      setIsOpen(true);
      return;
    }

    // create an array of image keys to delete
    const objectKeysToDelete = selectedImages.map((index) => `${index}`); // Replace with your actual key format

    // make a POST request to the node server's /delete endpoint
    fetch("http://54.252.255.57:3001/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ objectKeys: objectKeysToDelete }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Deleted objects:", data.deletedObjects);
        refreshImages();
      })
      .catch((error) => {
        console.error("Error deleting objects:", error);
        // Handle the error
      });

    // make a POST request to the node server's /deleteImages endpoint
    fetch("http://54.252.255.57:3001/api/deleteImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageIds: objectKeysToDelete }), // Send the imageIds to deleteImages
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Deleted images:", data);
        // Handle the response as needed
      })
      .catch((error) => {
        console.error("Error deleting images:", error);
        // Handle the error
      });
  };

  const handleScheduleClose = () => {
    setIsScheduleOpen(false);
  };

  const handleScheduleOpen = () => {
    const ScheduleImages = selectedImages.map((index) => `${index}`);

    if (selectedImages.length === 0) {
      setError("No images selected for Schedule");
      setIsOpen(true);
      setIsScheduleOpen(false);
      return;
    }
    if (selectedImages.length > 3) {
      setError("Please choose upto 3 Images");
      setIsOpen(true);
      setIsScheduleOpen(false);
      return;
    } else {
      setIsOpen(false);
      setIsScheduleOpen(true);
      return ScheduleImages;
    }
  };

  return (
    <Card>
      <div className="bg-transparent">
        <div className="text-right p-4 justify-center flex">
          <UploadButtonModal
            isOpen={isUploadModalOpen}
            onClose={handleUploadModalClose}
            refreshImages={refreshImages}
          />
          <button
            onClick={handleScheduleOpen}
            className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 rounded font-k2d transform transition duration-200 hover:scale-105 m-2 border-2 border-white"
            style={{ fontSize: "18px", padding: "10px 20px", width: "22%" }}
          >
            SCHEDULE
          </button>

          <button
            onClick={handleDeleteAttempt}
            className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 rounded font-k2d transform transition duration-200 
              hover:scale-105 m-2 border-2 border-white"
            style={{ fontSize: "18px", padding: "10px 20px", width: "22%" }}
          >
            DELETE
          </button>

          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center ">
              <div className="bg-white pt-3 rounded-lg w-96 mx-auto">
                <div className="p-6 text-black text-xl border-b border-gray-200 text-center">
                  Are you sure you want to delete the selected images?
                </div>
                <div className="flex justify-around p-3">
                  <button
                    className="bg-white text-blue-500 text-lg font-bold  flex-1 mx-2"
                    onClick={handleDeleteConfirm}
                  >
                    Yes
                  </button>
                  <button
                    className=" border-l border-gray-200 bg-white text-blue-500 text-lg font-bold  flex-1 mx-2"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          <ScheduleButton
            visible={isScheduleOpen}
            onClose={handleScheduleClose}
            ObjectsToSchedule={selectedImages}
          />
        </div>
        <div onClick={handleOnClose}>
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex  items-center justify-center ">
              <div className=" bg-white pt-3 rounded-lg">
                <div className="p-6 text-black text-xl border-b-1 border-gray-200">
                  {error}
                </div>
                <div className=" p-2 text-center ">
                  <button
                    className="bg-white text-[#A20B32] text-lg font-bold rounded "
                    onClick={handleOnClose}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ManageGallery;
