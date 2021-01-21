/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react'

import { CardContent, Grid } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import Dropzone from 'react-dropzone'
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel'
import List from '@material-ui/core/List'
import { ListItem, ListItemText, Modal, CardHeader } from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp'
import Chip from '@material-ui/core/Chip'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { CloudUpload } from '@material-ui/icons'
import { connect } from 'react-redux'
import axios from 'axios'
import { apiActions } from '../../_actions'
import { urls, staticUrls } from '../../urls'
// import './css/staff.css'
// import { functionalUpdate } from 'react-table'

const BadgesList = props => {
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
  const [showErrorList, setShowErrorList] = useState(false)
  // const [year, setYear] = useState('2019-20')
  const winnerList = props.winnersDetails
  const recipient_role = props.role
  const category = props.category
  const eventDate = props.eventDate
  const eventName = props.eventName
  const issuerBranchId = props.issuerBranch
  var SelectedUrl = urls.ParticipantExcelUpload
  var TemplateUrl = staticUrls.ParticipantBadges
  const role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  const buttons = [
    'Upload', 'Download template'
  ]
  console.log(winnerList, 'errrrr')

  useEffect(() => {
    if (props.file) {
      setFiles(props.file)
    }
    function handletext () {
      if (files && files.length > 0) {
        setText({ textcolor: 'green', filecount: files.length, textvalue: 'Selected' })
      } else {
        setText({ textcolor: text.textcolor, filecount: 0, textvalue: text.textvalue })
      }
    }
    handletext()
  }, [files, props.file, text.filecount, text.textcolor, text.textvalue])

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
    if (props.ErrorList) {
      setErrorList(props.ErrorList)
    }
  }, [props.ErrorList])

  function handleUploadOrHandleDownload (e, value) {
    console.log(category)
    if (value === 'Upload') {
      let formData = new FormData()
      files && files.forEach(file => {
        formData.set('excel_file', file)
        formData.set('badges_belongs_to', recipient_role)
        formData.set('category_id', category)
        if (winnerList && winnerList.length) {
          formData.set('winner_list', JSON.stringify(winnerList.filter(e => e.erp).map(v => { return ({ erp: v.erp }) })))
        }
        formData.set('conducted_date', eventDate)
        formData.set('event_name', eventName)
        if (role !== 'Admin' || issuerBranchId === 2) {
          formData.set('issuer_branch_id', issuerBranchId)
        }
      })

      if ((eventDate && eventName && category) !== undefined) {
        setUpload(true)
        axios.post(SelectedUrl, formData, {
          headers: {
            Authorization: 'Bearer ' + props.user,
            'Content-Type': 'multipart/formData'
          }
        }).then(res => {
          props.alert.success('Successfully uploaded')
          props.handleBadgeFile(files)
          props.handleExcelErrorList([])
          setUpload(false)
        }).catch(err => {
          let { response: { data: { status: { Message } = {} } = {}, data } = [], message } = err
          // // eslint-disable-next-line no-debugger
          // debugger

          if (data && data.length > 0) {
            props.alert.error('Error found in excel file')
            if (Array.isArray(data)) {
              setErrorList(data.flat())
              setShowErrorList(true)
              props.handleExcelErrorList(data.flat())
              setUpload(false)
            } else {
              props.alert.error('Not a valid Excel format')
              setUpload(false)
            }

            //   setModalOpen(true)
          } else if (!Message && message) {
            if (message === 'Network Error') {
              props.alert.error(' No internet connection')
              setUpload(false)
            } else {
              props.alert.error(message)
              setUpload(false)
            }
          } else if (Message) {
            props.alert.error(Message)
            setUpload(false)
          } else {
            props.alert.error('something went wrong')
            setUpload(false)
          }
        })
      } else {
        props.alert.error('please fill all the fields')
      }
    } else {
      window.location.href = TemplateUrl
    }
  }
  useEffect(() => {
    if (props.files && props.files.length) {
      setFiles(props.files)
    }
  }, [props.files])

  function onDrop (file) {
    const found = files.some(r => file.some(v => v.name === r.name))

    if (!found) {
      if (file && file.length > 0) {
        setFiles([
          ...file, ...files
        ])
        // props.handleBadgeFile(false)
      } else {
        setText({ textcolor: 'red', textvalue: 'Please select xlsx file only' })
      }
    } else {
      props.alert.error('file already exists ')
      return false
    }
    // props.handleExcelFile(file)
  }

  function deleteSelectedFile (i, file) {
    files.splice(file, 1)
    setFiles(files)
    setText({ filecount: files.length })

    if (files && files.length === 0) {
      setText({ textcolor: 'black', textvalue: 'Select xlsx file only' })
      setbuttonclass('block_button')
      setIsMouseInside(true)
      props.handleBadgeFile(null)
    }
  }

  function renderFile () {
    // // eslint-disable-next-line no-debugger
    // debugger
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

  function renderFileField () {
    return (
      <div style={{ paddingTop: '0px' }}>
        <List><ListItem><ListItemText><span style={{ color: text.textcolor, marginLeft: '20px' }}>{text.textvalue}  {(files && files.length > 0) ? text.filecount : ''}</span></ListItemText></ListItem></List>
        <Dropzone
          onDrop={(e) => { onDrop(e) }}
          accept='.xlsx'
          multiple={false}
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

                <input {...getInputProps()} multiple={false} />
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
      {/* {console.log(ErrorList)} */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={4}>
          {renderFileField()}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          {renderButtons()}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          {
            showErrorList

              ? <Modal
                open={showErrorList}
                onClose={() => { setShowErrorList(false) }} >
                <Card style={{
                  position: 'fixed',
                  top: '5%',
                  left: '10%',
                  width: '80vw',
                  height: '80vh',
                  overflow: 'auto'

                }}>
                  <div style={{ background: 'black', color: 'white', height: '60px', position: 'sticky', zIndex: 99, top: 0, overflow: 'visible' }}>
                    <CancelIcon className='clear__files' style={{ float: 'right', marginBottom: 20, background: 'black' }} onClick={() => { setShowErrorList(false) }} />
                    <CardHeader title='List of Errors' style={{ textAlign: 'center' }} /></div><br /><br />
                  {ErrorList && ErrorList.map(err => {
                    return (
                      <CardContent style={{ textAlign: 'center', padding: '10px' }}>
                        <Chip label={err.row ? 'In ' + err.row + ' row ' + err.message : err.message} style={{ color: 'red', fontSize: 'medium' }} /><br /><br />
                      </CardContent>)
                  }
                  )}
                </Card>
              </Modal>

              : ''
          }
        </Grid>
      </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(BadgesList)
