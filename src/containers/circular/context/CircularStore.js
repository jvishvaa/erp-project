import React, { createContext, useState } from 'react'

const initialState={
    editData:[],
    isEdit: false,
}

export const  Context = createContext();

const CircularStore = ({children}) => {

    const[state,setState]=useState(initialState)

    return(
        <Context.Provider value={[state,setState]}>{children}</Context.Provider>
    )

}

export default CircularStore;
