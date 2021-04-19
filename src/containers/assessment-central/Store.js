import React, { createContext, useState } from 'react';

const initialState = {
  viewMoreData: [],
};

export const Context = createContext();

const Store = ({ children }) => {
  const [data, setData] = useState(initialState);
  return <Context.Provider value={[data, setData]}>{children}</Context.Provider>;
};

export default Store;
