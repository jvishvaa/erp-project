import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Checkbox
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Assesment from "../../../containers/assessment-central";
import RemoveIcon from '@material-ui/icons/Remove';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';


const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    minWidth: 650,
  },
}));



function ColumnCard({ subComponentId, componentId, columnId,
  components,
  setComponentDetails }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openSum, setOpenSum] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpenSum = () => {
    setOpenSum(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSumClose = () => {
    setOpenSum(false);
  };

  const index = components.findIndex(
    componentDetail => componentDetail.id === componentId
  );

  const subComponents = components[index].subComponents
  const [table, setTable] = useState([])
  console.log('treeretable', table)

  const subComponentIndex = subComponents.findIndex(componentSubComponentDetail => componentSubComponentDetail.id === subComponentId)
  const columns = subComponents[subComponentIndex]?.columns

  const columnIndex = columns.findIndex(column => column.id === columnId)
  console.log("DEBUG all data", components, columnId, columnIndex)

  const getreportcardsubcomponent = () => {
    axiosInstance.get(`${endpoints.reportCardConfig.reportcardconfigsummary}`).then((res) => {
      setTable(res.data.result)
      console.log('treereport', res.data.result)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getreportcardsubcomponent()
  }, [])

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const rows = [
    createData('Branch 1', 159, 6.0, 24, 4.0),
    createData('Branch 2', 237, 9.0, 37, 4.3),
    createData('Branch 3', 262, 16.0, 24, 6.0),
    createData('Branch 4', 305, 3.7, 67, 4.3),
    createData('Branch 5', 356, 16.0, 49, 3.9),
  ];

  //Need to refactor
  const handleColumnSelectedTestChange = test => {
    //new
    const newComponent = components[index];
    setComponentDetails(
      components.map(componentDetail => {
        if (componentDetail.id === componentId) {
          const newSubComponent = componentDetail.subComponents[subComponentIndex]
          newSubComponent.columns[columnIndex].selectedTest = test
          newComponent.subComponents[subComponentIndex] = newSubComponent
          return newComponent;
        }
        return componentDetail;
      })
    );
  };
  console.log("check", components)


  const question_level_options = [
    { value: 1, Question_level: 'Top 4 Average' },
    { value: 2, Question_level: 'Best of All' },
    { value: 3, Question_level: 'Avg excluding lowest 2' },
  ];

  return (
    <>
      <Grid container spacing={2} style={{ margin: "0px" }}>
        <Grid item xs={12} sm={6} className={"filterPadding"}>
          <TextField
            style={{ width: "100%" }}
            id="subname"
            // label="Column Name"
            label="ASSESSMENT TYPE"
            variant="outlined"
            size="small"
            value={columns[columnIndex].name}
            name="subname"
            autoComplete="off"
            onChange={e => {
              const newComponent = components[index];
              setComponentDetails(
                components.map(componentDetail => {
                  if (componentDetail.id === componentId) {
                    const newSubComponent = componentDetail.subComponents[subComponentIndex]
                    newSubComponent.columns[columnIndex].name = e.target.value
                    newComponent.subComponents[subComponentIndex] = newSubComponent
                    return newComponent;
                  }
                  return componentDetail;
                })
              );
            }}
          />
        </Grid>
        <Grid container spacing={2} style={{ margin: "0px" }}>
          <Grid item xs={12} sm={3} className={"filterPadding"}>
            <Button
              style={{ width: "100%" }}
              variant="contained"
              color="primary"
              title="Test Selection"
              onClick={handleOpen}
            >
              Test Selection
            </Button>
            {/* {columns[columnIndex].selectedTest.length > 0 && <h6>Selected Test Id's: {columns[columnIndex].selectedTest.join(',')}</h6>} */}
            {columns[columnIndex].selectedTest.length > 0 && <h6 style={{ marginTop: "8px" }}>Selected Test Id's= {columns[columnIndex].selectedTest.length}</h6>}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              className={classes.modal}
            >
              <div
                className={classes.paper}
                style={{ width: "86%", height: "100%" }}
              >
                <Assesment
                  handleColumnSelectedTestChange={handleColumnSelectedTestChange}
                  handleClose={handleClose}
                />
              </div>
            </Modal>
          </Grid>

          <Grid item xs={12} sm={3} className={"filterPadding"}>
            <Button
              style={{ width: "100%" }}
              variant="contained"
              color="primary"
              title="Test Selection"
              onClick={handleOpenSum}
            >
              Summary
            </Button>
            <Modal
              open={openSum}
              onClose={handleSumClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              className={classes.modal}
            >
              <div
                className={classes.paper}
                style={{ width: "60%", height: "60%" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>Summary</div>
                  <div onClick={handleSumClose} style={{ position: 'relative', top: 0, left: 0 }}>X</div>
                </div>
                <div>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          {/* <TableCell>Summary</TableCell> */}
                          {table.map((data) =>
                          (
                            <>
                              <TableCell component="th" scope="row">
                                Summary
                              </TableCell>

                              {data.data.map((row) =>
                                <TableCell component="th" scope="row">
                                  {row.subject.subjects__subject_name}
                                </TableCell>
                              )}
                            </>
                          ))}

                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {table.map((row, index) => (
                          <TableRow key={index}>
                            {console.log('treerow', row)}
                            {console.log('treerow1', row.data)}

                            <TableCell align="right">{row.branch.branch_name}&nbsp;(g)
                            </TableCell>
                            {row.data.map((row) =>
                              <TableCell align="right">{row.tests}</TableCell>
                              // <TableCell align="right">bethsa</TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>

            </Modal>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ margin: "0px", display: "flex", alignItems: "center" }}>
          <Grid item xs={12} sm={3} className={"filterPadding"}>
            <TextField
              style={{ width: "100%" }}
              id="subname"
              label="METRICS/MARKS"
              variant="outlined"
              size="small"
              value={columns[columnIndex].weightage}
              name="subname"
              type="number"
              autoComplete="off"
              onChange={e => {
                const newComponent = components[index];
                setComponentDetails(
                  components.map(componentDetail => {
                    if (componentDetail.id === componentId) {
                      const newSubComponent = componentDetail.subComponents[subComponentIndex]
                      newSubComponent.columns[columnIndex].weightage = e.target.value
                      newComponent.subComponents[subComponentIndex] = newSubComponent
                      return newComponent;
                    }
                    return componentDetail;
                  }))
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              // onChange={handleQuestionLevel}
              id='Question Level'
              className='dropdownIcon'
              onChange={(event, data) => {
                console.log('right', data)
                const newComponent = components[index];
                setComponentDetails(
                  components.map(componentDetail => {
                    if (componentDetail.id === componentId) {
                      const newSubComponent = componentDetail.subComponents[subComponentIndex]
                      newSubComponent.columns[columnIndex].logic = data?.value
                      newComponent.subComponents[subComponentIndex] = newSubComponent
                      return newComponent;
                    }
                    return componentDetail;
                  }))
              }}
              // value={filterData?.question_level || {}}
              options={question_level_options || []}
              getOptionLabel={(option) => option?.Question_level || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Logic'
                  placeholder='Select Logic'
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={3} className={"filterPadding"}>
            <TextField
              style={{ width: "100%" }}
              id="subname"
              label="Logic"
              variant="outlined"
              size="small"
              // value={columnDetails[columnId].logic}
              name="subname"
              type="number"
              autoComplete="off"
              onChange={e => {
                const newComponent = components[index];
                setComponentDetails(
                  components.map(componentDetail => {
                    if (componentDetail.id === componentId) {
                      const newSubComponent = componentDetail.subComponents[subComponentIndex]
                      newSubComponent.columns[columnIndex].logic = e.target.value
                      newComponent.subComponents[subComponentIndex] = newSubComponent
                      return newComponent;
                    }
                    return componentDetail;
                  }))
              }}
            />
          </Grid> */}
          <Grid item xs={12} sm={3} style={{ paddingLeft: '0px !important' }}>
            <Button
              startIcon={<RemoveIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='small'
              style={{ color: 'white' }}
              title='Remove Individual Column'
              onClick={() => {
                // remove the column
                const newComponent = { ...components[index] };
                setComponentDetails(
                  components.map(componentDetail => {
                    if (componentDetail.id === componentId) {
                      const newSubComponent = { ...componentDetail.subComponents[subComponentIndex] }
                      console.log("DEBUG newSubComponent", { ...newSubComponent }, columnId)
                      const originalColumns = [...componentDetail.subComponents[subComponentIndex].columns]
                      const resultantColumns = originalColumns.filter(
                        column => column.id !== columnId
                      );
                      console.log("DEBUG newresultantCols", resultantColumns)
                      newSubComponent.columns = resultantColumns;
                      newComponent.subComponents[subComponentIndex] = newSubComponent
                      return newComponent;
                    }
                    return componentDetail;
                  })
                );
              }}
            >
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ColumnCard;