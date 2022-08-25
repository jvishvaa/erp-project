import React, { useEffect, useState } from 'react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';
import cuid from 'cuid';
import ComponentCard from './ComponentCard';
import RemoveIcon from '@material-ui/icons/Remove';

function CreateReportConfig() {
  //   const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // const [allData, setAllData] = useState();
  const [questions, setQuestions] = useState([
    // {
    //   id: cuid(),
    //   question: '',
    //   attachments: [],
    //   is_attachment_enable: false,
    //   max_attachment: 2,
    //   penTool: false,
    // },
  ]);
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const addNewQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      {
        id: cuid(),
        component_name: '',
        sub_component_name: [
          {
            column: [
              {
                column_name: '',
                // summary: [],    // only for showing
                test_selection_id: [],  //
                weightAge: 0,
                logic: {},
              },
            ],
          },
        ],
        // question: '',
        // attachments: [],
        // is_attachment_enable: false,
        // max_attachment: 2,
        // penTool: false,
      },
      ...prevState.slice(index),
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Report Card Config'
              //   childComponentNameNext={
              // addFlag && !tableFlag
              //   ? 'Add Category'
              //   : editFlag && !tableFlag
              //   ? 'Edit Category'
              //   : null
              //   }
            />
          </div>
        </div>
        <hr />
        {/* <Grid container spacing={5} style={{ margin: '0px' }}>
          <Grid item xs={12} sm={3} className={'addButtonPadding'}>
            <Autocomplete
              style={{ width: 350 }}
              // value={selectedCentralCategory}
              id='tags-outlined'
              options={'centralCategory'}
              getOptionLabel={(option) => 'option.category_name'}
              filterSelectedOptions
              size='small'
              renderInput={(params) => (
                <TextField {...params} variant='outlined' label='Grade' />
              )}
              onChange={(e, value) => {
                // setSelectedCentralCategory(value);
              }}
              getOptionSelected={(option, value) => value && option.id == value.id}
            />
          </Grid>
        </Grid> */}
        <Grid container spacing={1} style={{ margin: '0px' }}>
          <Grid item xs={12} sm={3} className={'addButtonPadding'}>
            <Button
              startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='medium'
              style={{ color: 'white' }}
              title='Create'
              onClick={() => {
                setQueIndexCounter(queIndexCounter + 1);
                addNewQuestion(queIndexCounter + 1);
              }}
            >
              Create Component
            </Button>
          </Grid>
          {questions?.length !== 0 ? (
            <Grid item xs={12} sm={3} className={'addButtonPadding'}>
              <Button
                startIcon={<RemoveIcon style={{ fontSize: '30px' }} />}
                variant='contained'
                color='primary'
                size='medium'
                style={{ color: 'white' }}
                title='Remove'
                onClick={() => {
                  setQueIndexCounter(queIndexCounter - 1);
                  removeQuestion(queIndexCounter - 1);
                }}
              >
                Remove Component
              </Button>
            </Grid>
          ) : (
            <></>
          )}
          {questions.map((question, index) => (
            <ComponentCard
              key={question.id}
              question={question}
              setQuestions={setQuestions}
              index={index}
              // addNewQuestion={addNewQuestion}
              // handleChange={handleChange}
              // removeQuestion={removeQuestion}
            />
          ))}
        </Grid>
      </Layout>
    </>
  );
}

export default CreateReportConfig;
