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
import styles from './subCategory.style'
import Loader from '../../loader'
import { discussionUrls } from '../../../../urls'

const SubCategory = ({ alert, classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [categoryId, setCategoryId] = useState('')
  const [categoryList, setCategoryList] = useState('')
  const [subcategoryName, setSubCategoryName] = useState('')
  const [loading, setloading] = useState(false)
  const [subCateoryList, setSubCategoryList] = useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const [subcategoryId, setSubCategoryId] = useState('')
  const [userAccess, setUserAccessTrue] = useState('')

  function handleChangePage (event, newPage) {
    setPage(newPage)
    if (!rowsPerPage) {
      setRowsPerPage(10)
    }
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
    const url = `${discussionUrls.addAndGetSubCategoryApi}?page_size=${rowsPerPage || 10}&page=${page + 1}`
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

  useEffect(() => {
    if (auth) {
      if ((auth.personal_info.role === 'Admin')) {
        setUserAccessTrue(true)
      } else {
        functionToCheckUserAccess()
      }
      functionToGetCategoryList()
      functionTOGetSubCategoryList()
    }
  }, [auth])

  useEffect(() => {
    if (auth) {
      functionTOGetSubCategoryList()
    }
  }, [page, rowsPerPage])

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function createSubCategory () {
    if (!categoryId) {
      alert.warning('Select Category')
      return
    }
    if (!subcategoryName) {
      alert.warning('Enter Sub Category Name')
      return
    }
    setloading(true)
    const url = discussionUrls.addAndGetSubCategoryApi
    axios
      .post(url, {
        title: subcategoryName,
        category_fk: categoryId
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 201) {
          alert.success('Sub Category Successfully Created')
          functionTOGetSubCategoryList()
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

  function updateCategoryFunction () {
    if (!categoryId) {
      alert.warning('Select Category')
      return
    }
    if (!subcategoryName) {
      alert.warning('Enter Sub Category Name')
      return
    }
    const url = `${discussionUrls.updateSubCategoryApi}/${subcategoryId}/update_delete_subcategory/`
    setloading(true)
    axios
      .put(url, {
        title: subcategoryName,
        category_fk: categoryId,
        is_delete: !status
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          alert.success('Sub Category Successfully Updated')
          setOpen(false)
          setSubCategoryId('')
          setCategoryId('')
          setSubCategoryName('')
          setStatus(false)
          setloading(false)
          functionTOGetSubCategoryList()
        } else if (res.status !== 200) {
          alert.warning('Sub Category Name Already Exist')
          setloading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('Sub Category Name Already Exist')
        setloading(false)
      })
  }

  const handleClose = () => {
    setOpen(false)
    setSubCategoryId('')
    setCategoryId('')
    setSubCategoryName('')
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
                <TextField
                  label='Enter Sub Category Name'
                  margin='dense'
                  fullWidth
                  required
                  value={subcategoryName || ''}
                  onChange={e => setSubCategoryName(e.target.value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography>Set Sub Category as Active/InActive :</Typography>
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
                  onClick={() => updateCategoryFunction()}
                >
                     Update Sub Category
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

  function functionToOpenEditModel (name, id, status, categoryId) {
    setCategoryId(categoryId)
    setSubCategoryName(name)
    setOpen(true)
    setSubCategoryId(id)
    setStatus(!status)
  }

  return (
    <>
      {userAccess === false && <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}> You are not having Access to Add Category please Contact Admin</Typography>}
      {userAccess === true &&
      <>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
              <TextField
                label='Enter Sub Category Name'
                margin='dense'
                required
                value={subcategoryName || ''}
                onChange={(e) => setSubCategoryName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                onClick={() => createSubCategory()}
              >Add Sub Category</Button>
            </Grid>
          </Grid>
        </Paper>
        <Divider className={classes.divider} />
        <Paper className={classes.paper}>
          {subCateoryList && subCateoryList.results && subCateoryList.results.length === 0 &&
          <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}>No Sub Category Are Added </Typography>
          }
          {subCateoryList && subCateoryList.results && subCateoryList.results.length !== 0 &&
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
                  <Typography>Sub Category Name</Typography>
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
              {subCateoryList && subCateoryList.results && subCateoryList.results.length !== 0 && subCateoryList.results.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell float='left'>
                    <Typography>{index + 1}</Typography>
                  </TableCell>
                  <TableCell float='left'>
                    <Typography>{item.category_fk && item.category_fk.title}</Typography>
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
                      variant='contained'
                      color='primary'
                      style={{ marginTop: '8px' }}
                      onClick={() => functionToOpenEditModel(item.title, item.id, item.is_delete, item.category_fk.id)}
                    >Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          }
          {subCateoryList && subCateoryList.results && subCateoryList.results.length !== 0 &&
          <Table>
            <TableBody>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  labelDisplayedRows={() => `Page ${page + 1} of ${+subCateoryList.total_pages}`}
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  count={+subCateoryList.count}
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
                    onClick={() => lastPageChange(subCateoryList.total_pages - 1)}
                    disabled={page === (+subCateoryList.total_pages - 1)}
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

export default withStyles(styles)(SubCategory)
