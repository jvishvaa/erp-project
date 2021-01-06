import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SvgIcon, Button, Grid, FormControl, TextField, Divider } from '@material-ui/core';
import Layout from '../Layout';
import Filter from '../../assets/images/Filter.svg';
import Activity from '../../assets/images/activity.svg';
import Ask from '../../assets/images/Ask.svg';
import Clearall from '../../assets/images/🔍-Product-Icons.svg'
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Enviroment from './enviromentCard';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Viewmore from './viewMore';
import Pagination from '@material-ui/lab/Pagination';
import './discussionForum.scss';

const Discussionforum = () => {
    const [categoryListRes, setcategoryListRes] = useState([]);
    const [branch, setBranchRes] = useState([]);
    const [gradeRes, setGradeRes] = useState([]);
    const [postListRes, setPostListRes] = useState([]);
    const [categoryValue, setCategoryValue] = useState(null);
    const [branchValue, setBranchValue] = useState(null);
    const [gradeValue, setGradeValue] = useState(null);
    const [isViewmoreView, setisViewmoreView] = useState(false);
    const [viewMoreList, setViewMoreList] = useState(null);
    const [PostListResPagenation ,setPostListResPagenation]= useState(null);
    const [page, setPage] = React.useState(1);
    

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

    const callFilter = () => {
        axiosInstance.get(`${endpoints.discussionForum.filterCategory}?category=${categoryValue.id}&grade=${gradeValue.grade_id}`).then(res => {
            setPostListRes(res.data.data.results.slice(0, 1))
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
       
        getPostList()

    }, [...postListRes]);

    const getPostList = () => {
        axiosInstance.get(`${endpoints.discussionForum.filterCategory}`).then(res => {
            setPostListRes(res.data.data.results);
            setPostListResPagenation(res.data.data)
        }).catch(err => {
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
    console.log(PostListResPagenation, "PostListResPagenation")
    return (
        <Layout>
         <div className={`bread-crumbs-container ds-forum`}>
                <CommonBreadcrumbs
                    componentName='Discussion Forum'
                />
            </div>
          {  !isViewmoreView &&   <div className="df-container" >
                <Grid container spacing={2}>
                    <Grid item xs={10} style={{ display: 'flex', marginTop: 30, marginLeft: 20, borderBottom:'1px solid #E2E2E2', }}>
                        <div className="branch-dropdown">
                            <Grid item xs={4} sm={2} style={{marginBottom: 20}}>
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

                            </Grid>
                        </div>




                  
                    </Grid>
                    <Grid item xs={10} style={{ display: 'flex', borderBottom:'1px solid #E2E2E2', marginLeft: '20px'}} divider className="df">
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
                   
                    <Grid item xs={8} className="activity-ask">
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
                    </Grid>
                </Grid>
            </div>
            }
           {   !isViewmoreView && <div className="env-container" style={{ padding: 40 }}>
                <div className="env-name" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E2E2' }}>
                    <span style={{ color: '#FF6B6B', fontSize: '16px' }}>Enviroment</span>
                    <span style={{ color: '#014B7E', fontSize: '18px' }}>Number of discussion: {PostListResPagenation && PostListResPagenation.limit}</span>
                </div>
                <div className="env-card-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {
                        postListRes && postListRes.slice(0, 4).map((list, index) => {
                            return <Enviroment list={list} handleViewmore={handleViewmore} />
                        })
                    }

                </div>
            </div>}
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