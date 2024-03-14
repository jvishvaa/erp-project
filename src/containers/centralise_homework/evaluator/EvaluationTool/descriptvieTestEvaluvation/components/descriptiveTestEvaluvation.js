import React from "react";
import { DescriptiveTestContextProvider } from "../context/index";
import Evaluvation from "./contextWrapped";

function DescriptiveTestEvaluvationModule({
  alert,
  desTestDetails,
  mediaContent,
  handleClose,
  callBackOnPageChange,
  isLoaded,
  dataT,
  handleSaveFile,
}) {
  return (
    <React.Fragment>
      <DescriptiveTestContextProvider
        alert={alert}
        desTestDetails={desTestDetails}
        mediaContent={mediaContent}
        handleClose={handleClose}
        callBackOnPageChange={callBackOnPageChange}
        isLoaded={isLoaded}
        dataT={dataT}
        handleSaveFile={handleSaveFile}
      >
        <Evaluvation />
      </DescriptiveTestContextProvider>
    </React.Fragment>
  );
}
export default DescriptiveTestEvaluvationModule;
