/*
  PURPOSE:
  - react hook used to let all other components of the home page know what images have been selected by the user
*/

import React, { createContext, useContext, useState } from 'react';

const GalleryContext = createContext();

export const useGallery = () => {
  return useContext(GalleryContext);
};

export const GalleryProvider = ({ children }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const toggleSelection = (index) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((selected) => selected !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  return (
    <GalleryContext.Provider value={{ selectedImages, toggleSelection, clearSelection }}>
      {children}
    </GalleryContext.Provider>
  );
};
