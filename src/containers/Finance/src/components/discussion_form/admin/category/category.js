/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Divider,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TablePagination,
  IconButton,
  Modal,
  Backdrop,
  Switch
} from '@material-ui/core'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from 'axios'
import styles from './category.style'
import Loader from '../../loader'
import { discussionUrls } from '../../../../urls'

const AddCategory = ({ alert, classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [categoryName, setCategoryName] = useState('')
  const [categoryList, setCategoryList] = useState('')
  const [loading, setloading] = useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const [categoryId, setCategoryId] = useState('')
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

  function functionToGetCategoryList () {
    setloading(true)
    const url = `${discussionUrls.addAndGetCategoryUrl}?page_size=${rowsPerPage || 10}&page=${page + 1}`
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
    setCategoryName('')
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
  }, [auth, page, rowsPerPage])

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function createCategory () {
    if (!categoryName) {
      alert.warning('Enter Category Name')
      return
    }
    setloading(true)
    const url = discussionUrls.addAndGetCategoryUrl
    axios
      .post(url, {
        title: categoryName
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 201) {
          alert.success('Category Successfully Created')
          functionToGetCategoryList()
          setloading(false)
        } else if (res.status === 302) {
          alert.warning('Category Name Already Exist')
          setloading(false)
        } else if (res.status !== 302 && res.status !== 201) {
          alert.warning('Please Try Again')
          setloading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('Category Name Already Exist')
        setloading(false)
      })
  }

  function updateCategoryFunction () {
    if (!categoryName) {
      alert.warning('Enter Category Name')
      return
    }
    const url = `${discussionUrls.updateCategoryApi}/${categoryId}/update_delete_category/`
    setloading(true)
    axios
      .put(url, {
        title: categoryName,
        is_delete: !status
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          alert.success('Category Successfully Updated')
          setOpen(false)
          setCategoryName('')
          setCategoryId('')
          setStatus(false)
          setloading(false)
          functionToGetCategoryList()
        } else if (res.status !== 200) {
          alert.warning('Category Name Already Exist')
          setloading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('Category Name Already Exist')
        setloading(false)
      })
  }

  const handleClose = () => {
    setOpen(false)
    setCategoryName('')
    setCategoryId('')
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
            <Typography variant='h5'>Edit Category</Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <TextField
                  label='Enter Category Name'
                  margin='dense'
                  fullWidth
                  required
                  value={categoryName || ''}
                  onChange={e => setCategoryName(e.target.value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography>Set Category as Active/InActive :</Typography>
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
                   Update Category
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

  function functionToOpenEditModel (name, id, status) {
    setCategoryName(name)
    setOpen(true)
    setCategoryId(id)
    setStatus(!status)
  }

  return (
    <>
      {userAccess === false &&
      <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}> You are not having Access to Add Category please Contact Admin</Typography>
      }
      {userAccess === true && <>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <TextField
                label='Enter Category Name'
                margin='dense'
                required
                value={categoryName || ''}
                onChange={(e) => setCategoryName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                onClick={() => createCategory()}
              >Add Category</Button>
            </Grid>
          </Grid>
        </Paper>
        <Divider className={classes.divider} />
        <Paper className={classes.paper}>
          {categoryList && categoryList.results && categoryList.results.length === 0 &&
          <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}>No Category Are Added </Typography>
          }
          {categoryList && categoryList.results && categoryList.results.length !== 0 &&
          <Table>
            <TableHead>
              <TableRow>
                <TableCell float='left'>
                  <Typography>S.No</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>Category Name</Typography>
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
              {categoryList && categoryList.results && categoryList.results.length !== 0 && categoryList.results.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell float='left'>
                    <Typography>{index + 1}</Typography>
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
                      onClick={() => functionToOpenEditModel(item.title, item.id, item.is_delete)}
                    >Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          }
          {categoryList && categoryList.results && categoryList.results.length !== 0 &&
          <Table>
            <TableBody>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  labelDisplayedRows={() => `Page ${page + 1} of ${+categoryList.total_pages}`}
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  count={+categoryList.count}
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
                    onClick={() => lastPageChange(categoryList.total_pages - 1)}
                    disabled={page === (+categoryList.total_pages - 1)}
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

export default withStyles(styles)(AddCategory)
