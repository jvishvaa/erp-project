
import React, { useState, useEffect } from 'react'

import { Table, CardContent, Grid } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import Dropzone from 'react-dropzone'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import { ListItem, ListItemText } from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { CloudUpload } from '@material-ui/icons'
import { connect } from 'react-redux'
import axios from 'axios'
import { apiActions } from '../_actions'
import { qBUrls, urls, staticUrls } from '../urls'
import './css/staff.css'
import { Toolbar } from '../ui'
import UploadAssessmentModal from './UploadAssessmentModal'
// import { functionalUpdate } from 'react-table'

const UploadAssessmentExcel = props => {
  const [files, setFiles] = useState([])
  const [text, setText] = useState({
    filecount: 0,
    textvalue: 'Select xlsx file only',
    textcolor: 'black'
  })
  const [isupload, setUpload] = useState(false)
  const [isMouseInside, setIsMouseInside] = useState(false)
  const [buttonclass, setbuttonclass] = useState('block_button')
  const [ErrorList, setErrorList] = useState([])
  const [modalopen, setModalOpen] = useState(false)
  const [tabValue, setTab] = useState(0)
  const [year, setYear] = useState('2019-20')

  var SelectedUrl = 'url'
  var TemplateUrl = 'template file'
  var TabMode = 'tab mode'
  var Cell

  const buttons = [
    'Upload', 'Download template'
  ]

  useEffect(() => {
    function handletext () {
      if (files && files.length > 0) {
        setText({ textcolor: 'green', filecount: files.length, textvalue: 'Selected' })
      } else {
        setText({ textcolor: text.textcolor, filecount: 0, textvalue: text.textvalue })
      }
    }
    handletext()
  }, [files, text.filecount, text.textcolor, text.textvalue])

  useEffect(() => {
    function Buttonblock () {
      if (files && files.length > 0) {
        setbuttonclass('')
        setIsMouseInside(false)
      } else {
        setbuttonclass('block_button')
        setIsMouseInside(true)
      }
    }

    Buttonblock()
  }, [files])

  useEffect(() => {
    axios.get(urls.ACADSESSION, {
      headers: {
        Authorization: 'Bearer ' + props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res)
      let{ acad_session: academicyear } = res.data
      setYear(academicyear)
    }).catch(err => {
      console.log(err)
    })
  }, [props.user])

  function handleUploadOrHandleDownload (e, value) {
    if (value === 'Upload') {
      let formData = new FormData()

      files && files.forEach(file => {
        formData.append('excel_file', file)
        if (TabMode === 'Upload Marks') {
          formData.append('year', year)
        }
      })
      setUpload(true)
      axios.post(SelectedUrl, formData, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'multipart/formData'
        }

      }).then(res => {
        props.alert.success('Successfully uploaded')
        setUpload(false)
      }).catch(err => {
        let { response: { data: { status } = {}, data } = [], message } = err

        if (data && data.length > 0) {
          props.alert.error('Error found in excel file')
          if (TabMode === 'Upload Marks') {
            setErrorList(data.flat())
          } else {
            setErrorList(data.flat(3))
          }
          setUpload(false)
          setModalOpen(true)
        } else if (!status && message) {
          if (message === 'Network Error') {
            props.alert.error(' No internet connection')
            setUpload(false)
          } else {
            props.alert.error(message)
            setUpload(false)
          }
        } else if (status) {
          props.alert.error(status)
          setUpload(false)
        } else {
          props.alert.error('something went wrong')
          setUpload(false)
        }
      })
    } else {
      window.location.href = TemplateUrl
    }
  }

  function onDrop (file) {
    const found = files.some(r => file.some(v => v.name === r.name))

    if (!found) {
      if (file && file.length > 0) {
        setFiles([
          ...file, ...files
        ])
      } else {
        setText({ textcolor: 'red', textvalue: 'Please select xlsx file only' })
      }
    } else {
      props.alert.error('file already exists ')
      return false
    }
  }

  function deleteSelectedFile (i, file) {
    files.splice(file, 1)
    setFiles(files)
    setText({ filecount: files.length })

    if (files && files.length === 0) {
      setText({ textcolor: 'black', textvalue: 'Select xlsx file only' })
      setbuttonclass('block_button')
      setIsMouseInside(true)
    }
  }

  function toggleModal () {
    setModalOpen(!modalopen)
  }

  function renderFile () {
    const file = files &&
    files.map((file, i) => (
      <li key={file.name} style={{ listStyleType: 'none', display: 'flex' }}>
        <Button onClick={e => {
          e.stopPropagation()
          deleteSelectedFile(i, file)
        }}><HighlightOffIcon /> </Button><span style={{ paddingTop: '6px' }}>{file.name} - {file.size} bytes</span>
      </li>
    ))
    return file
  }

  function renderCell (cellvalue) {
    return (
      <Table.HeaderCell><span style={{ color: cellvalue }}>{cellvalue}</span></Table.HeaderCell>
    )
  }

  function renderButtons () {
    return (
      <div className='assessment_buttons'>
        {buttons.map(butnval => {
          return (
            <span className={buttonclass}><Button id='Button' className={buttonclass} style={{ margin: '20px' }} name={butnval} onClick={(e) => handleUploadOrHandleDownload(e, butnval)} variant='contained' disabled={(butnval === 'Upload') && (isupload || isMouseInside)} startIcon={butnval === 'Upload' ? <CloudUpload /> : <GetAppIcon />}>{ ((butnval === 'Upload') && isupload ? 'uploading..' : butnval)}</Button></span>
          )
        })}
      </div>
    )
  }

  function insertData (mapdata, urltohit, templateurl, mode) {
    Cell = mapdata
    SelectedUrl = urltohit
    TemplateUrl = templateurl
    TabMode = mode
  }

  function renderTableHeaderCell () {
    const MarksCellContent = [
      'STUDENT ERP',
      'TEST ID',
      'MARKS OBTAINED'

    ]
    const cellContent = [

      'S No.',
      'Test code',
      'Grade',
      'Subject',
      'Test Name',
      'Max Marks',
      'Min Marks',
      'Assessment Category',
      'Assessment Type',
      'Assessment Sub Type',
      'Start Date',
      'End Date',
      'Description',
      'Term',
      'Academic Session year'

    ]

    switch (tabValue) {
      case 0:
        insertData(cellContent, qBUrls.UploadAssessmentExcelFile, staticUrls.AssessmentExcel, 'Upload Asssessment')
        break
      case 1:
        insertData(MarksCellContent, qBUrls.UploadMarksAssessment, staticUrls.AssessmentMarksExcel, 'Upload Marks')
        break
      default:
        insertData(cellContent, qBUrls.UploadAssessmentExcelFile, staticUrls.AssessmentExcel, 'Upload Asssessment')
    }

    const result = Cell.map((e) => {
      return renderCell(e)
    })
    return result
  }

  const handleChangeTab = (e, tab) => {
    if (tab === 0) {
      setTab(tab)
      setFiles([])
      setText({ textcolor: 'black', textvalue: 'Select xlsx file only' })
    } else if (tab === 1) {
      setTab(tab)
      setFiles([])
      setText({ textcolor: 'black', textvalue: 'Select xlsx file only' })
    }
  }
  function renderTabs () {
    return (
      <div>

        <Tabs value={tabValue} indicatorColor='primary' textColor='primary' onChange={handleChangeTab} style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Tab label='UPLOAD ASSESSMENT' />
          <Tab label='UPLOAD MARKS' />
        </Tabs>

      </div>
    )
  }

  function renderFileField () {
    return (

      <div style={{ paddingTop: '0px' }}>
        <List><ListItem><ListItemText><span style={{ color: text.textcolor, marginLeft: '20px' }}>{text.textvalue}  {(files && files.length > 0) ? text.filecount : ''}</span></ListItemText></ListItem></List>
        <Dropzone
          onDrop={(e) => { onDrop(e) }}
          accept='.xlsx'
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject
          }) => (
            <Card
              elevation={0}
              style={{
                padding: '30px',
                marginLeft: '25px',
                border: '1px solid black',
                borderStyle: 'dashed',
                width: '30vw',
                textAlign: 'center'
              }}
              {...getRootProps()}
              className='dropzone'
            >
              <CardContent>

                <input {...getInputProps()} />
                <div>
                  {isDragAccept && 'All' + ' ' + 'file' + ' ' + 'will be accepted'}
                  {isDragReject && 'Some' + ' ' + 'file' + ' ' + 'will be rejected'}
                  {!isDragActive && 'Drop your' + ' ' + 'file' + ' ' + 'here.'}
                </div>
                {renderFile()}
              </CardContent>
            </Card>
          )}
        </Dropzone>
      </div>)
  }

  return (
    <div >
      <UploadAssessmentModal resultData={ErrorList} openmodal={modalopen} toggle={(e) => toggleModal()} />
      <Toolbar>
        {renderTabs()}
      </Toolbar>

      <div className='upload_excel_assessment'>

        <Grid container>
          <Grid item>
            <Table collapsing celled>
              <Table.Header>
                <Table.Row>
                  {renderTableHeaderCell()}
                </Table.Row>
              </Table.Header>
            </Table>
          </Grid>
        </Grid>
      </div>
      <Grid container>
        {renderFileField()}
      </Grid>
      {renderButtons()}

    </div>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  roles: state.roles.items
})

const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadAssessmentExcel)
