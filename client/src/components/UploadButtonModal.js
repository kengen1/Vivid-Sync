/*
  PURPOSE OF COMPONENT:
  - handle api calls to S3 upload endpoints
  - upload a file with types jpeg,png,jpg to S3 bucket
  - create a record in the database called file
    - convert the image to an 16x16 array of pixels (hexValues) and add that into the record
*/

import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

// redundant function as Toast Notification component exists
function ToastNotification({ isVisible }) {
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      Successfully Uploaded
    </div>
  );
}

function UploadButtonModal({ isOpen, onClose, refreshImages }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(isOpen);
  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [hexArray, setHexArray] = useState([]); // Initialize hexArray state
  const author = localStorage.getItem("email");

  // function to generate the hexArray from an image
  const generateHexArray = (image) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 16;
    canvas.height = 16;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 16, 16);
      const pixelData = ctx.getImageData(0, 0, 16, 16).data;

      const hexArray = [];
      for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];
        const hexColor = `#${((r << 16) | (g << 8) | b)
          .toString(16)
          .padStart(6, "0")}`;
        hexArray.push(hexColor);
      }

      setHexArray(hexArray);
    };
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    onClose();
  };

  // replace old image display with new one if user changes their mind
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        generateHexArray(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const showSuccessToast = () => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000); // hide the toast after 3 seconds (adjust as needed)
  };

  const upload = () => {
    const formData = new FormData();

    // generate a unique identifier for the file name
    const uniqueIdentifier = Date.now();
    const fileNameWithIdentifier = `${uniqueIdentifier}_${file.name}`;

    formData.append("file", file);
    formData.append("fileNameWithIdentifier", fileNameWithIdentifier); // add the fileNameWithIdentifier to the form data

    axios
      .post("http://54.252.255.57:3001/api/upload", formData)
      .then((res) => {
        // close the modal after a successful upload
        handleUploadModalClose();
        // show the success toast
        showSuccessToast();
        // call the refreshImages function to refresh the Gallery
        console.log("author: ", author);
        // update the fileName property with the unique identifier
        const data = {
          fileName: fileNameWithIdentifier,
          source: author, // get email from local storage
          uploadDate: new Date(), // current date
          hexArray: hexArray, // get hexArray data
        };

        // secondary POST request to save data in MongoDB
        axios
          .post("http://54.252.255.57:3001/api/file", data)
          .then((res) => {
            // handle the response from the secondary POST request if needed
            console.log("Secondary POST request successful");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <button
        onClick={handleUploadClick}
        className="bg-[#A20B32] text-white hover:bg-red-700 px-4 py-3 rounded font-k2d transform transition duration-200 
              hover:scale-105 m-2 border-2 border-white"
        style={{ width: "22%" }}
      >
        UPLOAD
      </button>
      <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={handleUploadModalClose}
        contentLabel="Upload Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.125)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          },
          content: {
            width: "600px",
            height: "500px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "150px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <div className="p-4 w-5/6 h-96 flex flex-col justify-end items-center">
          <div
            className="placeholder-div"
            style={{
              width: "100%",
              height: "80%",
              border: "1px dashed #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <p>No image selected</p>
            )}
          </div>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            className="pt-6"
            onChange={handleFileChange}
          />
        </div>

        <div className="p-4">
          <button
            onClick={upload}
            className="bg-[#A20B32] hover:underline text-white font-bold p-3 m-3 rounded"
            style={{ width: "150px" }}
          >
            Submit
          </button>
        </div>
      </Modal>
      <ToastNotification isVisible={isToastVisible} />
    </>
  );
}

export default UploadButtonModal;
