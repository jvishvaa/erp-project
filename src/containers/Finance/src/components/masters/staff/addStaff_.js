import React, { useState } from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Step0 from './addStaff/step0'
import Step1 from './addStaff/step1'

import { addStaffContextProvider as AddStaffContextProvider } from './addStaff/_context'

/**
 * Presentational component for add staff page, business logic seperated for readability.
 */
function AddStaff () {
  const [step, setStep] = useState(0)
  function handleFinish () {
    console.log('Finished')
  }
  return <AddStaffContextProvider >
    <div>
      <Stepper activeStep={step}>
        <Step >
          <StepLabel>Basic Details</StepLabel>
        </Step>
        <Step >
          <StepLabel>Associations</StepLabel>
        </Step>
      </Stepper>
      { step === 0 ? <Step0 /> : <Step1 />}
      <div style={{ marginLeft: 24, marginTop: 8 }}>
        <Button
          style={{ marginLeft: 8, marginRight: 8 }}
          onClick={() => step === 1 ? setStep(step - 1) : ''}
        >
          Back
        </Button>
        <Button
          style={{ marginRight: 8 }}
          variant='contained'
          color='primary'
          onClick={() => step === 0 ? setStep(step + 1) : handleFinish()}
        >
          { step === 0 ? 'Next' : 'Finish'}
        </Button></div>
    </div>
  </AddStaffContextProvider>
}

export default AddStaff
