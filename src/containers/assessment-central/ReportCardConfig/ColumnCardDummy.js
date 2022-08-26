import React, { useEffect, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import cuid from "cuid";
import OtherDetailsCard from "./OtherDetailsCard";
import RemoveIcon from "@material-ui/icons/Remove";

function ColumnCard() {
  const [columnDetails, setColumnDetails] = useState([]);
  console.log('new', columnDetails)

  return (
    <>
      <Grid container spacing={2} style={{ margin: "0px" }}>
        <Grid item xs={12} sm={3} className={"filterPadding"}>
          <h4>Add Column Name</h4>
        </Grid>
        <Grid
          item
          xs={12}
          sm={1}
          className={"filterPadding"}
          style={{ paddingLeft: "0px !important" }}
        >
          <Button
            startIcon={<AddOutlinedIcon style={{ fontSize: "30px" }} />}
            variant="contained"
            color="primary"
            size="small"
            style={{ color: "white", border: "1px solid red" }}
            title="Create Other Fields"
            onClick={() => {
              const uniqueId = cuid();
              setColumnDetails(prevState => [
                ...prevState,
                {
                  id: uniqueId,
                  name: "",
                  selectedTest: [],
                  weightage: 0,
                  logic: 0,
                },
              ]);
            }}
          >
            {/* Sub-Component */}
          </Button>
        </Grid>
        {columnDetails?.map(column => {
          return (
            <div key={column.id}>
              <Grid item xs={12} sm={12} className={"filterPadding"}>
                <OtherDetailsCard
                  columnId={column.id}
                  columnDetails={columnDetails}
                  setColumnDetails={setColumnDetails}
                />
              </Grid>
              <Button
                startIcon={
                  <RemoveIcon
                    style={{ fontSize: "30px" }}
                  />
                }
                variant="contained"
                color="primary"
                size="small"
                style={{ color: "white" }}
                title="Remove Other Fields"
                onClick={() => {
                  const resultantColumnDetails = columnDetails.filter(
                    detail => detail.id !== column.id
                  );
                  setColumnDetails(resultantColumnDetails);
                }}
              ></Button>
            </div>
          );
        })}
      </Grid>
    </>
  );
}

export default ColumnCard;