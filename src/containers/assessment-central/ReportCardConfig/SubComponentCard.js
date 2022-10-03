import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import cuid from 'cuid';
import ColumnCard from './ColumnCard';
import RemoveIcon from '@material-ui/icons/Remove';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';


function SubComponentCard({ subComponentId, componentId,
  components,
  setComponentDetails }) {

  const index = components.findIndex(
    componentDetail => componentDetail.id === componentId
  );

  const subComponents = components[index].subComponents
  const [response, setResponse] = useState('');
  const [newValue, setNewValue] = useState([])

  const subComponentIndex = subComponents.findIndex(componentSubComponentDetail => componentSubComponentDetail.id === subComponentId)
  const columns = subComponents[subComponentIndex]?.columns

  const getreportcardsubcomponent = () => {
    axiosInstance.get(`${endpoints.reportCardConfig.reportcardsubcomponent}`).then((res) => {
      setResponse(res.data.result)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getreportcardsubcomponent()
  }, [])

  return (
    <>
      <Grid container spacing={2} style={{ marginLeft: '30px' }}>
        <Grid item xs={12} sm={4} className={'filterPadding'}>

          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            // onChange={handleQuestionLevel}
            onChange={(event, data) => {
              const newComponent = components[index];
              setComponentDetails(
                components.map(componentDetail => {
                  if (componentDetail.id === componentId) {
                    const newSubComponent = componentDetail.subComponents[subComponentIndex]
                    newSubComponent.subComponentsID = data?.id;
                    newComponent.subComponents[subComponentIndex] = newSubComponent
                    return newComponent;
                  }
                  return componentDetail;
                })
              );
            }}
            id='Question Level'
            className='dropdownIcon'
            // value={new}
            // options={question_level_options || []}
            options={response || []}
            getOptionLabel={(option) => option?.sub_component_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Term/Semester'
                placeholder='Term/Semester'
              />
            )}
          />

          {/* <TextField
            style={{ width: '100%' }}
            id='subname'
            label='Term/Semester'
            variant='outlined'
            size='small'
            name='subname'
            autoComplete='off'
            value={components[index].subComponents[subComponentIndex].name}
            onChange={(e) => {
              const newComponent = components[index];
              setComponentDetails(
                components.map(componentDetail => {
                  if (componentDetail.id === componentId) {
                    const newSubComponent = componentDetail.subComponents[subComponentIndex]
                    newSubComponent.name = e.target.value;
                    newComponent.subComponents[subComponentIndex] = newSubComponent
                    return newComponent;
                  }
                  return componentDetail;
                })
              );
            }}
          /> */}
        </Grid>
        {((components[index]?.componentName !== 'PTSD') || (components[index]?.componentName === 'PTSD' && components[index]?.subComponents[subComponentIndex]?.columns?.length === 0)) && <Grid item xs={12} sm={3} className={'filterPadding'} style={{ paddingLeft: '0px !important' }}>
          <Button
            startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
            variant='contained'
            color='primary'
            size='small'
            style={{ color: 'white' }}
            title='Create Column'
            onClick={() => {
              //add column to the subcomponent
              const columnUniqueId = cuid();
              const newComponent = components[index];
              // if(components[index]?.ComponentID === 34 && components[index]?.subComponents?.length === 1){
              //   setAlert('Cannot add more assessment for PTSD !')
              // }else{
                setComponentDetails(
                  components.map(componentDetail => {
                    if (componentDetail.id === componentId) {
                      const newSubComponent = componentDetail.subComponents[subComponentIndex]
                      const newColumns = [...componentDetail.subComponents[subComponentIndex].columns, {
                        id: columnUniqueId,
                        name: '',
                        selectedTest: [],
                        weightage: '',
                        logic: 0,
                        priority : 0,
                      }]
                      newSubComponent.columns = newColumns;
                      newComponent.subComponents[subComponentIndex] = newSubComponent
                      return newComponent;
                    }
                    return componentDetail;
                  })
                );
              // }
             
            }}
          >
            Add Assessment
          </Button>
        </Grid>}
        {/* <Grid
          item
          xs={12}
          sm={1}
          className={"filterPadding"}
          style={{ paddingLeft: "0px !important" }}
        >
          <Button
            startIcon={<RemoveIcon style={{ fontSize: "30px" }} />}
            variant="contained"
            color="primary"
            size="small"
            style={{ color: "white" }}
            title="Remove Column"
            onClick={() => {
              const newColumn = components[index];
              let resultantSubComponents = [...subComponents];
              resultantSubComponents = resultantSubComponents.filter(
                subCom => subCom.id !== componentId
              );
              newColumn.subComponents = resultantSubComponents;
              setComponentDetails(
                components.map(columnDetail => {
                  if (columnDetail.id === componentId) {
                    return newColumn;
                  }
                  return columnDetail;
                })
              );
            }}
          ></Button>
        </Grid> */}
        {/* {columns.length !== 0 ? (
          <Grid item xs={12} sm={1} className={'filterPadding'} style={{ paddingLeft: '0px !important' }}>
            <Button
              startIcon={<RemoveIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='small'
              style={{ color: 'white' }}
              title='Remove Column'
              onClick={() => {
                // remove the subcomponent
                const newComponent = components[index];
                setComponentDetails(
                  components.map(componentDetail => {
                    if (componentDetail.id === componentId) {
                      const newSubComponent = componentDetail.subComponents[subComponentIndex]
                      newSubComponent.columns = [];
                      newComponent.subComponents[subComponentIndex] = newSubComponent
                      return newComponent;
                    }
                    return componentDetail;
                  })
                );
              }}
            >
            </Button>
          </Grid>) : <></>} */}
        {columns?.map((column) => (
          <ColumnCard key={column.id} subComponentId={subComponentId} componentId={componentId} columnId={column.id}
            components={components}
            setComponentDetails={setComponentDetails} />
        ))}
      </Grid>
    </>
  );
}

export default SubComponentCard;
