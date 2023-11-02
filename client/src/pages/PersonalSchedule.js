/*
  PURPOSE OF PAGE:
  - display schedule information for all schedules created by the logged in user
  - filter schedules into past and current
*/

import React, { useState, useEffect } from "react";
import { HiTrash } from 'react-icons/hi';

function PersonalSchedule() {
  const [schedules, setSchedules] = useState([]);
  const currentDate = new Date();
  currentDate.setHours(11, 0, 0, 0); // Sets the time to 11:00:00 AM
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // fetch all schedules that have the logged in user as the author
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://54.252.255.57:3001/api/schedule");
      const data = await response.json();
      const email = localStorage.getItem("email");
      const userSchedules = data.filter(
        (schedule) => schedule.author === email
      );
      setSchedules(userSchedules);
    };
    fetchData();
  }, []);

  // fetch all image objects in the S3 bucket
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://54.252.255.57:3001/api/images");
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);


  const currentSchedules = schedules.filter((schedule) => {
    return new Date(schedule.date) >= currentDate;
  });
  
  const pastSchedules = schedules.filter((schedule) => {
    return new Date(schedule.date) < currentDate;
  });

  // map the schedule.image element to the image keys in the S3 bucket
  const findImageUrlByKey = (imageKey) => {
    const imageObj = images.find((img) => img.Key === imageKey);
    return imageObj ? imageObj.imageUrl : null;
  };

  // display the mapped images
  const renderImages = (imageKeys, title) => (
    <div className="flex space-x-2">
      {imageKeys.map((imageKey, index) => {
        const imageUrl = findImageUrlByKey(imageKey) || imageKey;
        const imageAlt = `Image ${index + 1} for ${title}`;
        return (
          <img key={index} src={imageUrl} alt={imageAlt} className="w-10 h-10" />
        );
      })}
    </div>
  );

  const handleOnClose = () => {
    setIsOpen(false);
    setScheduleToDelete(null);
  };

  // confirmation pop-up before removing a schedule from the database
  const confirmDelete = () => {
    if (scheduleToDelete) deleteSchedule(scheduleToDelete);
  };

  // API call to express app that removes schedule from database
  const deleteSchedule = async (scheduleId) => {
    try {
      const response = await fetch(`http://54.252.255.57:3001/api/schedule/${scheduleId}`, {
        method: "DELETE",
      });

      const responseBody = await response.text();
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      if (response.status === 200) {
        setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
        handleOnClose();
      } else {
        console.error("Failed to delete schedule:", response.status, responseBody);
        alert("Failed to delete schedule");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Error deleting schedule");
    }
  };

  const showDeleteConfirmationModal = (scheduleId) => {
    setIsOpen(true);
    setScheduleToDelete(scheduleId);
  };

  const renderSchedules = (schedules) => {
    // sort schedules by date
    const sortedSchedules = schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <div className="max-h-50 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg">
        <div className="grid grid-cols-7 gap-5 p-5 items-center text-white font-k2d">
          <div className="text-center">No.</div>
          <div className="text-left">Images</div>
          <div className="text-center">Booking</div>
          <div className="text-center">Brightness</div>
          <div className="text-center">Date</div>
          <div className="text-center">Time</div>
          <div></div> {/* Empty header for the delete buttons */}

          {sortedSchedules.map((schedule, index) => (
            <React.Fragment key={index}>
              <div className="text-center">{index + 1}.</div>
              <div className="flex justify-left">{renderImages(schedule.images, schedule.title)}</div>
              <div className="text-xl md:uppercase text-center">{schedule.title}</div>
              <div className="flex justify-center">{schedule.brightness}</div>
              <div className="flex justify-center">
                {new Date(schedule.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex justify-center">
                {schedule.stime} - {schedule.etime}
              </div>
              <div className="flex justify-center">
                <button
                onClick={() => showDeleteConfirmationModal(schedule._id)}
                className="text-white hover:text-red-500 transition-colors"
                  aria-label="Delete"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <HiTrash className="w-5 h-5"/>
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div
      className=" bg-[url('/public/MySchedule.png')] bg-cover "
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="p-4">
          <h1 className="text-3xl text-white font-k2d">MY SCHEDULES</h1>
        </div>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm p-5 m-10 rounded-lg">
          <div className="flex border-b font-k2d text-white">
            <button
              className={`px-4 py-2 ${
                activeTab === "today" ? "border-b-2 border-red-500" : ""
              }`}
              onClick={() => setActiveTab("today")}
            >
              UPCOMING
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "past" ? "border-b-2 border-red-500" : ""
              }`}
              onClick={() => setActiveTab("past")}
            >
              PAST
            </button>
          </div>
          {activeTab === "today" && renderSchedules(currentSchedules)}
          {activeTab === "past" && renderSchedules(pastSchedules)}
        </div>
      </div>
      <div>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white pt-3 rounded-lg">
              <div className="p-6 text-black text-xl border-b-1 border-gray-200">
                Are you sure you want to delete this schedule?
              </div>
              <div className="p-3 text-center">
                <button
              className=" hover:scale-110 transform transition duration-200 p-3 w-40 bg-white text-[#A20B32] font-bold rounded mx-2"

                  onClick={confirmDelete}
                >
                  Yes
                </button>
                <button
                  className="hover:scale-110 transform transition duration-200 p-3 w-40 bg-white text-[#A20B32] font-bold rounded mx-2"
                  onClick={handleOnClose}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalSchedule;
