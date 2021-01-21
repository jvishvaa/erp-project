import React, { useState, useEffect } from 'react'
import { Modal, Button, Typography, Tooltip, Input, Grid, InputAdornment, IconButton } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import ReactTable from 'react-table'
import { urls } from '../../../../urls'

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
  }
}))

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))(Tooltip)
function StudentList (props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStudentDetails, setSelectedStudentDetails] = useState()
  const [totalPages, setTotalPages] = useState(1)
  const [saving, setSaving] = useState(false)
  let permenantQuery = ''
  Object.keys(props.permanentParams).forEach(item => { permenantQuery += item + '=' + props.permanentParams[item] + '&' })
  useEffect(() => {
    setLoading(true)
    axios.get(urls.STUDENTPARENTSEARCH + '?q=&page_size=5&' + permenantQuery, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      setLoading(false)
      setData(res.data.results)
      setTotalPages(res.data.total_pages)
    }).catch(e => props.alert.error('Something went wrong.'))
  }, [permenantQuery, props])
  function fetchData (data) {
    setLoading(true)
    setPageNo(Number(data.page) + 1)
    axios.get(urls.STUDENTPARENTSEARCH + '?q=&page_size=5&page_no=' + (Number(data.page) + 1) + '&' + permenantQuery, {
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
    axios.get(urls.STUDENTPARENTSEARCH + `?q=${value}&page_size=5&page_no=` + 1 + '&' + permenantQuery, {
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
    console.log('ADDING STUDENT')
    let data = {
      sibling_id: selectedStudentDetails.id
    }
    console.log(data, 'DATA FOR SIBLING')
    axios.post(urls.ADDSIBLINGTOPARENT + props.student.id, data, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      console.log(res.data)
      setSaving(false)
      props.onSave()
      props.toggle()
    }).catch(e => props.alert.error('Something went wrong.'))
  }
  return <Modal onClose={props.toggle} open={props.open}>
    <div className={classes.paperContainer}>
      <div className={classes.paper}>
        <div style={{ height: '7vh', padding: 8 }}>
          <Grid spacing={4} container>
            <Grid style={{ padding: 16 }} item>Students</Grid>
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
                    background: rowInfo.row.id === selectedStudent && 'grey',
                    color: rowInfo.row.id === selectedStudent && 'white'
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
                Header: 'Name',
                accessor: 'name'
              },
              {
                Header: 'ERP',
                accessor: 'erp'
              },
              {
                Header: 'Branch',
                accessor: 'branch'
              },
              {
                Header: 'Grade',
                accessor: 'grade'
              },
              {
                Header: 'Section',
                accessor: 'section'
              },
              {
                Header: 'Father Name',
                accessor: 'parent_fk.father_name'
              },
              {
                Header: 'Father Mobile',
                accessor: 'parent_fk.father_mobile'
              },
              {
                Header: 'Father Email',
                accessor: 'parent_fk.father_email'
              },
              {
                Header: 'Mother Name',
                accessor: 'parent_fk.mother_name'
              },
              {
                Header: 'Mother Email',
                accessor: 'parent_fk.mother_email'
              },
              {
                Header: 'Mother Mobile',
                accessor: 'parent_fk.mother_mobile'
              },
              {
                Header: 'Address',
                accessor: 'parent_fk.address'
              },
              {
                Header: 'Actions',
                Cell: (row) => {
                  return <Button onClick={() => { console.log(row); setSelectedStudent(row.original.id); setSelectedStudentDetails(row.original) }} disabled={row.original.id === selectedStudent} variant='contained'>SELECT</Button>
                }
              }
            ]}
          />
        </div>
        <div style={{ height: '6vh', padding: 4 }}>
          <Button disabled={saving} onClick={() => !saving && onSave()}> {saving ? 'SAVING...' : 'SAVE'} </Button><Button onClick={() => props.toggle()}>CANCEL</Button>
          {selectedStudentDetails && <HtmlTooltip title={<React.Fragment>
            <Typography color='inherit'><b>{selectedStudentDetails.erp}</b></Typography>
            <Typography color='inherit'>{selectedStudentDetails.branch}</Typography>
            <Typography variant='subtitle1'>{selectedStudentDetails.grade}</Typography>
            <Typography variant='subtitle1'>{selectedStudentDetails.section}</Typography>
          </React.Fragment>} ><Button>Selected : ({selectedStudentDetails && selectedStudentDetails.name})</Button></HtmlTooltip>}
        </div>
      </div>
    </div>
  </Modal>
}

export default StudentList
