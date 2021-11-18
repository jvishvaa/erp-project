import React from 'react';
import { MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
// import Button from '@material-ui/core/Button';

export default function Stepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  //change -----------------------------------------------------------------------------------------
  // const [datacertificate, setDatacertificate] = React.useState(props.datacertificate);

  // useEffect(() => {
  //   const [datacertificate, setDatacertificate] = React.useState('');
  //   console.log(props.datacertificate, 'test');
  // }, [props]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //change----------------------------------------------------------------------------------------
    // setDatacertificate(datacertificate[1], datacertificate[2]);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant='dots'
      steps={3}
      color='primary'
      position='static'
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        // <Button
        //   variant='outlined'
        //   size='small'
        //   onClick={handleNext}
        //   disabled={activeStep === 2}
        // >
        <KeyboardArrowRight onClick={handleNext} disabled={activeStep === 2} />
        // </Button>
      }
      backButton={
        // <Button
        //   variant='outlined'
        //   variant='text'
        //   size='small'
        //   onClick={handleBack}
        //   disabled={activeStep === 0}
        // >
        <KeyboardArrowLeft onClick={handleBack} disabled={activeStep === 0} />
        // </Button>
      }
    />
  );
}
