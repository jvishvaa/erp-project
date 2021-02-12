import React, { createContext, useState } from 'react'

const initialState={
    editData:[],
}

export const  Context = createContext();

const GeneralDairyStore = ({children}) => {

    const[state,setState]=useState(initialState)

    return(
        <Context.Provider value={[state,setState]}>{children}</Context.Provider>
    )

}

export default GeneralDairyStore;