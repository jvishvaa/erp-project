import React from "react";
import Card from "@material-ui/core/Card";
import Modal from "@material-ui/core/Modal";
// import Button from '@material-ui/core/Button'
// import DescriptiveTestCorrection from './descriptiveTestCorrection'
import DescriptvieTestEvaluvation from "./descriptvieTestEvaluvation/components/descriptiveTestEvaluvation";

const DescriptiveTestCorrectionModule = ({
  desTestDetails,
  mediaContent,
  handleClose,
  alert,
  open,
  callBackOnPageChange,
  isLoaded,
  dataT,
  handleSaveFile,
}) => {
  // const
  console.log(open, "ooooooo");
  return (
    <Modal open onClose={handleClose}>
      <Card
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          background: "grey",
          // padding: '40px'
        }}
      >
        <React.Fragment>
          <DescriptvieTestEvaluvation
            desTestDetails={desTestDetails}
            mediaContent={mediaContent}
            alert={alert}
            handleClose={handleClose}
            callBackOnPageChange={callBackOnPageChange}
            isLoaded={isLoaded}
            dataT={dataT}
            handleSaveFile={handleSaveFile}
          />
        </React.Fragment>
      </Card>
    </Modal>
  );
};

export default DescriptiveTestCorrectionModule;
