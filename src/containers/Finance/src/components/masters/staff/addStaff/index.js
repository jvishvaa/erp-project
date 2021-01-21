import React from 'react'
import Stepper from './stepper'
import { addStaffContextProvider as AddStaffContextProvider } from './_context'

function AddStaff (props) {
  return <AddStaffContextProvider alert={props.alert} >
    <Stepper />
  </AddStaffContextProvider>
}

export default AddStaff
