import React, { createContext, useState } from 'react'



const initialState={
    editData:[],
    isEdit: false,
    check:'checking....'
}

export const  Context = createContext();

const QuestionStore = ({children}) => {

    const[state,setState]=useState(initialState)

    return(
        <Context.Provider value={[state,setState]}>{children}</Context.Provider>
    )

}

export default QuestionStore;
