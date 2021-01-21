import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Grid, Button, Modal, FormControlLabel, Checkbox } from '@material-ui/core/'
import { connect } from 'react-redux'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { OmsSelect, InternalPageStatus } from '../../ui'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
// import Template from './staffIdCardTemplate'
// import PdfGenerator from '../../utils/pdfGenerator'
import EditBranch from '../masterManagement/manageBranches/branches/editBranch'
import AddStaff from '../masters/staff/addStaff'
import './studentId.css'
import STAFFIDCANVAS from './IdCanvasDesignStaff'

class StaffIdCard extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      openModelBranch: false,
      openModelStaff: false,
      dataURIs: {}
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.getStaffData = this.getStaffData.bind(this)
    this.getModelContentStaff = this.getModelContentStaff.bind(this)
    this.getModelContentBranch = this.getModelContentBranch.bind(this)
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    if (this.role === 'Principal') {
      this.setState({
        aBranchId: academicProfile.branch_id,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
    }
  }

  handleClickBranch = event => {
    this.setState({
      branchId: event.value,
      branchValue: event,
      staffValue: [],
      staffData: [],
      check: false
    }, () => this.getStaffData())
  }

  handleClickDepartment = event => {
    this.setState({
      departmentValue: event,
      staffValue: [],
      staffData: [],
      valueDepartment: event.value,
      disable: false,
      check: false
    }, () => this.getStaffData())
  }

  getStaffData () {
    var user = JSON.parse(localStorage.getItem('user_profile'))

    let { valueDepartment, branchId } = this.state
    let url
    if (this.role === 'Principal') {
      var princiBranchId = user.academic_profile.branch_id

      url = urls.StaffIdcard + '?branch_id=' + princiBranchId + '&department_id=' + valueDepartment
    } else if (branchId && valueDepartment) {
      url = urls.StaffIdcard + '?branch_id=' + branchId + '&department_id=' + valueDepartment
    }
    if (url !== undefined) {
      axios
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            let { staff = [] } = res.data
            if (staff.length === 0) { this.props.alert.warning('No staff data found') }
            this.setState({ staffData: staff })
          } else if (res.status === 204) {
            this.props.alert.error('No staff found')
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status !== 500) {
            this.props.alert.error(String(error.response))
          } else {
            this.props.alert.error('Unable to get staff data')
          }
        })
    } else {
      console.log(' url not defined')
    }
  }

  handleChangeStaff = event => {
    let staffIds = []
    event.forEach(function (staff) {
      staffIds.push(staff.value)
    })
    // if (staffIds.length !== this.state.staffData.length) {
    //   this.setState({ check: false })
    // }
    let isAllChecked = staffIds.length === this.state.staffData.length
    this.setState({
      staffId: staffIds,
      staffValue: event,
      check: isAllChecked
    })
  }

  handleClick =() => {
    const { branchValue, staffId, branchId, valueDepartment } = this.state

    var user = JSON.parse(localStorage.getItem('user_profile'))

    let url
    if (this.role === 'Principal') {
      var princiBranchId = user.academic_profile.branch_id

      url = urls.StaffIdcard + '?branch_id=' + princiBranchId
    } else {
      url = urls.StaffIdcard + '?branch_id=' + branchId
    }

    if (staffId === 'ALL') {
      url = url + '&department_id=' + valueDepartment
    } else {
      if (!branchValue || !staffId || (staffId && staffId.length === 0)) {
        this.props.alert.error('Please enter required fields')
        return
      } else {
        url = url + '&staff_id=' + JSON.stringify(staffId)
      }
    }
    url += `&dataURI=${true}`
    this.setState({ loading: true })
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then(res => {
        this.setState({ staffDetails: res.data, loading: false })
      }).catch(e => {
        this.setState({ loading: false, staffDetails: null })
      })
  }

  selectall = (event, checked) => {
    let { staffData } = this.state
    if (checked) {
      // let aStaff = []
      let allStaff = staffData.map(staff => ({ label: staff.name, value: staff.id }))
      this.setState({ staffId: 'ALL', check: true, staffValue: allStaff })

      // staffData.filter(staff => {
      //   aStaff.push({
      //     label: staff.name,
      //     value: staff.id
      //   })
      // })
      // this.setState({ staffValue: aStaff })
    } else {
      this.setState({ staffId: null, staffValue: [], check: false })
    }
  }

  // handlePrint () {
  //   const { staffDetails } = this.state
  //   const title = ''
  //   const footer = (
  //     <React.Fragment>
  //     </React.Fragment>
  //   )
  //   const header = (
  //     <React.Fragment>
  //     </React.Fragment>
  //   )
  //   const component = (
  //     staffDetails && staffDetails.staff.map(staff => {
  //       return (
  //         <div style={{ pageBreakAfter: 'always' }}>
  //           <Template staff={staff} data={staffDetails} />
  //         </div>
  //       )
  //     })
  //   )
  //   PdfGenerator({ title, header, component, footer })
  // }

  getModelContentBranch () {
    let { openModelBranch } = this.state
    if (openModelBranch) {
      return (
        <div id='studentIdCardBranch'
          style={{
            width: '60%',
            height: '85%',
            margin: '5% 10% 0% 20%',
            border: '0',
            backgroundColor: '#ffffff'
          }}>
          <EditBranch alert={this.props.alert} />
        </div>
      )
    }
  }

  getModelContentStaff () {
    let { openModelStaff } = this.state
    if (openModelStaff) {
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
          <AddStaff alert={this.props.alert} />
        </div>
      )
    }
  }

  modelBranch (id) {
    this.setState({ openModelBranch: true })
    this.props.history.push('/staffIdCard/' + id)
  }

  modelStaff (id) {
    this.setState({ openModelStaff: true })
    this.props.history.push('/staffIdCard/' + id)
  }

  handleCloseBranch = () => {
    this.setState({ openModelBranch: false })
    this.getStaffData()
  }

  handleCloseStaff = () => {
    this.setState({ openModelStaff: false })
    this.getStaffData()
  }
  printAll = () => {
    let confirm = window.confirm('Please make sure all images are loaded in id card preview, if not press "REFRESH" button or "REALOAD ALL"')
    if (!confirm) {
      return null
    }
    window.confirm('For better print quality, download images to your computer then print')
    let { dataURIs: dataURIsObj } = this.state
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
  downloadAsZip = (dataURIsObj) => {
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
  getPreview = () => {
    let { staffDetails } = this.state
    return (
      <React.Fragment>
        <React.Fragment>

          <Button
            variant='contained'
            size='small'
            style={{ margin: 10 }}
            onClick={e => this.modelBranch(staffDetails.staff[0].branch_fk.id)}
          >
                  Edit Branch Details
          </Button>

          <Button
            variant='contained'
            size='small'
            style={{ margin: 10 }}
            onClick={e => this.modelStaff(staffDetails.principleId)}
          >
                  Edit Principal Details
          </Button>
          <Button
            size='small'
            variant='contained'
            style={{ margin: 10 }}
            onClick={e => {
              let refresh = Math.random()
              this.setState({ refresh }, s => {
                let x = this.state
                console.log(x)
              })
            }}
          >
            Reload All
          </Button>

          <Button
            color='primary'
            variant='contained'
            style={{ margin: 10 }}
            onClick={
              e => {
                this.downloadAsZip(this.state.dataURIs)
              }
            }
            disabled={!(Object.values(this.state.dataURIs).length)}
          >
            Download All
          </Button>
          <Button
            color='primary'
            variant='contained'
            style={{ margin: 10 }}
            onClick={this.printAll}
            disabled={!(Object.values(this.state.dataURIs).length)}
          >
            Print All
          </Button>
        </React.Fragment>

        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100%', marginTop: '30px', justifyContent: 'space-around' }} >
          {staffDetails.staff.map((staff, index) => {
            return (
              <div key={index} style={{ margin: '10px', width: '30%' }}>
                <Button
                  variant='contained'
                  onClick={e => this.modelStaff(staff.id)}
                  size='small'
                >
                  Edit
                  {staff.name ? staff.name.split(' ')[0] : 'Staff'}'s Details
                </Button>
                {/* <Template staff={staff} data={staffDetails} /> */}

                <div style={{ border: '1px solid grey', margin: 0, padding: 0 }}>
                  <STAFFIDCANVAS payLoad={this.formatIDPayload(staff, staffDetails)} reload={this.state.refresh} sendDataURI={this.handledataURIs} />
                </div>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    )
  }
  handledataURIs = (dataURIObj) => {
    this.setState(preState => {
      return { dataURIs: { ...preState.dataURIs, ...dataURIObj } }
    })
  }
  formatIDPayload = (staff, data) => {
    let { departmentValue: { label: department } = {} } = this.state
    var payLoad = {}
    let { sign_dataURI: signDataURI } = data
    let {
      branch_fk: branchObj = {},
      name: primaryNameValue,
      employee_photo_dataURI: primaryImgDataURI,
      erp_code: ERP,
      contact_no: contactNo,
      designation: designationObj = {},
      address,
      id: staffId
    } = staff
    let { logo_URI: logoURI, id: branchId } = branchObj
    let { designation_name: designation } = designationObj
    payLoad = {
      ...payLoad,
      primaryNameValue,
      primaryImgDataURI,
      ERP,
      contactNo,
      address,
      logoURI,
      designation,
      signDataURI,
      staffId,
      branchId,
      department
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
  renderPreview = () => {
    let { staffDetails, loading } = this.state
    if (loading) {
      return <InternalPageStatus label={<p style={{ textAlign: 'center' }}>Loading...<br /><small>This may take few minutes to load</small></p>} />
    } else if (staffDetails === null) {
      return <InternalPageStatus label='Failed to fetch data' loader={false} />
    } else if (staffDetails && staffDetails.staff && staffDetails.staff.length === 0) {
      return <InternalPageStatus label='No data found' loader={false} />
    } else if (staffDetails && loading === false) {
      return this.getPreview()
    }
  }
  render () {
    let { branchValue, departmentValue, check, staffValue = [], staffData = [],
      openModelBranch, openModelStaff } = this.state
    return (
      <React.Fragment>
        <Modal open={openModelBranch} onClose={this.handleCloseBranch}>
          {this.getModelContentBranch()}
        </Modal>
        <Modal open={openModelStaff} onClose={this.handleCloseStaff}>
          {this.getModelContentStaff()}
        </Modal>
        <Grid container>
          <Grid style={{ margin: 8 }} item>
            <OmsSelect
              label='Department'
              name='department'
              // placeholder='Select Department'
              defaultValue={departmentValue}
              options={
                this.props.departments
                  ? this.props.departments.map(department => ({
                    value: department.id,
                    label: department.department_name
                  }))
                  : []
              }
              change={this.handleClickDepartment}
            />
          </Grid>
          <Grid style={{ margin: 8 }} item>
            <OmsSelect
              label='Branch'
              name='branch'
              // placeholder='Select Branch'
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }
              disabled={this.role === 'Principal'}
              defaultValue={branchValue}
              change={this.handleClickBranch}
            />
          </Grid>
          {(staffData.length && staffData.length === staffValue.length) ? ''
            : <Grid style={{ margin: 8 }} item>
              <OmsSelect
                label='Select Staff'
                name='staff'
                // placeholder='Select Staff'
                isMulti
                options={staffData && staffData.length > 0 && staffData.map((item) => {
                  return {
                    label: item.name,
                    value: item.id
                  }
                })}
                change={this.handleChangeStaff}
                defaultValue={staffValue}
              />
            </Grid>}
          <Grid style={{ margin: 16 }} item>
            <Form.Field required>
              <Form.Field>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={check}
                      onChange={this.selectall}
                      disabled={!branchValue || !staffData ||
                          (staffData && staffData.length === 0)}
                      value='checkedA'
                      color='primary'
                    />
                  }
                  label='Select All'
                />
              </Form.Field>
            </Form.Field>
          </Grid>
          <Grid style={{ margin: 16 }} item>
            <Button
              variant={'contained'}
              onClick={this.handleClick}
              color='primary'
            >
                Preview
            </Button>
          </Grid>
          {/* <Grid style={{ margin: 16 }} item>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handlePrint}
              disabled={!staffDetails}
            >
                Print
            </Button>
          </Grid> */}
        </Grid>
        <div>
          {this.renderPreview()}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  departments: state.department.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  listDepartments: dispatch(apiActions.listDepartments())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StaffIdCard))
