/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Divider,
  Grid,
  TextField,
  Button,
  Paper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Modal,
  Backdrop,
  Switch
} from '@material-ui/core'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from 'axios'
import styles from './subSubCategory.style'
import Loader from '../../loader'
import { discussionUrls } from '../../../../urls'

const SubSubCategory = ({ alert, classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [categoryId, setCategoryId] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [subcategoryId, setSubCategoryId] = useState('')
  const [subCateoryList, setSubCategoryList] = useState([])
  const [subSubcategoryName, setSubSubCategoryName] = useState('')
  const [subSubCategoryList, setSubSubCategoryList] = useState('')
  const [subSubCategoryId, setSubSubCategoryId] = useState('')
  const [loading, setloading] = useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const [userAccess, setUserAccessTrue] = useState('')

  function handleChangePage (event, newPage) {
    setPage(newPage)
    if (!rowsPerPage) {
      setRowsPerPage(10)
    }
  }

  function functionToCheckUserAccess () {
    setloading(true)
    const name = 'Admin'
    const url = `${discussionUrls.checkUserAccessApi}?access_names=${name}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          console.log(res.data)
          setUserAccessTrue(true)
        } else {
          setUserAccessTrue(false)
        }
        setloading(false)
      }).catch(err => {
        setUserAccessTrue(false)
        console.log(err)
        setloading(false)
      })
  }

  function handleChangeRowsPerPage (event) {
    setRowsPerPage(event.target.value)
    setPage(0)
  }
  function firstPageChange () {
    setPage(0)
  }

  function lastPageChange (lastPage) {
    setPage(lastPage)
  };

  function functionToGetCategoryList () {
    setloading(true)
    const url = `${discussionUrls.getCategoryListApi}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setCategoryList(res.data)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionTOGetSubCategoryList () {
    setloading(true)
    const url = `${discussionUrls.getSubCategoryListApi}?category_id=${categoryId}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setSubCategoryList(res.data)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionTOGetSubSubCategoryList () {
    setloading(true)
    const url = `${discussionUrls.addAndGetSubSubCategoryApi}?page_size=${rowsPerPage || 10}&page=${page + 1}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setSubSubCategoryList(res.data)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  useEffect(() => {
    if (auth) {
      if ((auth.personal_info.role === 'Admin')) {
        setUserAccessTrue(true)
      } else {
        functionToCheckUserAccess()
      }
      functionToGetCategoryList()
    }
  }, [auth])

  useEffect(() => {
    if (categoryId) {
      functionTOGetSubCategoryList()
      if (open === false) {
        setSubCategoryId('')
      }
    }
  }, [categoryId])

  useEffect(() => {
    if (auth) {
      functionTOGetSubSubCategoryList()
    }
  }, [auth, page, rowsPerPage])

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function createSubSubCategory () {
    if (!categoryId) {
      alert.warning('Select Category')
      return
    }
    if (!subcategoryId) {
      alert.warning('Select Sub Category')
      return
    } if (subCateoryList.length === 0) {
      alert.warning('Select Sub Category')
      return
    }
    if ((subCateoryList && subCateoryList.length !== 0 && (subCateoryList.filter((item) => item.id === subcategoryId).length === 0))) {
      alert.warning('Select Sub Category')
      return
    }
    if (!subSubcategoryName) {
      alert.warning('Enter Sub Sub Category Name')
      return
    }
    setloading(true)
    const url = discussionUrls.addAndGetSubSubCategoryApi
    axios
      .post(url, {
        title: subSubcategoryName,
        category_fk: categoryId,
        sub_category_fk: subcategoryId
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 201) {
          alert.success('Sub Category Successfully Created')
          handleClose()
          functionTOGetSubSubCategoryList()
          setloading(false)
        } else if (res.status === 302) {
          alert.warning('Sub Category Name Already Exist')
          setloading(false)
        } else if (res.status !== 302 && res.status !== 201) {
          alert.warning('some thing went wrong please try again')
          setloading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('Sub Category Name Already Exist')
        setloading(false)
      })
  }

  function updateSubSubCategoryFunction () {
    if (!categoryId) {
      alert.warning('Select Category')
      return
    } if (!subcategoryId) {
      alert.warning('Select Sub Category')
      return
    } if (subCateoryList.length === 0) {
      alert.warning('Select Sub Category')
      return
    }
    if (!subSubcategoryName) {
      alert.warning('Enter Sub Sub Category Name')
      return
    } if ((subCateoryList && subCateoryList.length !== 0 && (subCateoryList.filter((item) => item.id === subcategoryId).length === 0))) {
      alert.warning('Select Sub Category')
      return
    }
    const url = `${discussionUrls.updateSubSubCategoryApi}/${subSubCategoryId}/update_delete_subsub_category/`
    setloading(true)
    axios
      .put(url, {
        title: subSubcategoryName,
        category_fk: categoryId,
        sub_category_fk: subcategoryId,
        is_delete: !status
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          alert.success('Sub sub Category Successfully Updated')
          handleClose()
          functionTOGetSubSubCategoryList()
        } else if (res.status !== 200) {
          alert.warning('Sub Sub Category Name Already Exist')
          setloading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('Sub Sub Category Name Already Exist')
        setloading(false)
      })
  }

  const handleClose = () => {
    setOpen(false)
    setSubCategoryId('')
    setCategoryId('')
    setSubSubCategoryId('')
    setSubSubCategoryName('')
    setStatus(false)
  }

  function modalOpen () {
    let modal = null
    modal = (
      <>
        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Paper className={classes.paper}>
            <Typography variant='h5'>Edit Sub Category</Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <FormControl margin='dense' required fullWidth>
                  <InputLabel> Select Category </InputLabel>
                  <Select
                    label='select Category'
                    placeholder='Select Category *'
                    fluid
                    search
                    selection
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <MenuItem key={1} value={1} disabled>
                  Select Category
                    </MenuItem>
                    {categoryList && categoryList.length !== 0 && categoryList.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl margin='dense' required fullWidth>
                  <InputLabel> Select Sub Category </InputLabel>
                  <Select
                    id='subCategoryModel'
                    label='select Sub Category'
                    placeholder='Select Sub Category *'
                    value={subcategoryId || ''}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                  >
                    <MenuItem key={1} value={1} disabled>
                  Select Sub Category
                    </MenuItem>
                    {subCateoryList && subCateoryList.length !== 0 && subCateoryList.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  label='Enter Sub Sub Category Name'
                  margin='dense'
                  fullWidth
                  required
                  value={subSubcategoryName || ''}
                  onChange={e => setSubSubCategoryName(e.target.value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography>Set Sub Sub Category as Active/InActive :</Typography>
                    In Active
                <Switch
                  checked={status || false}
                  value={status || false}
                  onChange={(e) => setStatus(e.target.checked)}
                  color='primary'
                />Active
              </Grid>
              <Grid item md={12} xs={12} style={{ marginTop: '8px', textAlign: 'center' }}>
                <Button
                  color='primary'
                  variant='contained'
                  size='large'
                  onClick={() => updateSubSubCategoryFunction()}
                >
                     Update Sub Sub Category
                </Button>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Paper>
        </Modal>
      </>
    )
    return modal
  }

  function functionToOpenEditModel (name, status, cId, subCid, subsubcid) {
    setCategoryId(cId)
    setSubCategoryId(subCid)
    setSubSubCategoryId(subsubcid)
    setSubSubCategoryName(name)
    setOpen(true)
    setStatus(!status)
  }

  return (
    <>
      {userAccess === false && <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}> You are not having Access to Add Category please Contact Admin</Typography>}
      {userAccess === true && <>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <FormControl margin='dense' required fullWidth>
                <InputLabel> Select Category </InputLabel>
                <Select
                  label='select Category'
                  placeholder='Select Category *'
                  fluid
                  search
                  selection
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <MenuItem key={1} value={1} disabled>
                  Select Category
                  </MenuItem>
                  {categoryList && categoryList.length !== 0 && categoryList.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12}>
              <FormControl margin='dense' required fullWidth>
                <InputLabel> Select Sub Category </InputLabel>
                <Select
                  label='select Sub Category'
                  placeholder='Select Sub Category *'
                  value={subcategoryId || ''}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                >
                  <MenuItem key={1} value={1} disabled>
                  Select Sub Category
                  </MenuItem>
                  {subCateoryList && subCateoryList.length !== 0 && subCateoryList.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                label='Enter Sub Category Name'
                margin='dense'
                required
                value={subSubcategoryName || ''}
                onChange={(e) => setSubSubCategoryName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                onClick={() => createSubSubCategory()}
              >Add Sub Sub Category</Button>
            </Grid>
          </Grid>
        </Paper>
        <Divider className={classes.divider} />
        <Paper className={classes.paper}>
          {subSubCategoryList && subSubCategoryList.results && subSubCategoryList.results.length === 0 &&
          <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}>No Sub Sub Category Are Added </Typography>
          }
          {subSubCategoryList && subSubCategoryList.results && subSubCategoryList.results.length !== 0 &&
          <Table>
            <TableHead>
              <TableRow>
                <TableCell float='left'>
                  <Typography>S.No</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>Category</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>Sub Category</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>Sub Sub Category</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>Status</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>Edit</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subSubCategoryList && subSubCategoryList.results && subSubCategoryList.results.length !== 0 && subSubCategoryList.results.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell float='left'>
                    <Typography>{index + 1}</Typography>
                  </TableCell>
                  <TableCell float='left'>
                    <Typography>{item.category_fk && item.category_fk.title}</Typography>
                  </TableCell>
                  <TableCell float='left'>
                    <Typography>{item.sub_category_fk && item.sub_category_fk.title}</Typography>
                  </TableCell>
                  <TableCell float='left'>
                    <Typography>{item.title}</Typography>
                  </TableCell>
                  <TableCell float='left'>
                    <Typography>
                      {item.is_delete
                        ? <CancelIcon style={{ color: 'red' }} /> : <CheckCircleRoundedIcon style={{ color: 'green' }} />
                      }
                    </Typography>
                  </TableCell>
                  <TableCell float='left'>
                    <Button
                      color='primary'
                      variant='contained'
                      style={{ marginTop: '8px' }}
                      onClick={() => functionToOpenEditModel(item.title, item.is_delete, item.sub_category_fk.category_fk, item.sub_category_fk.id, item.id)}
                    >Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          }
          {subSubCategoryList && subSubCategoryList.results && subSubCategoryList.results.length !== 0 &&
          <Table>
            <TableBody>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  labelDisplayedRows={() => `Page ${page + 1} of ${+subSubCategoryList.total_pages}`}
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  count={+subSubCategoryList.count}
                  rowsPerPage={rowsPerPage || 10}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Rows per page' }
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <TableCell style={{ marginTop: '13px' }}>
                  <IconButton
                    onClick={firstPageChange}
                    disabled={page === 0 || page === 1}
                  >
                    <FirstPageIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => lastPageChange(subSubCategoryList.total_pages - 1)}
                    disabled={page === (+subSubCategoryList.total_pages - 1)}
                  >
                    <LastPageIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          }
        </Paper>
      </>}
      {modalOpen()}
      {loader}
    </>
  )
}

export default withStyles(styles)(SubSubCategory)
