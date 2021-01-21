import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { Button, Grid, TextField } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'
import { AddCircle, Edit } from '@material-ui/icons'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { apiActions } from '../../../../../_actions'
import { FilterInnerComponent, filterMethod } from '../../../../Finance/FilterInnerComponent/filterInnerComponent'
import Modal from '../../../../../ui/Modal/modal'
import EditItems from './editAddItems'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../../../store/actions'
import custClasses from './addItem.module.css'

let itemState = null

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    backgroundColor: '#2196f3',
    marginTop: '0px',
    '&:hover': {
      backgroundColor: '#1a8cff'
    }
  },
  divIcon: {
    paddingTop: '30px'
  },
  icon: {
    color: '#2196f3',
    fontWeight: 'bolder',
    fontSize: 30,
    '&:hover': {
      color: '#1a8cff',
      cursor: 'pointer'
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

const GENDER = [
  { id: 1, gender: 'Male' },
  { id: 2, gender: 'Female' },
  { id: 3, gender: 'Both' }
]
class AddItems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSession: null,
      entryModal: false,
      addSubCatModal: false,
      addMeasurementModal: false,
      addColorModal: false,
      currentBranch: null,
      currentGrade: null,
      isUniform: false,
      inclusiveGst: true,
      selectedGender: null,
      uploadFileName: '',
      uploadFile: null,
      color: null,
      subCat: null,
      measurement: null,
      soldAlone: false,
      showAdd: false,
      editModal: false,
      itemsId: null,
      // isBundled: false,
      compulsoryValue: {
        label: 'Compulsory for Both',
        value: 4
      },
      bulkFile: null,
      showBulk: false,
      isDelivery: false
    }
    this.fileInputRef = React.createRef()
    this.measurementRef = React.createRef()
    this.subCatRef = React.createRef()
    this.colorRef = React.createRef()
    this.nameRef = React.createRef()
    this.descriptionRef = React.createRef()
    this.skuRef = React.createRef()
    this.barRef = React.createRef()
    this.sacRef = React.createRef()
    this.saleRef = React.createRef()
    this.taxRef = React.createRef()
    this.gstRef = React.createRef()
  }

  componentDidMount () {
    if (itemState) {
      this.setState(itemState)
    }
  }

  sessionChangeHandler = (e) => {
    this.setState({
      currentSession: e.value,
      currentBranch: null,
      currentGrade: null
    }, () => {
      this.props.fetchBranches(this.state.currentSession, this.props.alert, this.props.user)
    })
  }

  branchChangeHandler = (e) => {
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      },
      currentGrade: null
    }, () => {
      this.props.fetchGrades(this.state.currentSession, this.state.currentBranch.id, this.props.user, this.props.alert)
    })
  }

  genderChangeHandler = (e) => {
    this.setState({
      selectedGender: {
        id: e.value,
        gender: e.label
      }
    })
  }

  gradeChangeHandler = (e) => {
    console.log(e)
    this.setState({
      currentGrade: {
        id: e.value,
        grade: e.label
      }
    })
  }

  uniformChangeHandler = (e) => {
    this.setState({
      isUniform: e.target.checked
    })
  }

  inclusiveGstChangeHandler = (e) => {
    this.setState({
      inclusiveGst: e.target.checked
    })
  }

  canSoldAloneChangeHandler = (e) => {
    this.setState({
      soldAlone: e.target.checked
    })
  }
  // bundleHandler = (e) => {
  //   this.setState({
  //     isBundled: e.target.checked
  //   })
  // }

  showEntryModal = () => {
    this.setState({
      entryModal: true
    }, () => {
      this.props.fetchUnitColorSubcat(this.props.alert, this.props.user)
    })
  }

  hideEntryModal = () => {
    this.setState({
      entryModal: false,
      isUniform: false,
      inclusiveGst: true,
      selectedGender: null,
      color: null,
      subCat: null,
      measurement: null,
      soldAlone: false,
      compulsoryValue: null,
      showBulk: false
      // isBundled: false
    })
  }

  showSubCatModal = () => {
    this.setState({
      addSubCatModal: true
    })
  }

  showMeasurementModal = () => {
    this.setState({
      addMeasurementModal: true
    })
  }

  editItemsHandler = (id) => {
    this.setState({
      editModal: true,
      itemsId: id
    })
  }

  hideEditModalHandler = () => {
    this.setState({
      editModal: false,
      itemsId: null
    })
  }

  showColorModal = () => {
    this.setState({
      addColorModal: true
    })
  }

  hideSubCatModal = () => {
    this.setState({
      addSubCatModal: false,
      addMeasurementModal: false,
      addColorModal: false
    })
  }

  uploadFileChangeHandler = (e) => {
    console.log('INside Change')
    const name = this.fileInputRef.current.value.split(/\\|\//).pop()
    const truncated = name.length > 20
      ? name.substr(name.length - 20)
      : name
    const formData = new FormData()
    formData.append('Details', this.fileInputRef.current.files[0])
    console.log('file')
    console.log(formData)
    this.setState({
      uploadFileName: truncated,
      uploadFile: formData
    })
  }

  browseButtonClickHandler = () => {
    console.log('Refffff')
    console.log(this.fileInputRef.current)
    this.fileInputRef.current.click()
  }

  createMeasurementHandler = () => {
    const unit = this.measurementRef.current.value
    if (unit.length === 0) {
      this.props.alert.warning('Please Give Some Measurement Value')
      return
    }
    this.props.createMeasurement(unit, this.props.alert, this.props.user)
    this.hideSubCatModal()
  }

  fetchMeasurementsHandler = () => {
    this.props.fetchMeasurements(this.props.alert, this.props.user)
  }

  createSubCatHandler = () => {
    const subCat = this.subCatRef.current.value
    if (subCat.length === 0) {
      this.props.alert.warning('Please Give Some Sub Category')
      return
    }
    this.props.createSubCat(subCat, this.props.alert, this.props.user)
    this.hideSubCatModal()
  }

  createColorHandler = () => {
    const color = this.colorRef.current.value
    if (color.length === 0) {
      this.props.alert.warning('Please Give Some Color Value')
      return
    }
    this.props.createColor(color, this.props.alert, this.props.user)
    this.hideSubCatModal()
  }

  subCatChangeHandler = (e) => {
    this.setState({
      subCat: {
        id: e.value,
        sub_category_name: e.label
      }
    })
  }

  measurementChangeHandler = (e) => {
    this.setState({
      measurement: {
        id: e.value,
        unit: e.label
      }
    })
  }

  colorChangeHandler = (e) => {
    this.setState({
      color: {
        id: e.value,
        color_name: e.label
      }
    })
  }

  compulsoryHandler = (e) => {
    this.setState({
      compulsoryValue: e
    })
  }

  deliveryChangeHandler = (e) => {
    if (e.target.checked) {
      this.setState({
        isDelivery: e.target.checked,
        isUniform: false
      })
    } else {
      this.setState({
        isDelivery: e.target.checked
      })
    }
  }

  addItemHandler = () => {
    const itemName = this.nameRef.current.value.length ? this.nameRef.current.value : null
    const itemDesc = this.descriptionRef.current.value.length ? this.descriptionRef.current.value : null
    const skuCode = this.skuRef.current.value.length ? this.skuRef.current.value : null
    const barCode = this.barRef.current.value.length ? this.barRef.current.value : null
    const sacCode = this.sacRef.current.value.length ? this.sacRef.current.value : null
    const salePrice = this.saleRef.current.value.length ? this.saleRef.current.value : null
    const taxCode = this.taxRef.current.value.length ? this.taxRef.current.value : null
    let gstPrice = this.gstRef.current.value.length ? this.gstRef.current.value : null
    if (this.state.inclusiveGst) {
      gstPrice = salePrice
    }
    const {
      subCat,
      selectedGender,
      measurement,
      inclusiveGst,
      isUniform,
      currentBranch,
      currentGrade,
      currentSession,
      soldAlone,
      compulsoryValue,
      isDelivery,
      isBundled
    } = this.state
    if (!compulsoryValue || !this.state.color || !subCat || !selectedGender || !measurement || !itemName || !salePrice || (!inclusiveGst && !gstPrice)) {
      this.props.alert.warning('Please Fill Select all Mandatory Fields')
      return
    }
    const {
      user,
      alert
    } = this.props
    const color = this.state.color ? { ...this.state.color } : null
    const payload = {
      currentSession,
      currentBranch,
      currentGrade,
      subCat,
      itemName,
      itemDesc,
      skuCode,
      sacCode,
      barCode,
      salePrice,
      taxCode,
      gstPrice,
      color,
      selectedGender,
      measurement,
      inclusiveGst,
      isUniform,
      soldAlone,
      compulsoryValue,
      isDelivery,
      isBundled,
      user,
      alert
    }
    this.props.addItem(payload)
    this.hideEntryModal()
  }

  createData = () => {
    return (this.props.itemsList.map((item, index) => {
      return {
        sNo: index + 1,
        ...item,
        icon: (
          <Edit style={{ cursor: 'pointer' }} onClick={() => this.editItemsHandler(item.id)} />
        ),
        category: item.is_uniform_item ? 'Uniform' : 'Stationary',
        measurement: item.unit_of_measurement.unit
      }
    }))
  }

  fetchItemsHandler = () => {
    const {
      currentBranch,
      currentGrade,
      currentSession
    } = this.state

    if (!currentBranch || !currentGrade || !currentSession) {
      this.props.alert.warning('Please Fill All Madatory Fields')
      return
    }
    this.props.fetchItems(currentSession, currentBranch, currentGrade, this.props.alert, this.props.user)

    this.setState({
      showAdd: true
    }, () => {
      itemState = this.state
    })
  }

  fileChangeHandler = (event) => {
    const file = event.target.files[0]
    this.setState({
      bulkFile: file
    })
  }

  bulkItemShowHandler = (e) => {
    console.log('switch value: ', e.target.value)
    this.setState({
      showBulk: e.target.checked
    })
  }

  uploadItems = () => {
    const { currentSession, currentBranch, currentGrade, bulkFile } = this.state

    const form = new FormData()
    form.set('academic_year', currentSession)
    form.set('branch', currentBranch.id)
    form.append('grade', currentGrade.id)
    form.append('file', bulkFile)
    for (var key of form.entries()) {
      console.log(key[0] + ', ' + key[1])
    }
    this.props.bulkItemsUpload(form, this.props.alert, this.props.user)
    this.hideEntryModal()
  }

  render () {
    const { classes } = this.props
    let entryModal = null
    let editModal = null

    const modalHeadStyle = {
      width: '100%',
      textAlign: 'center',
      marginTop: '12px'
    }

    const inputStyle = {
      alignItems: 'center',
      backgroundColor: 'hsl(0,0%,100%)',
      borderColor: 'hsl(0,0%,80%)',
      borderRadius: '4px',
      borderStyle: 'solid',
      borderWidth: '1px',
      cursor: 'default',
      height: '38px',
      paddingLeft: '12px'
    }

    let itemTable = null
    if (this.props.itemsList && this.props.itemsList.length) {
      itemTable = (<ReactTable
        // pages={Math.ceil(this.props.transactionDetails.count / 20)}
        data={this.createData()}
        columns={[
          {
            Header: 'S.No',
            accessor: 'sNo',
            width: 50,
            sortable: true
          },
          {
            Header: 'Item Name',
            accessor: 'item_name',
            sortable: true,
            Filter: props => <FilterInnerComponent {...props} />,
            filterMethod: filterMethod,
            style: {
              paddingLeft: '20px'
            }
          },
          {
            Header: 'Item Description',
            accessor: 'item_description',
            Filter: props => <FilterInnerComponent {...props} />,
            filterMethod: filterMethod,
            sortable: true
          },
          {
            Header: 'Category',
            accessor: 'category',
            Filter: props => <FilterInnerComponent {...props} />,
            filterMethod: filterMethod,
            sortable: true
          },
          {
            Header: 'SKU Code',
            accessor: 'sku_code',
            Filter: props => <FilterInnerComponent {...props} />,
            filterMethod: filterMethod,
            sortable: true
          },
          {
            Header: 'SAC Code',
            accessor: 'sac_code',
            Filter: props => <FilterInnerComponent {...props} />,
            filterMethod: filterMethod,
            sortable: true
          },
          {
            Header: 'Measurement',
            accessor: 'measurement',
            Filter: props => <FilterInnerComponent {...props} />,
            filterMethod: filterMethod,
            sortable: false
          },
          {
            Header: 'Edit',
            accessor: 'icon',
            filterable: false,
            width: 70,
            style: {
              paddingLeft: '10px'
            },
            sortable: false
          }
        ]}
        filterable
        sortable
        defaultPageSize={20}
        showPageSizeOptions={false}
        className='-striped -highlight'
      />)
    }

    if (this.state.entryModal) {
      entryModal = (
        <Modal open={this.state.entryModal} click={this.hideEntryModal}>
          <React.Fragment>
            <h3 style={modalHeadStyle}>Add Items</h3>
            <hr />
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='10'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.showBulk}
                      onChange={this.bulkItemShowHandler}
                      value='bulkItemUpload'
                      color='primary'
                    />
                  }
                  label='Is Bulk Item Upload'
                />
              </Grid>
              {!this.state.showBulk
                ? <React.Fragment>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Store Sub Category*</label>
                    <Select
                      placeholder='Sub Category'
                      value={this.state.subCat ? ({
                        value: this.state.subCat.id,
                        label: this.state.subCat.sub_category_name
                      }) : null}
                      options={
                        this.props.subCatList.length
                          ? this.props.subCatList.map(list => ({ value: list.id, label: list.sub_category_name })
                          ) : []}
                      onChange={this.subCatChangeHandler}
                    />
                  </Grid>
                  <Grid item xs='2'>
                    <div className={classes.divIcon}><AddCircle className={classes.icon} onClick={this.showSubCatModal} /></div>
                  </Grid>
                  {/* <Grid item xs='5'>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.isBundled}
                          onChange={this.bundleHandler}
                          value='isBundled'
                          color='primary'
                        />
                      }
                      label='Is Bundled?'
                    />
                  </Grid> */}
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20', width: '100%' }}>Item Name*</label>
                    <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter Item Name' ref={this.nameRef} />
                  </Grid>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Item Description</label>
                    <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter Item Description' ref={this.descriptionRef} />
                  </Grid>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Enter SKU Code</label>
                    <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter SKU Code' ref={this.skuRef} />
                  </Grid>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Enter Bar Code</label>
                    <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter Bar Code' ref={this.barRef} />
                  </Grid>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Enter SAC Code</label>
                    <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter SAC Code' ref={this.sacRef} />
                  </Grid>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Unit Of Measurement*</label>
                    <Select
                      placeholder='Measurement'
                      value={this.state.measurement ? ({
                        value: this.state.measurement.id,
                        label: this.state.measurement.unit
                      }) : null}
                      options={
                        this.props.measurementsList.length
                          ? this.props.measurementsList.map(list => ({ value: list.id, label: list.unit })
                          ) : []}
                      onChange={this.measurementChangeHandler}
                    />
                  </Grid>
                  <Grid item xs='2'>
                    <div className={classes.divIcon}><AddCircle className={classes.icon} onClick={this.showMeasurementModal} /></div>
                  </Grid>
                  <Grid item xs='4'>
                    <label style={{ fontWeight: '20' }}>Sale Price*</label>
                    <input type='number' style={{ ...inputStyle, width: '100%' }} placeholder='Sale Price' ref={this.saleRef} />
                  </Grid>
                  <Grid item xs='4'>
                    <label style={{ fontWeight: '20' }}>Tax %</label>
                    <input type='number' style={{ ...inputStyle, width: '100%' }} placeholder='Tax Percent' ref={this.taxRef} />
                  </Grid>
                  <Grid item xs='4'>
                    <label style={{ fontWeight: '20' }}>Price (GST Inc)</label>
                    <input type='number' style={{ ...inputStyle, width: '100%' }}
                      placeholder='Final Price'
                      ref={this.gstRef}
                      disabled={this.state.inclusiveGst} />
                  </Grid>
                  <Grid item xs='5'>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.inclusiveGst}
                          onChange={this.inclusiveGstChangeHandler}
                          value='inclusiveGST'
                          color='primary'
                        />
                      }
                      label='Selling Price Inclusive Of GST'
                    />
                  </Grid>
                  <Grid item xs='5'>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.isUniform}
                          onChange={this.uniformChangeHandler}
                          value='isUniform'
                          color='primary'
                          disabled={this.state.isDelivery}
                        />
                      }
                      label='Is Uniform'
                    />
                  </Grid>
                  <Grid item xs='5'>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.soldAlone}
                          onChange={this.canSoldAloneChangeHandler}
                          value='canSoldAlone'
                          color='primary'
                          // disabled={this.state.isDelivery}
                        />
                      }
                      label='Can be Sold Alone'
                    />
                  </Grid>
                  <Grid item xs='5'>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.isDelivery}
                          onChange={this.deliveryChangeHandler}
                          value='isDelivery'
                          color='primary'
                        />
                      }
                      label='Delivery Charges'
                    />
                  </Grid>
                  <Grid container spacing={3} style={{ padding: 15 }}>
                    <Grid item xs='4'>
                      <label style={{ fontWeight: '20' }}>Gender*</label>
                      <Select
                        placeholder='Gender'
                        value={this.state.selectedGender ? ({
                          value: this.state.selectedGender.id,
                          label: this.state.selectedGender.gender
                        }) : null}
                        options={
                          GENDER.map(gender => ({ value: gender.id, label: gender.gender })
                          )}
                        onChange={this.genderChangeHandler}
                      />
                    </Grid>
                    <Grid item xs='4'>
                      <label style={{ fontWeight: '20' }}>Color*</label>
                      <Select
                        placeholder='Color'
                        value={this.state.color ? ({
                          value: this.state.color.id,
                          label: this.state.color.color_name
                        }) : null}
                        options={
                          this.props.colorsList.map(list => ({ value: list.id, label: list.color_name })
                          )}
                        onChange={this.colorChangeHandler}
                      />
                    </Grid>
                    <Grid item xs='4'>
                      <div className={classes.divIcon}><AddCircle className={classes.icon} onClick={this.showColorModal} /></div>
                    </Grid>
                  </Grid>
                  <Grid item xs='5' style={{ marginTop: 20 }}>
                    <div className={custClasses['input-container']}>
                      <input type='file' id='real-input' className={custClasses.fileInput} ref={this.fileInputRef} onChange={this.uploadFileChangeHandler} />
                      <button className={custClasses['browse-btn']} onClick={this.browseButtonClickHandler}>
                          Browse Files
                      </button>
                      <span className={custClasses['file-info']}>{this.state.uploadFileName ? this.state.uploadFileName : 'Upload a file'}</span>
                    </div>
                  </Grid>
                  <Grid item xs='5'>
                    <label style={{ fontWeight: '20' }}>Is Compulsory*</label>
                    <Select
                      placeholder='Is Compulsory'
                      value={this.state.compulsoryValue ? this.state.compulsoryValue : null}
                      options={[
                        {
                          label: 'Compulsory only for New Students',
                          value: 1
                        },
                        {
                          label: 'Compulsory only for Old Students',
                          value: 2
                        },
                        {
                          label: 'Not Compulsory for Both',
                          value: 3
                        },
                        {
                          label: 'Compulsory for Both',
                          value: 4
                        }
                      ]}
                      onChange={this.compulsoryHandler}
                    />
                  </Grid>
                  <Grid container spacing={3} style={{ padding: 15 }}>
                    <Grid item xs='3'>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={this.addItemHandler}
                        className={classes.button}
                      >Assign</Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
                : <React.Fragment>
                  <TextField
                    id='file_upload'
                    margin='dense'
                    style={{ width: 230, margin: '0px', paddingRight: 10 }}
                    type='file'
                    required
                    variant='outlined'
                    inputProps={{ accept: '.xlsx' }}
                    helperText={(
                      <span>
                        <span>Upload Items</span>
                        {/* <span
                          onClick={downloadSample}
                          onKeyDown={() => { }}
                          role='presentation'
                          style={{ color: 'purple', paddingLeft: '5px' }}
                        >
                          Download Format
                        </span> */}
                      </span>
                    )}
                    onChange={this.fileChangeHandler}
                  />
                  <Button variant='outlined' color='primary' onClick={this.uploadItems} disabled={!this.state.currentSession || !this.state.currentBranch || !this.state.currentGrade || !this.state.bulkFile}>
                    Upload Items
                  </Button>
                </React.Fragment>}

            </Grid>
          </React.Fragment>
        </Modal>
      )
    }

    let addSubCatModal = null
    if (this.state.addSubCatModal) {
      addSubCatModal = (
        <Modal open={this.state.addSubCatModal}
          style={{ zIndex: '1400', width: '40%', minHeight: '250px' }}
          click={this.hideSubCatModal}>
          <React.Fragment>
            <h3 style={modalHeadStyle}>Add Sub Category</h3>
            <hr />
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='6'>
                <label style={{ fontWeight: '20' }}>Store Sub Category*</label>
                <input type='text' style={inputStyle} placeholder='Enter Sub Categoty Name' ref={this.subCatRef} />
              </Grid>
              <Grid item xs='12'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.createSubCatHandler}
                  className={classes.button}
                >Assign</Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Modal>
      )
    }

    let addMeasurementModal = null
    if (this.state.addMeasurementModal) {
      addMeasurementModal = (
        <Modal open={this.state.addMeasurementModal}
          style={{ zIndex: '1400', width: '40%', minHeight: '250px' }}
          click={this.hideSubCatModal}>
          <React.Fragment>
            <h3 style={modalHeadStyle}>Add Measurement Unit</h3>
            <hr />
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='6'>
                <label style={{ fontWeight: '20' }}>Measurement Unit*</label>
                <input type='text' style={inputStyle} placeholder='Enter Measurement Unit' ref={this.measurementRef} />
              </Grid>
              <Grid item xs='12'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.createMeasurementHandler}
                  className={classes.button}
                >Assign</Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Modal>
      )
    }

    let addColorModal = null
    if (this.state.addColorModal) {
      addColorModal = (
        <Modal open={this.state.addColorModal}
          style={{ zIndex: '1400', width: '40%', minHeight: '250px' }}
          click={this.hideSubCatModal}>
          <React.Fragment>
            <h3 style={modalHeadStyle}>Add New Color</h3>
            <hr />
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='6'>
                <label style={{ fontWeight: '20' }}>Color*</label>
                <input type='text' style={inputStyle} placeholder='Enter Color' ref={this.colorRef} />
              </Grid>
              <Grid item xs='12'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.createColorHandler}
                  className={classes.button}
                >Assign</Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Modal>
      )
    }

    if (this.state.editModal) {
      editModal = (
        <Modal open={this.state.editModal} large click={this.hideEditModalHandler}>
          <EditItems itemid={this.state.itemsId} user={this.props.user} alert={this.props.alert} close={this.hideEditModalHandler} />
        </Modal>
      )
    }

    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs={8} />
          <Grid item xs={2}>
            {this.state.showAdd ? (<Button variant='outlined' color='primary' onClick={this.showEntryModal} disabled={!this.state.currentSession || !this.state.currentBranch || !this.state.currentGrade}>
                Add Items
            </Button>) : null}
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label style={{ fontWeight: '20' }}>Academic Year*</label>
            <Select
              placeholder='Select Session'
              value={this.state.currentSession ? ({
                value: this.state.currentSession,
                label: this.state.currentSession
              }) : null}
              options={
                this.props.session && this.props.session.session_year.length
                  ? this.props.session.session_year.map(session => ({ value: session, label: session })
                  ) : []}
              onChange={this.sessionChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label style={{ fontWeight: '20' }}>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.currentBranch ? ({
                value: this.state.currentBranch.id,
                label: this.state.currentBranch.branch_name
              }) : null}
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }
              onChange={this.branchChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label style={{ fontWeight: '20' }}>Grade*</label>
            <Select
              placeholder='Select Grade'
              value={this.state.currentGrade ? ({
                value: this.state.currentGrade.id,
                label: this.state.currentGrade.grade
              }) : null}
              options={
                this.props.grades && this.props.grades.length
                  ? this.props.grades.map(gradeEle => ({
                    value: gradeEle.grade.id,
                    label: gradeEle.grade.grade
                  }))
                  : []
              }
              onChange={this.gradeChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 20 }}
              onClick={this.fetchItemsHandler}
              className={classes.button}
            >Get</Button>
          </Grid>
        </Grid>
        {entryModal}
        {addSubCatModal}
        {addMeasurementModal}
        {addColorModal}
        {itemTable}
        {editModal}
        {this.props.dataLoading || this.props.gradeLoader ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  grades: state.finance.common.gradesPerBranch,
  gradeLoader: state.gradeMap.loading,
  session: state.academicSession.items,
  colorsList: state.inventory.storeAdmin.schoolStore.colorsList,
  measurementsList: state.inventory.storeAdmin.schoolStore.measurementsList,
  subCatList: state.inventory.storeAdmin.schoolStore.storeSubCat,
  itemsList: state.inventory.storeAdmin.schoolStore.itemsList
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  createMeasurement: (unit, alert, user) => dispatch(actionTypes.createMeasurement({ unit, alert, user })),
  fetchUnitColorSubcat: (alert, user) => dispatch(actionTypes.listUnitColorSubCat({ alert, user })),
  createColor: (color, alert, user) => dispatch(actionTypes.createColor({ color, alert, user })),
  createSubCat: (subCatName, alert, user) => dispatch(actionTypes.createSubcat({ subCatName, alert, user })),
  addItem: (payload) => dispatch(actionTypes.addItem(payload)),
  fetchGrades: (session, branch, user, alert) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, user, alert })),
  fetchItems: (session, branch, grade, alert, user) => dispatch(actionTypes.listItems({ session, branch, grade, alert, user })),
  bulkItemsUpload: (body, alert, user) => dispatch(actionTypes.bulkItemsUpload({ body, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddItems))
