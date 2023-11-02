/*
  PURPOSE OF PAGE
  - landing page for user
  - displays the image gallery
  - allows users to create schedules and add/remove items from the gallery
  - displays the status of the raspberry pi hosted flask server
*/

import React, { useState, useEffect } from "react";
import Gallery from "../components/Gallery";
import { GalleryProvider } from "../context/GalleryContext";
import ManageGallery from "../components/ManageGallery";

function Home() {
  const [images, setImages] = useState([]);

  const refreshImages = () => {
    // fetch image URLs from your Express API
    fetch("http://54.252.255.57:3001/api/images")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching images:", error));
  };

  useEffect(() => {
    // fetch images when the component mounts
    refreshImages();
  }, []);

  return (
    <div className=" bg-[url('/public/main.png')] bg-cover h-screen">
      <GalleryProvider>
        <Gallery images={images} refreshImages={refreshImages} />
          <ManageGallery refreshImages={refreshImages} />
      </GalleryProvider>
    </div>
  );
}

export default Home;
