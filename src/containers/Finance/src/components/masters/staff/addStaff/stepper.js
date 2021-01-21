import React, { useState, useContext, useEffect } from 'react'

import StepperComponent from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'

import Step0 from './step0'
import Step1 from './step1'
import Step2 from './step2'

import { addStaffContext } from './_context'
/**
 * Presentational component for add staff page, business logic seperated for readability.
 */
function Stepper ({ match: { params: { id } } }) {
  const [step, setStep] = useState(0)
  const { handleFinish, handleValidation, role, alert } = useContext(addStaffContext)
  const [currentRole, setCurrentRole] = useState(JSON.parse(localStorage.getItem('user_profile')).personal_info.role)

  useEffect(() => {
    setCurrentRole(JSON.parse(localStorage.getItem('user_profile')).personal_info.role)
  }, [])

  const rolesWithNoMapping = [
    'Admin',
    'FOE',
    'Principal',
    // 'Academic Coordinator',
    'HR',
    'AdmissionCounsellor',
    'EA',
    'FinanceAccountant',
    'CIC',
    'InfrastructureManager',
    'MIS',
    'ExaminationHead',
    'CFO',
    'EA Academics',
    'Online Class Admin'

  ]
  return <div>
    <StepperComponent activeStep={step}>
      <Step >
        <StepLabel>Basic Details</StepLabel>
      </Step>
      { role && role.label !== 'HR' && currentRole !== 'HR' && role.label !== 'AdmissionCounsellor' && currentRole !== 'AdmissionCounsellor' && role.label !== 'ExaminationHead' && currentRole !== 'ExaminationHead' && <Step >
        <StepLabel>{role && (role.label === 'Teacher' || role.label === 'AcademicCoordinator') ? 'Teacher Associations' : 'Associations'}</StepLabel>
      </Step>}
      {role && role.label === 'LeadTeacher'
        ? <Step>
          <StepLabel>Lead Teacher Associations</StepLabel>
        </Step>
        : <p />}
    </StepperComponent>
    {step === 0 ? <Step0 /> : step === 1 ? <Step1 /> : <Step2 />}
    <div style={{ marginLeft: 24, marginTop: 8, marginBottom: 16 }}>
      <Button
        style={{ marginLeft: 8, marginRight: 8 }}
        onClick={() => step === 2 ? setStep(step - 1) : step === 1 ? setStep(step - 1) : ''}
      >
        Back
      </Button>
      <Button
        style={{ marginRight: 8 }}
        variant='contained'
        color='primary'
        onClick={() => step === 0
          ? handleValidation(id)
            ? (role && rolesWithNoMapping.includes(role.label)) ||
             currentRole === 'HR' || currentRole === 'ExaminationHead' ||
             currentRole === 'AdmissionCounsellor' ||
             (currentRole === 'Admin' &&
             role && role.label === 'HR' &&
              role && role.label === 'ExaminationHead' &&
              role && role.label === 'AdmissionCounsellor' &&
              role && role.label === 'CFO')
              ? handleFinish(id)
              : setStep(step + 1)
            : alert.warning('Please fill required details')
          : role.label !== 'LeadTeacher' ? handleFinish(id)
            : step === 2 ? handleFinish(id)
              : setStep(step + 1)}
      >
        { step === 0
          ? (role && rolesWithNoMapping.includes(role.label)) || currentRole === 'HR' || currentRole === 'AdmissionCounsellor' || currentRole === 'ExaminationHead' || (currentRole === 'Admin' && role && role.label === 'HR' && role && role.label === 'AdmissionCounsellor' && role && role.label === 'ExaminationHead' && role.label === 'CFO')
            ? 'Finish'
            : 'Next'
          : role && role.label !== 'LeadTeacher'
            ? 'Finish'
            : step === 2
              ? 'Finish'
              : 'Next'
        }
      </Button></div>
  </div>
}

export default withRouter(Stepper)
