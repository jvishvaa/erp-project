import React, { createContext, useState } from 'react'

const initialState={
    viewPeriodData:[],
    editData:[],
    isEdit: false,
}

export const  Context = createContext();

const ViewStore = ({children}) => {

    const[state,setState]=useState(initialState)

    return(
        <Context.Provider value={[state,setState]}>{children}</Context.Provider>
    )

}

export default ViewStore;