/*
  PURPOSE OF COMPONENT:
  - pop-up window to create a schedule
  - validates elements and then sends schedule info to node server
  - node server creates a new schedule record in database
*/

import React, { useState, useEffect } from "react";

function ScheduleButton({ visible, onClose, ObjectsToSchedule }) {
  //objects to schedule is passed through by ManageGallery component
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    author: "",
    title: "",
    date: "",
    stime: "",
    etime: "",
    images: "",
  });
  const [data, setData] = useState(10);

  const [titleErr, settitleErr] = useState("");
  const [dateErr, setdateErr] = useState("");
  const [timeErr, settimeErr] = useState("");

  useEffect(() => {
    // retrieve the email from localStorage and update the formData state
    const email = localStorage.getItem("email");
    if (email) {
      setFormData((formData) => ({ ...formData, author: email }));
    }
  }, []);

  // fetch image urls based on the objects to delete (keys to access on S3), store them to be displayed
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

  // map the objects to delete with the relevant image keys in S3
  const findImageUrlByKey = (imageKey) => {
    const imageObj = images.find((img) => img.Key === imageKey);
    return imageObj ? imageObj.imageUrl : null;
  };

  // validation for all inputs of the component
  const validate = () => {
    const errors = {};

    if (formData.title === "") {
      errors.title = "Booking Title is required";
    }

    if (!formData.date) {
      errors.date = "Booking Date is required";
    }

    if (!formData.stime) {
      errors.stime = "Start time is required";
    }
    if (formData.stime !== "") {
      if (!formData.etime) {
        errors.stime = "End time is required";
      }
    }
    if (formData.stime !== "" && formData.etime !== "") {
      if (formData.stime > formData.etime) {
        errors.stime = "Start time cannot be after end time.";
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(formData.date);
    inputDate.setHours(0, 0, 0, 0);

    if (formData.date !== "") {
      if (inputDate < today) {
        errors.date = "Date cannot be in past";
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  // reset input values when pop up is closed
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      setFormData({
        author: "",
        title: "",
        date: "",
        stime: "",
        etime: "",
        images: "",
      });
      onClose();
      settitleErr("");
      setdateErr("");
      settimeErr("");
    }
  };
  const handleOnClosex = (e) => {
    setFormData({
      author: "",
      title: "",
      date: "",
      stime: "",
      etime: "",
      images: "",
    });
    onClose();
    settitleErr("");
    setdateErr("");
    settimeErr("");
  };

  const handleAlert = () => {
    setIsOpen(false);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (errors) {
      settitleErr(errors.title);
      setdateErr(errors.date);
      settimeErr(errors.stime);
    } else {
      // check if the schedule is unique
      // check if schedule falls within the range of another existing schedule
      try {
        const checkResponse = await fetch(
          "http://54.252.255.57:3001/api/checkSchedule",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stime: formData.stime,
              date: formData.date,
            }),
          }
        );

        const checkResult = await checkResponse.json();
        if (!checkResult.isUnique) {
          setIsOpen(true);
          return; // exit the function to prevent submitting the form
        }

        // if the schedule is unique, proceed to submit the form
        const response = await fetch("http://54.252.255.57:3001/api/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: formData.author,
            title: formData.title,
            date: formData.date,
            stime: formData.stime,
            etime: formData.etime,
            brightness: data,
            images: ObjectsToSchedule,
          }),
        });

        if (!response.ok) {
          console.error("Server responded with an error:", response.statusText);
          alert("There was an error saving the schedule. Please try again.");
          return;
        }

        const result = await response.json();
        console.log(result);

        // clear form data
        setFormData({
          author: "",
          title: "",
          date: "",
          stime: "",
          etime: "",
          images: "",
        });

        // close the popup
        handleOnClosex(e);
      } catch (error) {
        console.error(
          "There was an error checking schedule uniqueness or saving the schedule",
          error
        );
        alert("An error occurred. Please try again.");
      }
    }
  };

  if (!visible) return null;

  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed  inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center"
    >
      <div className=" flex bg-[url('/public/schedule.png')] bg-cover pb-20 rounded w-1/2">
        <form onSubmit={handleOnSubmit} className="w-full mr-3 mt-3">
          <h1 className="font-bold font-k2d text-2xl  pt-5 text-center text-black  ">
            REVIEW SCHEDULE
          </h1>

          <style>
            {`
              input[type="date"]::-webkit-calendar-picker-indicator {
                filter: invert(0) brightness(0);
              }
            `}
          </style>
          <div className="h-5"></div>
          <style>
            {`
              input[type="date"]::-webkit-calendar-picker-indicator {
                filter: invert(0) brightness(0);
              }
            `}
            {`
              input[type="time"]::-webkit-calendar-picker-indicator {
                filter: invert(0) brightness(0);
              }
            `}
          </style>

          {/* Booking_Title */}
          <div id="form">
            {!titleErr && (
              <div className="mb-7">
                <div className="flex w-full items-center text-gray-400 focus-within:text-gray-600  ">
                  <p className=" font-bold w-1/3 m-2 font-k2d text-xl text-black items-right ">
                    BOOKING TITLE
                  </p>

                  <input
                    id="1"
                    className=" w-1/3  p-3 m-1  bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2"
                    type="text"
                    name="title"
                    placeholder="Enter booking title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            {titleErr && (
              <div>
                <div className=" flex w-full  text-gray-400 focus-within:text-gray-600  ">
                  <p className=" font-bold w-1/3 m-2 font-k2d text-xl text-black items-right ">
                    BOOKING TITLE
                  </p>

                  <div className="flex flex-col w-1/3">
                    <input
                      id="1"
                      className=" w-full  p-3 m-1  bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2"
                      type="text"
                      name="title"
                      placeholder="Enter booking title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                    <p className=" pb-2 flex  justify-start font-k2d text-[#d93025] text-sm">
                      {titleErr}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking_Date */}

            {dateErr && (
              <div>
                <div className=" flex w-full  text-gray-400 focus-within:text-gray-600">
                  <p
                    className="font-bold w-1/3 m-2 font-k2d text-xl text-black items-right "
                    htmlFor="date"
                  >
                    DATE
                  </p>

                  <div className="flex flex-col w-1/3">
                    {" "}
                    <input
                      id="2"
                      className="  w-full  p-3 m-1 border-2 bg-[#F9F9F9] rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                    <p className=" pb-2 flex justify-start font-k2d text-[#d93025] text-sm">
                      {dateErr}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!dateErr && (
              <div className="mb-7">
                <div className=" flex w-full items-center text-gray-400 focus-within:text-gray-600">
                  <p
                    className="font-bold w-1/3 m-2 font-k2d text-xl text-black items-right "
                    htmlFor="date"
                  >
                    DATE
                  </p>

                  <input
                    id="2"
                    className="  w-1/3  p-3 m-1 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Booking  Time */}

            {timeErr && (
              <div>
                <div className="  flex w-full  text-gray-400 focus-within:text-gray-600">
                  <p
                    className="font-bold w-1/3 m-2 font-k2d text-xl text-black items-right"
                    htmlFor="stime"
                  >
                    TIME
                  </p>
                  <div className="flex flex-col w-2/3">
                    <div className="flex items-center">
                      <input
                        id="3"
                        className=" w-1/8  p-3 m-1 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
                        type="time"
                        name="stime"
                        value={formData.stime}
                        onChange={(e) =>
                          setFormData({ ...formData, stime: e.target.value })
                        }
                      />
                      <p className=" mx-2 flex font-k2d text-black text-l">-</p>
                      <input
                        id="4"
                        className="w-1/8  p-3 m-1 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
                        type="time"
                        name="etime"
                        value={formData.etime}
                        onChange={(e) =>
                          setFormData({ ...formData, etime: e.target.value })
                        }
                      />
                    </div>
                    <p className="pb-2 flex justify-start font-k2d text-[#d93025] text-sm">
                      {timeErr}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!timeErr && (
              <div className="mb-7">
                <div className=" flex w-full items-center text-gray-400 focus-within:text-gray-600">
                  <p
                    className="font-bold w-1/3 m-2 font-k2d text-xl text-black items-right"
                    htmlFor="stime"
                  >
                    TIME
                  </p>
                  <input
                    id="3"
                    className=" w-1/8  p-3 m-1 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
                    type="time"
                    name="stime"
                    value={formData.stime}
                    onChange={(e) =>
                      setFormData({ ...formData, stime: e.target.value })
                    }
                  />
                  <p className=" mx-2 flex font-k2d text-black text-l">-</p>
                  <input
                    id="4"
                    className="w-1/8  p-3 m-1 bg-[#F9F9F9] border-2 rounded-md border-none outline-none ring-gray-300 focus:ring-gray-600 ring-2 "
                    type="time"
                    name="etime"
                    value={formData.etime}
                    onChange={(e) =>
                      setFormData({ ...formData, etime: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Brightness */}

            <div className="mb-5 flex w-full items-center text-gray-400 focus-within:text-gray-600">
              <p
                className="font-bold w-1/3 m-2 font-k2d text-xl text-black items-right "
                htmlFor="title"
              >
                BRIGHTNESS
              </p>
              <input
                className=" flex w-1/3 accent-black bg-gray-100  border-none "
                type="range"
                min="10"
                max="100"
                step="10"
                value={data}
                onChange={(e) => setData(e.target.value)}
              ></input>
              <p className="  flex justify-start font-k2d text-black text-l">
                {data}
              </p>
            </div>
            {/* Images */}
            <div className="mb-5  flex w-full items-center text-gray-400 focus-within:text-gray-600">
              <label
                className=" font-bold w-1/3 m-2 font-k2d text-xl text-black items-right"
                htmlFor="images"
              >
                IMAGES
              </label>
              <div className="w-2/3  grid grid-cols-5 gap-4">
                {ObjectsToSchedule.map((imageKey) => {
                  const imageUrl = findImageUrlByKey(imageKey);
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={imageKey}
                      key={imageKey}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : null;
                })}
              </div>
              <grid className="flex-auto"></grid>
            </div>

            <div className="text-right pb-3 pr-8">
              <button
                className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 m-2 rounded-md font-k2d transform transition duration-200 
              hover:scale-110"
                style={{ width: "150px" }}
              >
                CONFIRM
              </button>
              <button
                id="x"
                onClick={handleOnClosex}
                className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 m-2  rounded-md font-k2d transform transition duration-200 
              hover:scale-110"
                style={{ width: "150px" }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex  items-center justify-center ">
            <div className=" bg-white pt-3 rounded-lg">
              <div className="p-2 text-black text-xl border-b-1 border-gray-200">
                Sorry! The booking time is not available.
              </div>
              <div className="p-2 text-center">
                <button
                  className="bg-white text-blue-500 font-bold rounded"
                  onClick={handleAlert}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleButton;
