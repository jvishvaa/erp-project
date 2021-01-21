import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import Modal from '@material-ui/core/Modal'
import { withRouter } from 'react-router-dom'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
// import './studentId.css'
import StudentExtended from '../masters/student/studentExtended'
import EditBranch from '../masterManagement/manageBranches/branches/editBranch'
import AddStaff from '../masters/staff/addStaff'
import IDCANVAS from './IdcanvasDesign'
import { InternalPageStatus } from '../../ui'

const IdCardPreview = props => {
  const [data, setData] = useState()
  const [openStudent, setOpenStudent] = React.useState(false)
  const [openBranch, setOpenBranch] = React.useState(false)
  const [openStaff, setOpenStaff] = React.useState(false)
  const [refresh, reloadCanvas] = useState(1)
  const [dataURIs, setDataURIs] = useState({})
  useEffect(() => {
    if (props.studnetDataForId) {
      setData(props.studnetDataForId)
    }
  }, [props.studnetDataForId])

  function modelStudent (id) {
    setOpenStudent(true)
    props.history.push('/studentIdCard/' + id)
  }

  function modelBranch (id) {
    setOpenBranch(true)
    props.history.push('/studentIdCard/' + id)
  }

  function modelStaff (id) {
    setOpenStaff(true)
    props.history.push('/studentIdCard/' + id)
  }

  function getModelContentStudent () {
    if (setOpenStudent) {
      return (
        <div id='studentIdCard'
          style={{
            width: '90%',
            height: '95%',
            margin: '2% 0% 0% 5%',
            border: '0',
            overflowX: 'hidden',
            overflowY: 'auto'
          }}>
          <StudentExtended alert={props.alert} />
        </div>
      )
    }
  }

  function getModelContentBranch () {
    if (setOpenStudent) {
      return (
        <div id='studentIdCardBranch'
          style={{
            width: '60%',
            height: '85%',
            margin: '5% 10% 0% 20%',
            border: '0',
            backgroundColor: '#ffffff'
          }}>
          <EditBranch alert={props.alert} />
        </div>
      )
    }
  }

  function getModelContentStaff () {
    if (setOpenStaff) {
      return (
        <div id='studentIdCardStaff'
          style={{
            overflowY: 'scroll',
            width: '90%',
            height: '90%',
            margin: '2% 5% 0% 5%',
            border: '0',
            backgroundColor: '#ffffff'
          }}>
          <AddStaff alert={props.alert} />
        </div>
      )
    }
  }

  const handleCloseStudent = () => {
    setOpenStudent(false)
    props.getIdCardData()
  }

  const handleCloseBranch = () => {
    setOpenBranch(false)
    props.getIdCardData()
  }

  const handleCloseStaff = () => {
    setOpenStaff(false)
    props.getIdCardData()
  }
  const formatIDPayload = (studentObj, wholeData, keeper) => {
    let { sign_dataURI: signDataURI } = wholeData
    let { address = '', student } = studentObj
    var payLoad = { signDataURI, address }
    if (student) {
      var keeperKey = (keeper === 'student') ? 'father_name' : `${keeper}_name`
      let captzdKeeper = String(keeper).charAt(0).toUpperCase() + String(keeper).slice(1)
      var parentNameKey = (keeper === 'student') ? 'Father Name' : `${captzdKeeper} Name`
      var parentImgDataURIKey = (keeper === 'student') ? '' : `${keeper}_photo_dataURI`

      var { [keeperKey]: parentNameValue, [parentImgDataURIKey]: parentImgDataURI } = studentObj
      var {
        id: studentId,
        name: studentName,
        contact_no: contactNo,
        student_photo_dataURI: studentImgDataURI,
        roll_no: rollNo,
        date_of_birth: DOB,
        branch: branchObj = {},
        section: sectionObj = {},
        grade: gradeObj = {},
        acad_branch_mapping: acadBranchMappingObj = {},
        erp
      } = student
      // since the data i have destructured is from backend, it may contain null vals, and which results in error while destructuring it.. so making {}empty obj if its null
      branchObj = branchObj || {}
      var { address: branchAddress, logo_URI: logoURI, id: branchId } = branchObj
      sectionObj = sectionObj || {}
      var { section_name: sectionName } = sectionObj

      gradeObj = gradeObj || {}
      var { grade: gradeName } = gradeObj

      acadBranchMappingObj = acadBranchMappingObj || {}
      var { acad_session: acadSessionObj } = acadBranchMappingObj
      acadSessionObj = acadSessionObj || {}
      var { session_year: academicSessionYear } = acadSessionObj
      payLoad = {
        ...payLoad,
        studentId,
        studentName,
        contactNo,
        studentImgDataURI,
        rollNo,
        erp,
        DOB,
        branchAddress,
        logoURI,
        branchId,
        sectionName,
        academicSessionYear,
        gradeName,
        parentNameValue,
        parentNameKey
      }
    } else {
      window.alert('student has no proper data')
      return null
    }
    if (keeper === 'student') {
      payLoad = {
        ...payLoad,
        primaryNameKey: 'Student Name',
        primaryNameValue: studentName,
        secondayNameKey: parentNameKey,
        secondayNameValue: parentNameValue
      }
    } else {
      payLoad = {
        ...payLoad,
        primaryNameKey: parentNameKey,
        primaryNameValue: parentNameValue,
        secondayNameKey: 'Student Name',
        secondayNameValue: studentName,
        parentImgDataURI }
    }
    payLoad = {
      ...payLoad,
      // gradeAndSec: `${payLoad['gradeName']} ${payLoad['sectionName']}`,
      gradeAndSec: `${payLoad['gradeName']}`,
      keeper
    }
    Object.keys(payLoad).forEach(key => {
      if (!key.includes('ataURI')) {
        let value = String(payLoad[key])
        value = value.replace(/,/gi, ', ')
        payLoad[key] = value
      }
    })
    return payLoad
  }

  const handledataURIs = (dataURIObj) => {
    setDataURIs(prevDataURIs => {
      return { ...prevDataURIs, ...dataURIObj }
    })
  }
  const downloadAsZip = (dataURIsObj) => {
    let confirm = window.confirm('Please make sure all images are loaded in id card preview, if not press "REFRESH" button or "REALOAD ALL"')
    if (!confirm) {
      return null
    }
    let idHolders = Object.values(dataURIsObj).map(value => {
      if (typeof (value) === 'object') {
        return value['name']
      } else {
        return value
      }
    })
    var zip = new JSZip()
    zip.file('info.txt', `List: \n${idHolders.join('\n')}`)
    var img = zip.folder(dataURIsObj['folderName'])
    // img.file(`student_id_`, this.imgDataUrl.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true })
    Object.keys(dataURIsObj).forEach(key => {
      if (typeof (dataURIsObj[key]) === 'object') {
        let URI = dataURIsObj[key]['dataURI']
        let idHolder = dataURIsObj[key]['name']
        img.file(`${idHolder}-sid${key}.png`, URI.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true })
      }
    })
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        // see FileSaver.js
        saveAs(content, `eduvate-${new Date().getTime()}.zip`)
      })
  }
  const printAll = () => {
    let confirm = window.confirm('Please make sure all images are loaded in id card preview, if not press "REFRESH" button or "REALOAD ALL"')
    if (!confirm) {
      return null
    }
    window.confirm('For better print quality, download images to your computer then print')
    let dataURIsObj = dataURIs
    let dataURIsArray = []
    Object.keys(dataURIsObj).forEach(key => {
      if (typeof (dataURIsObj[key]) === 'object') {
        let URI = dataURIsObj[key]['dataURI']
        dataURIsArray.push('<img src="' + URI + '" style="width: 100%;" />')
      }
    })
    var width = window.innerWidth * 0.9
    var height = window.innerHeight * 0.9
    var content = '<!DOCTYPE html>' +
                    '<html>' +
                    '<head><title></title></head>' +
                    '<style>@page {' +
                      'size: 54mm 85mm;' +
                      'margin: 0;</style>' +
                      '<body onload="window.focus(); window.print(); window.close();" style="margin: 0; padding: 0;">'
    content += dataURIsArray.join('')
    content += '</body>' + '</html>'
    var options = 'toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,width=' + width + ',height=' + height
    var printWindow = window.open('', 'print', options)
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(content)
      printWindow.document.close()
      printWindow.focus()
    }
  }
  return (
    <div>
      <Modal open={openStudent} onClose={handleCloseStudent}>
        {getModelContentStudent()}
      </Modal>
      <Modal open={openBranch} onClose={handleCloseBranch}>
        {getModelContentBranch()}
      </Modal>
      <Modal open={openStaff} onClose={handleCloseStaff}>
        {getModelContentStaff()}
      </Modal>
      {
        (data && data.students)
          ? (data.students.length) > 0
            ? <React.Fragment>
              <Button
                variant='contained'
                size='small'
                style={{ margin: 10 }}
                onClick={e => modelBranch(data.students[0].student.branch.id)}
              >
            Edit Branch Details
              </Button>
              <Button
                variant='contained'
                onClick={e => modelStaff(data.principleId)}
                size='small'
                style={{ margin: 10 }}
              >
            Edit Principal Details
              </Button>
              <Button
                size='small'
                style={{ margin: 10 }}
                variant='contained'
                onClick={e => { reloadCanvas(Math.random()) }}
              >
            Reload All
              </Button>
              <Button
                color='primary'
                variant='contained'
                style={{ margin: 10 }}
                onClick={
                  e => {
                    downloadAsZip(dataURIs)
                  }
                }
                disabled={!(Object.values(dataURIs).length)}
              >
            Download All
              </Button>
              <Button
                color='primary'
                variant='contained'
                style={{ margin: 10 }}
                onClick={printAll}
                disabled={!(Object.values(dataURIs).length)}
              >
            Print All
              </Button>
              <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100%', marginTop: '30px', justifyContent: 'space-around' }}>

                {data.students.map((student, index) => {
                  return (
                    <div key={index} style={{ margin: '10px', width: '30%' }}>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={e => modelStudent(student.student.id)}
                      >
                    Edit {student.student.name.split(' ')[0] ? student.student.name.split(' ')[0] : 'Student'}'s Details
                      </Button>
                      <div style={{ border: '1px solid grey', margin: 0, padding: 0 }}>
                        <IDCANVAS payLoad={formatIDPayload(student, data, props.keeper)} reload={refresh} sendDataURI={handledataURIs} />
                      </div>
                    </div>
                  )
                })
                }
              </div>
            </React.Fragment>
            : <InternalPageStatus label='No Data found' loader={false} />
          : ''

      }
    </div>
  )
}

export default (withRouter(IdCardPreview))
