import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);

  return (
    <PostContext.Provider value={{ isPostSuccessful, setIsPostSuccessful }}>
      {children}
    </PostContext.Provider>
  );
};
