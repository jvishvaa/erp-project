import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  IconButton,
  TextareaAutosize,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import Loading from '../../../components/loader/loader';
import axios from 'axios';

const CreateGeneralDairy = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  return (
    <>
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='General Dairy'
              childComponentName='Create New'
            />
          </div>
        </div>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              //   onChange={handleBranch}
              id='academic-year'
              className='dropdownIcon'
              //   value={filterData?.branch}
              //   options={branchDropdown}
              //   getOptionLabel={(option) => option?.branch_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              //   onChange={handleGrade}
              id='volume'
              className='dropdownIcon'
              //   value={filterData?.grade}
              //   options={gradeDropdown}
              //   getOptionLabel={(option) => option?.grade__grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
            //   multiple
              style={{ width: '100%' }}
              size='small'
              //   onChange={handleSection}
              id='subj'
              className='dropdownIcon'
              // value={filterData?.subject}
              //   options={sectionDropdown}
              //   getOptionLabel={(option) => option?.section__section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Section'
                  placeholder='Section'
                />
              )}
            />
          </Grid>
        </Grid>

        {/* <<<<<<<<<< EDITOR PART  >>>>>>>>>> */}
        <div>
        <div className='descriptionBorder'>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12}>
                <TextField
                    id="outlined-multiline-static"
                    label="Title"
                    multiline
                    rows="1"
                    color='secondary'
                    style={{ width: "100%",marginTop:'1.25rem'}}
                    // defaultValue="Default Value"
                    // value={title}
                    variant="outlined"
                    // onChange={e=> setTitle(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows="6"
                    color='secondary'
                    style={{ width: "100%" }}
                    // defaultValue="Default Value"
                    // value={description}
                    variant="outlined"
                    // onChange={e=> setDescription(e.target.value)}
                />
            </Grid>
        </Grid>
        <div className="attachmentContainer">
            <div style={{display:'flex'}} className='scrollable'>
            
                    {/* filePath?.map((file, i) => ( */}
                            {/* <FileRow
                            key={`homework_student_question_attachment_${i}`}
                            file={file}
                            index={i}
                           onClose={() => removeFileHandler(i)}
                            /> */}
                        {/* ))  */}
            </div>
        
                <div className="attachmentButtonContainer">
                    <Button
                        startIcon={<SvgIcon
                            component={() => (
                                <img
                                    style={{ height: '20px', width: '20px' }}
                                    src={attachmenticon}
                                />
                            )}
                        />}
                        className="attchment_button"
                        title="Attach Supporting File"
                        variant='contained'
                        size="medium"
                        disableRipple
                        disableElevation
                        disableFocusRipple
                        disableTouchRipple
                        component="label"
                        style={{ textTransform: 'none' }}
                    >
                        <input
                            type='file'
                            style={{ display: 'none' }}
                            id='raised-button-file'
                            accept="image/*"
                            // onChange={handleImageChange}
                        />
                    Add Document
                </Button>
                </div>
                </div>

        </div>
        <div >
            <Button
            //  onClick={state.isEdit? handleEdited : handleSubmit}
              className='submit_button'>SUBMIT</Button>
        </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateGeneralDairy;
