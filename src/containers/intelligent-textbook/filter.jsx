import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, Divider, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axios from 'axios';
import axiosInstance from '../../config/axios';
import ClearIcon from '../../components/icon/ClearIcon';
import { connect, useSelector } from 'react-redux';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loading from '../../components/loader/loader';
import { getModuleInfo } from '../../utility-functions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { result } from 'lodash';

const Filter = ({ handleFilter, clearFilter, setclearFilter }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const [acadList, setAcadList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedAcad, setSelectedAcad] = useState(
    useSelector((state) => state.commonFilterReducer?.selectedYear)
  );

  // const currentYear = sessionStorage.getItem('acad_session')
  const sessionYear = JSON.parse(sessionStorage.getItem('acad_session'));
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  console.log('debug', selectedSubject);
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [academicYearId, setAcademicYearId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [volumeList, setVolumeList] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState('');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [selectedChapterList, setSelectedChapterList] = useState([]);
  const [keyConceptList, setKeyConceptList] = useState([]);
  const [selectedKeyConcept, setSelectedKeyConcept] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [volumeId, setVolumeId] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState([]);
  const [gradeSubjectId, setGradeSubjectId] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    axiosInstance
      .get(
        `${endpoints.userManagement.academicYear}?module_id=${
          getModuleInfo('Ebook View').id
        }`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setAcademicYear(res?.data?.data);
        }
      })
      .catch((error) => {
        setAlert('error ', error?.message);
      });
    axios
      .get(`${endpoints.lessonPlan.academicYearList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAcademicYearDropdown(result?.data?.result?.results);
          if (selectedAcademicYear) {
            let arr = result?.data?.result?.results.map((item) => {
              if (item.session_year === selectedAcademicYear?.session_year) {
                handleAcademicYear('', item.id);
              }
            });
          }
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);
  // useEffect(() => {
  //   setSelectedVolume('');
  //   setBranchList([]);
  //   setGradeList([]);
  //   setSubjectList([]);
  //   setSelectedBranch('');
  //   setSelectedGrade('');
  //   setSelectedSubject('');
  //   setSelectedBoard([]);
  //   setSelectedBoardId([])
  // }, [clearFilter]);

  function ApiCal() {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setVolumeList(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }

  const handleAcademicYear = (event, value) => {
    if (value) {
      setAcademicYearId(value);
    }
  };

  function withAxiosInstance(url, key) {
    setLoading(true);
    axiosInstance
      .get(url)
      .then((response) => {
        setLoading(false);
        if (response.data.status_code === 200) {
          if (key === 'acad') {
            setAcadList(response.data.data);
          } else if (key === 'branch') {
            setBranchList(response.data.data.results);
          } else if (key === 'grade') {
            setGradeList(response.data.result);
          } else if (key === 'subject') {
            setSubjectList(response.data.result);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  useEffect(() => {
    // withAxiosInstance(
    //   `${endpoints.userManagement.academicYear}?module_id=${
    //     getModuleInfo('Ebook View').id
    //   }`,
    //   'acad'
    // );
    withAxiosInstance(
      `${endpoints.communication.branches}?session_year=${selectedAcad?.id}&module_id=${
        getModuleInfo('Ebook View').id
      }`,
      'branch'
    );
    // ApiCal();
  }, []);

  const handleBoard = (event, value) => {
    setSelectedKeyConcept('');
    setSelectedModule('');
    setSelectedBoard('');
    setSelectedChapterList('');
    setSelectedBoardId([]);
    if (value?.length !== 0) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.id);
      setSelectedBoard(ids);
      setSelectedBoardId(selectedId);
      axios
        .get(
          `${endpoints.ibook.moduleMapped}?volume=${volumeId}&academic_year=${academicYearId}&board=${selectedId}&grade_subject=${selectedSubject?.central_gs_mapping}&page_size=100`,
          {
            headers: {
              'x-api-key': 'vikash@12345#1231',
            },
          }
        )

        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setModuleList(result?.data?.result);
          } else {
            setLoading(false);
            setAlert('error', result?.data?.message);
            setModuleList([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
          setModuleList([]);
        });
    } else {
      setModuleList([]);
      setChapterList([]);
      setKeyConceptList([]);
    }
  };

  const handleModule = (event, value) => {
    setSelectedKeyConcept('');
    setSelectedChapterList('');
    setSelectedModule('');
    if (value) {
      setLoading(true);
      setSelectedModule(value);
      axios
        .get(
          `${endpoints.ibook.chapterMapped}?grade_subject=${selectedSubject?.central_gs_mapping}&volume=${volumeId}&academic_year=${academicYearId}&board=${selectedBoardId}&lt_module=${value.id}`,
          {
            headers: {
              'x-api-key': 'vikash@12345#1231',
            },
          }
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setChapterList(result?.data?.result);
          } else {
            setLoading(false);
            setAlert('error', result.data.message);
            setChapterList([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
          setChapterList([]);
        });
    } else {
      setLoading(false);
      setChapterList([]);
      setKeyConceptList([]);
    }
  };

  const handleKeyConcept = (event, value) => {
    setSelectedKeyConcept('');
    if (value) {
      setSelectedKeyConcept(value);
    }
  };

  const handleChapter = (event, value) => {
    setSelectedKeyConcept('');
    setSelectedChapterList('');
    if (value) {
      setLoading(true);
      setSelectedChapterList(value);
      axios
        .get(`${endpoints.ibook.keyConceptMapped}?chapter=${value?.id}&page_size=100`, {
          headers: {
            'x-api-key': 'vikash@12345#1231',
          },
        })
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setKeyConceptList(result?.data?.result);
          } else {
            setLoading(false);
            setKeyConceptList([]);
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
          setKeyConceptList([]);
        });
    } else {
      setLoading(false);
      setKeyConceptList([]);
    }
  };

  function handleClear() {
    // handleFilter();
    setclearFilter(true);
    setSelectedVolume('');
    setGradeList([]);
    setSubjectList([]);
    setBoardList([]);
    setModuleList([]);
    setChapterList([]);
    setKeyConceptList([]);
    setVolumeList([]);
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSubject('');
    setSelectedBoard([]);
    setSelectedModule('');
    setSelectedChapterList('');
    setSelectedKeyConcept('');
    setSelectedBoardId([]);
  }

  return (
    <>
      <Grid container spacing={2} style={{ padding: '0px 10px' }}>
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              // setBoardId(value?.branch_code)
              if (value) {
                setSelectedBranch(value);
                withAxiosInstance(
                  `${endpoints.ibook.ibookMappedGrade}?session_year=${
                    selectedAcad?.id
                  }&branch_id=${value.branch.id}&module_id=${
                    getModuleInfo('Ebook View').id
                  }`,
                  'grade'
                );
              }

              setSelectedBranch(value);
              setSelectedGrade('');
              setSelectedSubject('');
              setSelectedVolume('');
              setSelectedBoard('');
              setSelectedModule('');
              setSelectedChapterList('');
              setSelectedKeyConcept('');
              setGradeList([]);
              setSubjectList([]);
              setVolumeList([]);
              setBoardList([]);
              setModuleList([]);
              setChapterList([]);
              setKeyConceptList([]);
            }}
            id='branch_id'
            options={branchList}
            value={selectedBranch}
            getOptionLabel={(option) => option?.branch?.branch_name}
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
        <Grid item md={3} xs={12}>
          <Autocomplete
            size='small'
            onChange={(event, value) => {
              if (value) {
                setGradeId(value?.erp_grade);
                setGradeSubjectId(value?.central_gs_mapping);
                withAxiosInstance(
                  `${endpoints.ibook.ibookMappedGrade}?branch_id=${selectedBranch?.branch?.id}&session_year=${selectedAcad?.id}&grade_id=${value.erp_grade}`,
                  'subject'
                );
              }
              setSelectedGrade(value);
              setSelectedSubject('');
              setSelectedVolume('');
              setSelectedBoard('');
              setSelectedModule('');
              setSelectedChapterList('');
              setSelectedKeyConcept('');
              setSubjectList([]);
              setVolumeList([]);
              setBoardList([]);
              setModuleList([]);
              setChapterList([]);
              setKeyConceptList([]);
            }}
            className='dropdownIcon'
            style={{ width: '100%' }}
            id='grade'
            options={gradeList}
            value={selectedGrade}
            getOptionLabel={(option) => option?.erp_grade_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grades'
                placeholder='Grades'
                required
              />
            )}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Autocomplete
            size='small'
            onChange={(event, value) => {
              if (value) {
                setSubjectId(value?.subject_id_name?.[0]?.erp_subject_id);
                setSelectedSubject(value);
                ApiCal();
              }
              setSelectedSubject(value);
              setSelectedVolume('');
              setSelectedBoard('');
              setSelectedModule('');
              setSelectedChapterList('');
              setSelectedKeyConcept('');
              setVolumeList([]);
              setBoardList([]);
              setModuleList([]);
              setChapterList([]);
              setKeyConceptList([]);
            }}
            className='dropdownIcon'
            style={{ width: '100%' }}
            id='subject'
            options={subjectList}
            getOptionLabel={(option) =>
              (option &&
                option.subject_id_name &&
                option.subject_id_name[0] &&
                option.subject_id_name[0].erp_sub_name) ||
              ''
            }
            value={selectedSubject}
            // getOptionLabel={(option) => option?.erp_sub_name||''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
                required
              />
            )}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              setSelectedBoard('');
              setSelectedModule('');
              setSelectedChapterList('');
              setSelectedKeyConcept('');
              setSelectedVolume('');
              setBoardList([]);
              setModuleList([]);
              setChapterList([]);
              setKeyConceptList([]);
              if (value) {
                setLoading(true);
                setVolumeId(value?.id);
                setSelectedVolume(value);
                axiosInstance
                  .get(`academic/get-board-list/`)
                  .then((result) => {
                    if (result?.data.status_code === 200) {
                      setLoading(false);
                      setBoardList(result?.data?.result);
                    } else {
                      setLoading(false);
                      setAlert('error', result?.data?.message);
                      setBoardList([]);
                    }
                  })
                  .catch((error) => {
                    setLoading(false);
                    setAlert('error', error?.message);
                    setBoardList([]);
                  });
              }
            }}
            id='volume_id'
            options={volumeList || []}
            value={selectedVolume || ''}
            getOptionLabel={(option) => option.volume_name || []}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Volume'
                placeholder='Volume'
              />
            )}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Autocomplete
            multiple
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={handleBoard}
            id='board'
            options={boardList || []}
            value={selectedBoard || []}
            getOptionLabel={(option) => option?.board_name || ''}
            getOptionSelected={(option, value) => option?.id == value?.id}
            // filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Board'
                placeholder='Board'
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          // className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
        >
          <Autocomplete
            // multiple
            style={{ width: '100%' }}
            size='small'
            onChange={handleModule}
            id='module'
            className='dropdownIcon'
            value={selectedModule || ''}
            options={moduleList || []}
            getOptionLabel={(option) => option?.lt_module_name || []}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Module'
                placeholder='Module'
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          // className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
        >
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleChapter}
            id='chapter'
            className='dropdownIcon'
            value={selectedChapterList || ''}
            options={chapterList || []}
            getOptionLabel={(option) => option?.chapter_name || []}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Chapter'
                placeholder='Chapter'
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          // className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
        >
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleKeyConcept}
            id='keyConcept'
            className='dropdownIcon'
            value={selectedKeyConcept || ''}
            options={keyConceptList || []}
            // options={keyConceptDropdown}
            getOptionLabel={(option) => option?.topic_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='KeyConcept'
                placeholder='KeyConcept'
              />
            )}
          />
        </Grid>
        {!isMobile && (
          <Grid style={{ marginTop: '20px', marginBottom: '20px' }} xs={12} sm={12}>
            <Divider />
          </Grid>
        )}
        {/* <Grid item md={9}></Grid> */}
        <Grid item md={3} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={6}>
              <Button
                size='medium'
                fullWidth
                onClick={() => handleClear()}
                variant='contained'
              >
                Clear All
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                startIcon={<FilterFilledIcon />}
                style={{ color: 'white' }}
                size='medium'
                variant='contained'
                color='primary'
                fullWidth
                onClick={() =>
                  handleFilter(
                    selectedAcad,
                    selectedBranch?.branch?.id,
                    selectedGrade,
                    selectedSubject,
                    selectedVolume,
                    selectedBoardId,
                    selectedModule,
                    selectedChapterList,
                    selectedKeyConcept
                  )
                }
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </>
  );
};

export default Filter;
