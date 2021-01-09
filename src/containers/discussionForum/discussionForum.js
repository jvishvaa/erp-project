import React, { useEffect, useState, useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SvgIcon, Button, Grid, FormControl, TextField, Divider } from '@material-ui/core';
import Layout from '../Layout';
import Filter from '../../assets/images/Filter.svg';
import Activity from '../../assets/images/activity.svg';
import Ask from '../../assets/images/Ask.svg';
import Clearall from '../../assets/images/🔍-Product-Icons.svg'
import Filtericon from '../../assets/images/Filter Icon.svg'
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Enviroment from './enviromentCard';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Viewmore from './viewMore';
import IconButton from '@material-ui/core/IconButton';

import Pagination from '@material-ui/lab/Pagination';
import './discussionForum.scss';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


const Discussionforum = () => {
    const [categoryListRes, setcategoryListRes] = useState([]);
    const [branch, setBranchRes] = useState([]);
    const [gradeRes, setGradeRes] = useState([]);
    const [postListRes, setPostListRes] = useState([]);
    const [categoryValue, setCategoryValue] = useState('');
    const [branchValue, setBranchValue] = useState(null);
    const [gradeValue, setGradeValue] = useState('');
    const [isViewmoreView, setisViewmoreView] = useState(false);
    const [viewMoreList, setViewMoreList] = useState(null);
    const [PostListResPagenation, setPostListResPagenation] = useState(null);
    const [page, setPage] = React.useState(1);
    const { setAlert } = useContext(AlertNotificationContext);


    useEffect(() => {
        const getCategoryList = () => {
            axiosInstance.get(endpoints.discussionForum.categoryList).then((res) => {
                setcategoryListRes(res.data.result)
            }).catch(err => {
                console.log(err)
            })
        }

        getCategoryList();
        getBranch();
    }, []);

    const getBranch = () => {
        axiosInstance.get(endpoints.discussionForum.branch).then(res => {
            if (res.data.data) {
                setBranchRes(res.data.data)
            }
        }).catch(err => {
            console.log(err)
        })

    }

    const handleChangeBranch = (value) => {
        if (value) {
            setBranchValue(value);
            axiosInstance.get(`${endpoints.discussionForum.grade}?branch_id=${value.id}&module_id=8`).then(res => {
                if (res.data.data) {
                    setGradeRes(res.data.data)
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            setBranchValue(null)
        }

    }

    const handleGradeChange = (value) => {
        setGradeValue(value);
        if (value) {
            setGradeValue(value);
        } else {
            setGradeValue(null);
        }
    }




    const handleCategoryChange = (value) => {
        if (value) {
            setCategoryValue(value);
        } else {
            setCategoryValue(null);
        }
    }

    const validate = (formData) =>{
        let input = formData;
        let errors = {};
        let isValid = true;
        if (!input["categoryValue"]) {
            isValid = false;
            errors["categoryValue"] = "Please enter your event category.";
        }

        if (!input["gradeValue"]) {
            isValid = false;
            errors["gradeValue"] = "Please enter your event grade.";
        }

        let errorPayload = {
            errors,
            isValid
        };
    
        return errorPayload;

        
    }

    const callFilter = () => {
        // axiosInstance.get(`${endpoints.discussionForum.filterCategory}?category=${categoryValue.id}&grade=${gradeValue.grade_id}`).then(res => {
        //     console.log(res, "0009")
        //     if(res.data.status_code === 200){
        //         setPostListRes(res.data.data.results.slice(0, 1))

        //     }else{
        //         setAlert('error', res.data.message)
        //     }
        // }).catch(err => {
        //     console.log(err)
        // })
        const body = {
            categoryValue: categoryValue,
            gradeValue: gradeValue
        }
        filterValid(body)
    }

    const filterValid = (body) => {
        // console.log(body.gradeValue.grade_id, "body")
            if(body && body.gradeValue !==null && body.gradeValue.grade_id !== undefined &&  body && body.gradeValue.grade_id !== null && body && body.categoryValue.id === undefined){
                axiosInstance.get(`${endpoints.discussionForum.filterCategory}?grade=${gradeValue.grade_id}`).then(res => {
                    if(res.data.status_code === 200){
                        setPostListRes(res.data.data.results.slice(0, 1))
        
                    }else{
                        setAlert('error', res.data.message)
                    }
                }).catch(err => {
                    setAlert('error', err.message)
                    console.log(err)
                })

               
            }
            else if(body && body.categoryValue.id !== undefined  && body.gradeValue.grade_id === undefined ){
                axiosInstance.get(`${endpoints.discussionForum.filterCategory}?category=${categoryValue.id}`).then(res => {
                    if(res.data.data.results.length){
                        setPostListRes(res.data.data.results.slice(0, 1))

                    }
                }).catch(err => {
                    setAlert('error', err.message)
                    console.log(err)
                })
            }
            else  if(body.categoryValue.id && body.gradeValue.grade_id ){
                axiosInstance.get(`${endpoints.discussionForum.filterCategory}?category=${categoryValue.id}&grade=${gradeValue.grade_id}`).then(res => {
                    if(res.data.status_code === 200){
                        setPostListRes(res.data.data.results.slice(0, 1))
        
                    }else{
                        setAlert('error', res.data.message)
                    }
                }).catch(err => {
                    setAlert('error', err.message)
                    console.log(err)
                })
            }
    }

    useEffect(() => {

        getPostList()

    }, [...postListRes]);

    const getPostList = () => {
        axiosInstance.get(`${endpoints.discussionForum.filterCategory}`).then(res => {
            //  console.log(res.data, "popop")
            if (res.data.status_code === 200) {
                setPostListRes(res.data.data.results);
                setPostListResPagenation(res.data.data)
            } else {
                setAlert('error', res.data.message)
            }

        }).catch(err => {
            setAlert('error', err.message)
            console.log(err)
        })
    }




    const clearAll = () => {
        setBranchValue(null);
        setCategoryValue(null);
        setGradeValue(null);
        getPostList()
    }
    const handleViewmore = (list) => {
        console.log(list, "list")
        setViewMoreList(list)
        setisViewmoreView(true)
    }
    const handlePageChange = (event, value) => {
        setPage(value);

    }
    // console.log(PostListResPagenation, "PostListResPagenation")
    return (
        <Layout>
            <div className={`bread-crumbs-container ds-forum`}>
                <CommonBreadcrumbs
                    componentName='Discussion Forum'
                />
            </div>
            {  !isViewmoreView && <div className="df-container" >
                <Grid container spacing={2}>
                    <Grid item xs={10} style={{ display: 'flex', marginTop: 30, marginLeft: 20, borderBottom: '1px solid #E2E2E2', }}>
                        <div className="branch-dropdown">
                            <Grid item xs={4} sm={2} style={{ marginBottom: 20 }}>
                                <FormControl className={`select-form`}>
                                    <Autocomplete
                                        // {...defaultProps}
                                        style={{ width: 350 }}
                                        // multiple
                                        value={branchValue}
                                        id="tags-outlined"
                                        options={branch}
                                        getOptionLabel={(option) => option.branch_name}
                                        filterSelectedOptions
                                        size="small"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Branch"

                                            />
                                        )}
                                        onChange={(e, value) => {
                                            handleChangeBranch(value);
                                        }}
                                        getOptionSelected={(option, value) => value && option.id == value.id}
                                    />
                                    {/* <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.branchError}</FormHelperText> */}

                                </FormControl>

                            </Grid>
                        </div>
                        <div className="grade-dropdown">
                            <Grid item xs={4} sm={2}>
                                <FormControl className={`subject-form`}>
                                    <Autocomplete
                                        // {...defaultProps}
                                        style={{ width: 350, marginLeft: 20 }}
                                        // multiple
                                        required={true}
                                        value={gradeValue}
                                        id="tags-outlined"
                                        options={gradeRes}
                                        getOptionLabel={(option) => option.grade__grade_name}
                                        filterSelectedOptions
                                        size="small"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Grade"

                                            />
                                        )}
                                        onChange={(e, value) => {
                                            handleGradeChange(value);
                                        }}
                                        getOptionSelected={(option, value) => value && option.id == value.id}
                                    />
                                    {/* <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.erp_gradeError}</FormHelperText> */}
                                </FormControl>
                            </Grid>
                        </div>

                        <div className="category-dropdown">
                            <Grid item xs={4} sm={2}>
                                <FormControl className={`select-form`}>
                                    <Autocomplete
                                        style={{ width: 350 }}
                                        // multiple
                                        value={categoryValue}
                                        id="tags-outlined"
                                        options={categoryListRes}
                                        getOptionLabel={(option) => option.category_name}
                                        filterSelectedOptions
                                        size="small"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Category"

                                            />
                                        )}
                                        onChange={(e, value) => {
                                            handleCategoryChange(value);
                                        }}
                                        getOptionSelected={(option, value) => value && option.id == value.id}
                                    />
                                    {/* <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.branchError}</FormHelperText> */}

                                </FormControl>
                                {/*  */}
                            </Grid>
                        </div>





                    </Grid>
                    <Grid item xs={10} style={{ display: 'flex', marginLeft: '20px' }} divider className="df">
                        <div className="df-btn-container">
                            <div className="df-clear-all">
                                <Button variant="contained" className="df-clear" onClick={clearAll}>
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '12px', marginRight: '5px' }}
                                                src={Clearall}
                                                alt='given'
                                            />
                                        )}
                                    />
                                    Clear All</Button>
                            </div>
                            <div className="df-filter">
                                <Button variant="contained" color="secondary" onClick={callFilter}>
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '12px', marginRight: '5px' }}
                                                src={Filter}
                                                alt='given'
                                            />
                                        )}
                                    />

                                Filter
                            </Button>
                            </div>
                        </div>

                    </Grid>


                </Grid>
            </div>
            }
            {   !isViewmoreView && <div className="env-container" >
                 <Grid item xs={12} className="catname-df-forum">
                    <div className="env-name" style={{ display: 'flex', borderBottom: '1px solid #E2E2E2' }}>
                        

                        {
                            postListRes && postListRes.map((catName, index) => {
                                return (
                                    <Grid item xs={2} className="catname-df-forum">
                                        <div className="cat-name">
                                            <span style={{ color: '#014B7E', fontSize: '16px' }}>{catName.categories.category_name}</span>

                                        </div>
                                    </Grid>
                                )
                            })
                        }
                        <div style={{display: 'flex'}}>
                        <span style={{ color: '#014B7E', fontSize: '18px', paddingTop: 10, marginLeft: 157, fontWeight: 600 }}>Number of discussion: {PostListResPagenation && PostListResPagenation.limit}</span>
                        <div className="df-btn-question-container" style={{ display: 'flex' }} >
                            <div className="df-ask">
                                <Button variant="contained">
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '9px', marginRight: '5px' }}
                                                src={Ask}
                                                alt='given'
                                            />
                                        )}
                                    />

                                    Ask</Button>
                            </div>
                            <div className="df-activity">
                                <Button variant="contained" color="secondary">
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '12px', marginRight: '5px' }}
                                                src={Activity}
                                                alt='given'
                                            />
                                        )}
                                    />

                                Activity
                            </Button>
                            </div>
                        </div>
                        </div>
                       
                    </div>
                </Grid> 
                
                <div className="env-card-container" style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', width: '95%' }}>
                    {
                        postListRes && postListRes.map((list, index) => {
                            // console.log(list, "list")
                            return <Grid container  >
                                <Grid item xs={6} className="ev-view-card">
                                <Grid item xs={3} className="ev-view-card">
                                    <Enviroment list={list} index={index} handleViewmore={handleViewmore} />
                                </Grid>
                            </Grid>
                        </Grid>

                        })
                    }

                </div>
            </div>
            }
            <div className="view-more-container">
                {
                    isViewmoreView && <Viewmore viewMoreList={viewMoreList} />
                }
            </div>
            {/* <div className="pagination-cont">
                <Pagination 
                onChange={handlePageChange}
                count={PostListResPagenation && PostListResPagenation.total_pages} color="secondary" />
            </div> */}


        </Layout>
    )
}

export default Discussionforum;