import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Paper
} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import RemoveIcon from '@material-ui/icons/Remove';
import SubComponentCard from './SubComponentCard';
import cuid from 'cuid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.primarylightest
  },
  paper: {
    marginLeft: '20px',
    width: '95%',
    border: '1px solid #E2E2E2',
    marginBottom: '20px'
  }
}));


function ComponentCard({ componentId, components, setComponentDetails }) {
  const classes = useStyles();
  const [gradingList, setGradingList] = useState([]);
  // const [gradingId , setGradingId] = useState()


  const index = components.findIndex(
    columnDetail => columnDetail.id === componentId
  );
  const subComponents = components[index].subComponents

  const [response, setResponse] = useState('');
  console.log('treeresponse', response)


  const getCurriculumData = () => {
    axiosInstance.get(`${endpoints.reportCardConfig.reportcardcomponent}`).then((res) => {
      console.log('tree', res.data.result)
      const modifiedResponse = res.data.result.map(
        (obj) => (obj && obj.component_type) || {}
      );
      // setResponse(modifiedResponse)
      setResponse(res.data.result)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchgradingData()
  },[])

  const fetchgradingData = () => {
    // setLoading(true);
    axiosInstance
      .get(`${endpoints.gradingSystem.GradingData}`)
      .then((res) => {
        // setLoading(false);
        setGradingList(res.data.result);
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error); // to give set Alert later
      });
  };

  const [rhul, setRult] = useState([])

  const ComponentCardsendingid = rhul.map((val) => val.id)

  useEffect(() => {
    getCurriculumData()
  }, [])

  const handleGrading = (e,item) => {
    // setGradingId(item?.id)
    const newComponent = components[index];
    newComponent.grading_system_id = item?.id;
    setComponentDetails(
      components.map(columnDetail => {
        if (columnDetail.id === componentId) {
          return newComponent;
        }
        return columnDetail;
      })
    );
  }

  return (
    <>
      <Paper elevation={2} className={classes.paper}>
        <Grid container spacing={1}>
          <Grid
            item
            container
            xs={12}
            sm={6}
            md={12}
            spacing={2}
            className={'filterPadding'}
          >
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, data) => {
                  console.log('orchids', data);
                  setRult([]);
                  if (data) {
                    const newComponent = components[index];
                    newComponent.componentName = data?.component_name;
                    setComponentDetails(
                      components.map((columnDetail) => {
                        if (columnDetail.id === componentId) {
                          return newComponent;
                        }
                        return columnDetail;
                      })
                    );

                    for (let val of response) {
                      if (data?.component_name === val?.component_name) {
                        setRult((pre) => [...pre, val]);
                      }
                    }
                  } else {
                    setRult([]);
                  }
                }}
                id='Question Level'
                className='dropdownIcon'
                // value={ || {}}
                // options={question_level_options || []}
                options={response || []}
                getOptionLabel={(option) => option?.component_type_value || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='CURRICULUM TYPE'
                    placeholder='CURRICULUM TYPE'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                style={{ width: '100%', marginLeft: '5px' }}
                size='small'
                // onChange={handleQuestionLevel}
                onChange={() => {
                  const newComponent = components[index];
                  debugger
                  newComponent.ComponentID = ComponentCardsendingid[0];
                  setComponentDetails(
                    components.map((columnDetail) => {
                      if (columnDetail.id === componentId) {
                        return newComponent;
                      }
                      return columnDetail;
                    })
                  );
                }}
                id='Question Level'
                className='dropdownIcon'
                // value={ || {}}
                // options={question_level_options || []}
                options={rhul || []}
                getOptionLabel={(option) => option?.component_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='CURRICULUM NAME'
                    placeholder='CURRICULUM NAME'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                style={{ width: '100%', marginLeft: '5px' }}
                size='small'
                onChange={(e, item) => handleGrading(e, item)}
                id='Grading System'
                className='dropdownIcon'
                // value={ || {}}
                // options={question_level_options || []}
                options={gradingList || []}
                getOptionLabel={(option) => option?.grading_system_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grading System'
                    placeholder='Grading System'
                  />
                )}
              />
            </Grid>

            {/* <TextField
              style={{ width: '100%', marginLeft: 4 }}
              id='subname'
              label='CURRICULUM NAME'
              variant='outlined'
              size='small'
              name='subname'
              autoComplete='off'
              value={components[index].name}
              onChange={(e) => {
                const newComponent = components[index];
                newComponent.name = e.target.value;
                setComponentDetails(
                  components.map(columnDetail => {
                    if (columnDetail.id === componentId) {
                      return newComponent;
                    }
                    return columnDetail;
                  })
                );
              }}
            /> */}
            {/* <Grid xs={12} sm={5}></Grid> */}
            {/* <div></div> */}
            {/* <Grid item xs={12} sm={4} className={"filterPadding"}>
            <TextField
              style={{ width: "100%" }}
              id="subname"
              // label="Column Name"
              label="CURRICULUM DESCRIPTION"
              variant="outlined"
              size="small"
              value={components[index].component_description}
              name="subname"
              autoComplete="off"
              onChange={(e) => {
                const newComponent = components[index];
                newComponent.component_description = e.target.value;
                setComponentDetails(
                  components.map(columnDetail => {
                    if (columnDetail.id === componentId) {
                      return newComponent;
                    }
                    return columnDetail;
                  })
                );
              }}
            // onChange={e => {
            //   const newComponent = components[index];
            //   setComponentDetails(
            //     components.map(componentDetail => {
            //       if (componentDetail.id === componentId) {
            //         const newSubComponent = componentDetail.subComponents[subComponentIndex]
            //         newSubComponent.columns[columnIndex].name = e.target.value
            //         newComponent.subComponents[subComponentIndex] = newSubComponent
            //         return newComponent;
            //       }
            //       return componentDetail;
            //     })
            //   );
            // }}
            />
          </Grid> */}
            {/* <Grid item xs={12} sm={4} className={"filterPadding"}>
            <TextField
              style={{ width: "100%" }}
              id="subname"
              // label="Column Name"
              label="GRADE DESCRIPTION"
              variant="outlined"
              size="small"
              value={components[index].grade_description}
              name="subname"
              autoComplete="off"
              onChange={(e) => {
                const newComponent = components[index];
                newComponent.grade_description = e.target.value;
                setComponentDetails(
                  components.map(columnDetail => {
                    if (columnDetail.id === componentId) {
                      return newComponent;
                    }
                    return columnDetail;
                  })
                );
              }}
            // onChange={e => {
            //   const newComponent = components[index];
            //   setComponentDetails(
            //     components.map(componentDetail => {
            //       if (componentDetail.id === componentId) {
            //         const newSubComponent = componentDetail.subComponents[subComponentIndex]
            //         newSubComponent.columns[columnIndex].name = e.target.value
            //         newComponent.subComponents[subComponentIndex] = newSubComponent
            //         return newComponent;
            //       }
            //       return componentDetail;
            //     })
            //   );
            // }}
            />
          </Grid> */}
            <Grid
              item
              xs={12}
              sm={2}
              md={3}
              container
              className={'filterPadding'}
              style={{ marginTop: '-10px' }}
              // style={{ paddingLeft: '0px !important' }}
            >
              <Grid item xs={12} md={6}>
                <Grid xs={12} md={11}>
                <Button
                  startIcon={<AddOutlinedIcon />}
                  variant='contained'
                  color='primary'
                  size='small'
                  style={{ color: 'white', fontSize:'inherit' }}
                  title='Create Sub-Component'
                  onClick={() => {
                    const subCompnentUniqueId = cuid();
                    const newComponent = [
                      ...subComponents,
                      {
                        id: subCompnentUniqueId,
                        subComponentsID: '',
                        columns: [],
                      },
                    ];
                    const newColumn = components[index];
                    newColumn.subComponents = newComponent;
                    setComponentDetails(
                      components.map((columnDetail) => {
                        if (columnDetail.id === componentId) {
                          return newColumn;
                        }
                        return columnDetail;
                      })
                    );
                  }}
                >
                  Add Term
                </Button>
                </Grid>
                
              </Grid>
              <Grid item xs={12} md={6}>
                {subComponents.length !== 0 ? (
                  // <Grid
                  //   item
                  //   xs={12}
                  //   sm={2}
                  //   md = {1.3}
                  //   className={'filterPadding'}
                  //   // style={{ paddingLeft: '0px !important' }}
                  //   style={{marginTop:'-10px'}}

                  // >
                  <Button
                    startIcon={<RemoveIcon />}
                    variant='contained'
                    color='primary'
                    size='small'
                    style={{ color: 'white', fontSize:'inherit'  }}
                    title='Remove Sub-Component'
                    onClick={() => {
                      const newColumn = components[index];
                      const resultantSubComponents = [...subComponents];
                      resultantSubComponents.pop();
                      newColumn.subComponents = resultantSubComponents;
                      setComponentDetails(
                        components.map((columnDetail) => {
                          if (columnDetail.id === componentId) {
                            return newColumn;
                          }
                          return columnDetail;
                        })
                      );
                    }}
                  >
                    {' '}
                    Delete Term
                  </Button>
                ) : (
                  //  </Grid>
                  <></>
                )}
              </Grid>
            </Grid>
          </Grid>

          {subComponents.map((subComponent) => (
            <SubComponentCard
              key={subComponent.id}
              subComponentId={subComponent.id}
              componentId={componentId}
              components={components}
              setComponentDetails={setComponentDetails}
              // gradingId = {gradingId}
            />
          ))}
        </Grid>
      </Paper>
    </>
  );
}

export default ComponentCard;
