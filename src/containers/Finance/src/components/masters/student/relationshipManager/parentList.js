import React, { useState, useEffect } from 'react'
import { Modal, Button, Typography, Tooltip, Input, Grid, InputAdornment, IconButton } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import ReactTable from 'react-table'
import { urls } from '../../../../urls'
import AddParent from './addParent'

const useStyles = makeStyles(theme => ({
  paperContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh'
  },
  paper: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '70vw',
    height: 'calc(69vh - 4px)',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5]
  } }))

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))(Tooltip)
function ParentList (props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [selectedParent, setSelectedParent] = useState(null)
  const [showAddParent, setShowAddParent] = useState(false)
  const [selectedParentDetails, setSelectedParentDetails] = useState()
  const [ totalPages, setTotalPages ] = useState(1)
  const [ saving, setSaving ] = useState(false)
  useEffect(() => {
    setLoading(true)
    axios.get(urls.PARENTSEARCH + '?q=&page_size=5&page_no=1', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      setLoading(false)
      setData(res.data.results)
      setTotalPages(res.data.total_pages)
    }).catch(e => props.alert.error('Something went wrong.'))
  }, [props])
  function fetchData (data) {
    setLoading(true)
    setPageNo(Number(data.page) + 1)
    axios.get(urls.PARENTSEARCH + '?q=&page_size=5&page_no=' + (Number(data.page) + 1), {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      setLoading(false)
      setData(res.data.results)
      setTotalPages(res.data.total_pages)
    }).catch(e => props.alert.error('Something went wrong.'))
    return []
  }
  function onSearch (value) {
    setLoading(true)
    setPageNo(1)
    axios.get(urls.PARENTSEARCH + `?q=${value}&page_size=5&page_no=` + 1, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      setLoading(false)
      setData(res.data.results)
      setTotalPages(res.data.total_pages)
    }).catch(e => props.alert.error('Something went wrong.'))
  }
  function onSave () {
    setSaving(true)
    axios.post((props.sibling ? urls.ASSIGNSIBLINGTOPARENT : urls.ASSIGNSTUDENTTOPARENT) + props.student.id + '/' + selectedParent, null, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      console.log(res.data)
      setSaving(false)
      props.onSave()
      props.toggle()
    })
  }
  function addParent (data) {
    props.onSave()
    props.toggle()
  }
  return <Modal onClose={props.toggle} open={props.open}>
    <div className={classes.paperContainer}>
      <div className={classes.paper}>
        <div style={{ height: '7vh', padding: 8 }}>
          <Grid spacing={4} container>
            <Grid style={{ padding: 16 }} item>Change Parent for {props.sibling ? 'Sibing' : 'Student'}</Grid>
            <Grid item>
              <Input
                onChange={(e) => onSearch(e.target.value)}
                endAdornment={
                  <InputAdornment position='end'>  <IconButton
                    edge='end'
                    onClick={() => { }}
                  >
                    <SearchIcon />
                  </IconButton></InputAdornment>} id='standard-search' type='search' />
            </Grid>
            <Grid item>
              <Button onClick={() => setShowAddParent(true)} >Add Parent</Button>
              <AddParent alert={props.alert} student={props.student} toggle={() => setShowAddParent(!showAddParent)} show={showAddParent} onSave={addParent} onCancel={() => setShowAddParent(false)} />
            </Grid>
          </Grid>
        </div>
        <div style={{ height: '57vh' }}>
          <ReactTable
            manual
            loading={loading}
            data={data}
            showPageSizeOptions={false}
            defaultPageSize={5}
            style={{ width: '70vw', height: '100%' }}
            onFetchData={fetchData}
            pages={totalPages}
            getTrProps={(state, rowInfo, instance) => {
              if (rowInfo) {
                return {
                  style: {
                    background: rowInfo.row.id === selectedParent && 'grey',
                    color: rowInfo.row.id === selectedParent && 'white'
                  }
                }
              }
              return {}
            }}
            columns={[
              {
                Header: 'Sl No.',
                accessor: 'id',
                Cell: (row) => {
                  return <div>{(((pageNo - 1) * 5) + (row.index + 1))}</div>
                },
                maxWidth: 60
              },
              {
                Header: 'Father Name',
                accessor: 'father_name'
              },
              {
                Header: 'Father Mobile',
                accessor: 'father_mobile'
              },
              {
                Header: 'Father Email',
                accessor: 'father_email'
              },
              {
                Header: 'Mother Name',
                accessor: 'mother_name'
              },
              {
                Header: 'Mother Email',
                accessor: 'mother_email'
              },
              {
                Header: 'Mother Mobile',
                accessor: 'mother_mobile'
              },
              {
                Header: 'Address',
                accessor: 'address'
              },
              {
                Header: 'Actions',
                Cell: (row) => {
                  return <Button onClick={() => { setSelectedParent(row.original.id); setSelectedParentDetails(row.original) }} disabled={row.original.id === selectedParent} variant='contained'>SELECT</Button>
                }
              }
            ]}
          />
        </div>
        <div style={{ height: '6vh', padding: 4 }}>
          <Button disabled={saving} onClick={() => !saving && onSave()}> { saving ? 'SAVING...' : 'SAVE'} </Button><Button onClick={() => props.toggle()}>CANCEL</Button>
          {selectedParentDetails && <HtmlTooltip title={<React.Fragment>
            <Typography color='inherit'><b>{selectedParentDetails.father_name}</b></Typography>
            <Typography color='inherit'>{selectedParentDetails.father_mobile}</Typography>
            <Typography variant='subtitle1'>{selectedParentDetails.father_email}</Typography>
          </React.Fragment>} ><Button>Selected : ({selectedParentDetails && selectedParentDetails.father_name})</Button></HtmlTooltip>}
        </div>
      </div>
    </div>
  </Modal>
}

export default ParentList
