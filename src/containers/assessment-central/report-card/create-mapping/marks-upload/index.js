import React, { useContext, useState, useEffect, useRef } from 'react';
import { Grid, TextField, Button, Input } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import { getBranch, getGrade, getSubject, getSection, marksUpload } from '../../apis';
import DNDFileUpload from '../../../../../components/dnd-file-upload';
import { handleDownloadExcel } from '../../../../../utility-functions';

const termsList = [
  { id: '1', semester: 'Semester I' },
  { id: '2', semester: 'Semester II' },
];

const scholasticData = [
  { id: 1, value: 'Scholastic' },
  { id: 2, value: 'Co-Scholastic' },
];

const fileConf = {
  fileTypes:
    'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  types: 'xls, xlsx',
};

const MarksUpload = ({ setLoading, isMobile, widerWidth }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const history = useHistory();
  const { id: academicYearId = 1 } = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [dropdownData, setDropdownData] = useState({
    branch: [],
    grade: [],
    subject: [],
    section: [],
  });

  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    subject: '',
    section: '',
    term: '',
    scholastic: '',
    file: null,
  });

  const getValues = () => {
    const {
      branch = {},
      grade = {},
      subject = {},
      section = {},
      term = {},
      scholastic = {},
      file = '',
    } = filterData || {};
    const { id: acadSessionId, branch: branchDetails = {} } = branch || {};
    const { id: branchId } = branchDetails || {};
    const { grade_id: gradeId } = grade || {};
    const { section_id: sectionId } = section || {};
    const { subject_id: subjectId } = subject || {};
    const { id: termId } = term || {};
    const { id: scholasticId } = scholastic || {};
    return [
      acadSessionId,
      branchId,
      gradeId,
      sectionId,
      subjectId,
      termId,
      scholasticId,
      file,
    ];
  };

  useEffect(() => {
    if (moduleId && academicYearId) {
      fetchBranches();
    }
  }, [moduleId, academicYearId]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Marks Upload') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const generatePayload = () => {
    const [
      acadSessionId,
      branchId,
      gradeId,
      sectionId,
      subjectId,
      termId,
      scholasticId,
      file,
    ] = getValues() || [];

    let payload = {
      acad_session: acadSessionId,
      session_year: academicYearId,
      branch: branchId,
      grade: gradeId,
      term_id: termId,
      section: sectionId,
      subject: subjectId,
      scholastic: scholasticId,
      file,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
    return formData;
  };

  const handleClear = () => {
    setFilterData({
      branch: '',
      grade: '',
      section: '',
      subject: '',
      term: '',
      scholastic: '',
      file: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filterData?.file) {
      setAlert('error', 'File is required');
      return;
    }
    const requestBody = generatePayload();
    const response = await marksUpload(requestBody);
    const { data = {}, headers = {} } = response || {};
    const contentType = headers['content-type'];
    if (contentType !== 'application/vnd.ms-excel') {
      const { status, message, msg } = data || {};
      setAlert('error', msg || message || 'Unable to upload marks');
    } else {
      handleDownloadExcel(data, 'Report-Card');
      history.push('/assessment/report-card-pipeline');
    }
  };

  const fetchBranches = async () => {
    try {
      const branch = await getBranch(moduleId, academicYearId);
      setDropdownData((prev) => ({
        ...prev,
        branch,
        grade: [],
        section: [],
        subject: [],
      }));
    } catch (err) {}
  };

  const fetchGrades = async (branchId) => {
    try {
      const grade = await getGrade(moduleId, academicYearId, branchId);
      setDropdownData((prev) => ({
        ...prev,
        grade,
        section: [],
        subject: [],
      }));
    } catch (err) {}
  };

  const fetchSection = async (branchId, gradeId) => {
    try {
      const section = await getSection(moduleId, academicYearId, branchId, gradeId);
      setDropdownData((prev) => ({ ...prev, section }));
    } catch (err) {}
  };

  const fetchSubject = async (branchId, gradeId) => {
    try {
      const subject = await getSubject(moduleId, academicYearId, branchId, gradeId);
      setDropdownData((prev) => ({ ...prev, subject }));
    } catch (err) {}
  };

  const handleBranch = (event, branch) => {
    let filterObject = { branch: '', grade: '', section: '', subject: '' };
    if (branch) {
      fetchGrades(branch?.branch?.id);
      filterObject = { ...filterObject, branch };
    }
    setFilterData((prev) => ({
      ...prev,
      ...filterObject,
    }));
  };

  const handleGrade = (event, grade) => {
    let filterObject = { grade: '', section: '', subject: '' };
    if (grade) {
      fetchSection(filterData?.branch?.branch?.id, grade?.grade_id);
      fetchSubject(filterData?.branch?.branch?.id, grade?.grade_id);
      filterObject = { ...filterObject, grade };
    }
    setFilterData((prev) => ({
      ...prev,
      ...filterObject,
    }));
  };

  const handleSection = (event, section) => {
    let filterObject = { section: '' };
    if (section) {
      filterObject = { ...filterObject, section };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  const handleSubject = (event, subject) => {
    let filterObject = { subject: '' };
    if (subject) {
      filterObject = { ...filterObject, subject };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  const handleTerm = (event, term) => {
    let filterObject = { term: '' };
    if (term) {
      filterObject = { ...filterObject, term };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  const handleScholastic = (event, scholastic) => {
    let filterObject = { scholastic: '' };
    if (scholastic) {
      filterObject = { ...filterObject, scholastic };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  // const fileRef = useRef(null);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0] || null;
  //   const { name = 'filename' } = file || {};
  //   const extensions = ['xls', 'xlsx'];
  //   const fileExtension = name.trim().split(/\./).slice(-1)[0];
  //   if (!extensions.includes(fileExtension)) {
  //     fileRef.current.value = null;
  //     setAlert(
  //       'error',
  //       'Only excel file is acceptable either with .xls or .xlsx extension'
  //     );
  //   }
  //   setFilterData((prev) => ({ ...prev, file }));
  // };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{
          width: widerWidth,
          margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
        }}
      >
        <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            size='small'
            onChange={handleTerm}
            style={{ width: '100%' }}
            id='term'
            name='term'
            options={termsList || []}
            value={filterData?.term || ''}
            getOptionLabel={(option) => option?.semester || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Term'
                placeholder='Term'
                inputProps={{
                  ...params.inputProps,
                }}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            size='small'
            onChange={handleScholastic}
            style={{ width: '100%' }}
            id='term'
            name='term'
            options={scholasticData || []}
            value={filterData?.scholastic || ''}
            getOptionLabel={(option) => option?.value || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Scholastic / Co-Scholastic'
                placeholder='Scholastic / Co-Scholastic'
                inputProps={{
                  ...params.inputProps,
                }}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            size='small'
            onChange={handleBranch}
            style={{ width: '100%' }}
            id='branch'
            name='branch'
            options={dropdownData?.branch}
            value={filterData?.branch}
            getOptionLabel={(option) => option?.branch?.branch_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
                inputProps={{
                  ...params.inputProps,
                }}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            size='small'
            onChange={handleGrade}
            style={{ width: '100%' }}
            id='grade'
            name='grade'
            options={dropdownData?.grade}
            value={filterData?.grade}
            getOptionLabel={(option) => option?.grade__grade_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
                inputProps={{
                  ...params.inputProps,
                }}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            size='small'
            onChange={handleSection}
            style={{ width: '100%' }}
            id='section'
            name='section'
            options={dropdownData?.section || []}
            value={filterData?.section || ''}
            getOptionLabel={(option) => option?.section__section_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
                inputProps={{
                  ...params.inputProps,
                }}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            size='small'
            onChange={handleSubject}
            style={{ width: '100%' }}
            id='subject'
            name='subject'
            options={dropdownData?.subject || []}
            value={filterData?.subject || ''}
            getOptionLabel={(option) => option?.subject_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
                inputProps={{
                  ...params.inputProps,
                }}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          {/* <Input
            type='file'
            required
            inputRef={fileRef}
            inputProps={{ accept: '.xlsx,.xls' }}
            onChange={handleFileChange}
          /> */}
          <DNDFileUpload
            value={filterData?.file}
            handleChange={(e) => {
              setFilterData((prev) => ({ ...prev, file: e }));
            }}
            fileType={fileConf.fileTypes}
            typeNames={fileConf.types}
          />
        </Grid>
        {!isMobile && <Grid item xs={0} sm={8} />}
        <Grid item xs={12} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            style={{ width: '100%' }}
            className='cancelButton labelColor'
            size='medium'
            onClick={handleClear}
          >
            Clear All
          </Button>
        </Grid>
        <Grid item xs={12} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MarksUpload;
