/*
  PURPOSE OF PAGE:
  - display schedule information retaining to ALL users
  - calendar format
*/

import React, { useState, useEffect } from "react";

function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // fetch events from server when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://54.252.255.57:3001/api/schedule");
        const data = await response.json();
        const formattedEvents = {};
        // format and group events by date
        data.forEach((schedule) => {
          const formattedDate = new Date(schedule.date).toLocaleDateString();
          if (!formattedEvents[formattedDate]) {
            formattedEvents[formattedDate] = [];
          }
          formattedEvents[formattedDate].push({
            title: schedule.title,
            time: `${schedule.stime} - ${schedule.etime}`,
            start: schedule.stime,
            end: schedule.etime,
            author: schedule.author,
          });
        });
        // sort events for each date by their start time
        for (const date in formattedEvents) {
          formattedEvents[date].sort((a, b) => {
            return (
              new Date(`1970-01-01 ${a.start}`) -
              new Date(`1970-01-01 ${b.start}`)
            );
          });
        }
        // update state with fetched events
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };
    fetchData();
  }, []);
  // handler for when a specific day is clicked
  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowPopup(true);
  };
  // render each day of the month along with its events
  const renderDays = () => {
    const daysArray = [];
    const monthDays = daysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    const startingDay = firstDayOfMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    for (let i = 0; i < startingDay; i++) {
      daysArray.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }
    // render each day of the current month
    for (let i = 1; i <= monthDays; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const formattedDateStr = new Date(dateStr).toLocaleDateString();
      daysArray.push(
        <div
          key={i}
          onClick={() => handleDayClick(formattedDateStr)}
          className="calendar-day bg-white p-4 border rounded-lg hover:bg-gray-200 max-h-32 overflow-y-auto"
        >
          <div className="font-k2d text-black"> {i}</div>
          {events[formattedDateStr] && events[formattedDateStr].length > 0 && (
            <div className="event font-k2d text-[#A20B32] mt-2">
              <div>{events[formattedDateStr].length} schedule(s)</div>
            </div>
          )}
        </div>
      );
    }
    return daysArray;
  };
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      setShowPopup(false);
    }
  };

  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="bg-[url('/public/main.png')] bg-cover h-screen p-4 rounded-lg "
    >
      <div className="bg-black px-7 py-5 m-5 rounded-lg bg-opacity-25 backdrop-blur-sm ">
        <div className="flex bg-white p-2 rounded-md justify-between items-center mb-4">
          <button
            onClick={() =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
              )
            }
            className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-2 rounded-md font-k2d transform transition duration-200 
            hover:scale-110"
          >
            Prev
          </button>
          <h3 className="text-2xl font-k2d text-[#A20B32]  font-bold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
              )
            }
            className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-2 rounded-md font-k2d transform transition duration-200 
            hover:scale-110"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => (
            <div
              key={day}
              className="font-k2d text-black font-bold text-center bg-white rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>
        <div className=" grid grid-cols-7 gap-4 mt-2">{renderDays()}</div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col rounded-lg p-6 w-96 relative shadow-xl">
            <div className="text-black font-k2d text-xl mb-4 border-b pb-2">
              <div className="flex justify-between items-center">
                <h1>Schedules for {selectedDate}</h1>
                <button onClick={() => setShowPopup(false)} className=" text-black">
                  X
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-auto max-h-72 space-y-4 pr-4">
              {!events[selectedDate] && <h1>No Schedules for {selectedDate}</h1>}
              {events[selectedDate] &&
                events[selectedDate].map((event) => (
                  <div
                    key={event.time}
                    className="event text-black bg-gray-100 p-3 rounded-lg"
                  >
                    <div><strong>Title:</strong> {event.title}</div>
                    <div><strong>Scheduled time:</strong> {event.time}</div>
                    <div><strong>Scheduled by:</strong> {event.author}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #A20B32;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #b30000;
        }
      `}</style>
    </div>
  );
}

export default Schedule;
