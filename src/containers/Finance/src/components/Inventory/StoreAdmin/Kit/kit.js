import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import {
  withStyles,
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow, 
  TablePagination
} from '@material-ui/core/'
import { AddCircle, DeleteForever } from '@material-ui/icons'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'

import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import { FilterInnerComponent, filterMethod } from '../../../Finance/FilterInnerComponent/filterInnerComponent'
import classesCSS from './kit.module.css'
import Layout from '../../../../../../Layout'

let kitState = null

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: '#fff',
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
  },
  deleteButton: {
    color: '#fff',
    backgroundColor: 'rgb(225, 0, 80)'
  }
})
class Kit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      entryModal: false,
      color: null,
      currentBranch: null,
      currentGrade: null,
      currentSession: null,
      addColorModal: null,
      isOldStudent: false,
      isNewStudent: false,
      isUniform: true,
      secondLang: null,
      thirdLang: null,
      itemArr: [],
      showAdd: false,
      isMandatory: true,
      showDeleteModal: false,
      deleteKitId: null,
      itemQuantity: {},
      showViewModal: false,
      kitdata: {},
      kitName: null,
      kitDesp: null,
      kitAmount: null,
      kitId: null,
      isCommon: false,
      commonKitArr: [],
      isDelivery: false
    }

    this.kitNameRef = React.createRef()
    this.kitDescriptionRef = React.createRef()
    this.kitPriceRef = React.createRef()
    this.colorRef = React.createRef()
  }

  componentDidMount () {
    if (kitState) {
      console.log('initial state -- Kit', kitState)
      this.setState(kitState, () => {
        const {
          currentBranch,
          currentGrade,
          currentSession
        } = this.state
        if (currentBranch && currentGrade && currentSession) {
          this.props.fetchItems(currentSession, currentBranch, currentGrade, this.props.alert, this.props.user)
        }
      })
    }
  }

  sessionChangeHandler = (e) => {
    this.setState({
      currentSession: e.value,
      currentBranch: null,
      currentGrade: null,
      page: 0,
      rowsPerPage: 10
    }, () => {
      this.props.fetchBranches(this.state.currentSession, this.props.alert, this.props.user)
    })
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
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

  gradeChangeHandler = (e) => {
    console.log(e)
    this.setState({
      currentGrade: {
        id: e.value,
        grade: e.label
      }
    })
  }

  fetchItemsHandler = () => {
    const {
      currentBranch,
      currentGrade,
      currentSession
    } = this.state

    if (!currentBranch || !currentGrade || !currentSession) {
      // this.props.alert.warning('Please Fill All Madatory Fields')
      return
    }
    this.props.fetchItems(currentSession, currentBranch, currentGrade, this.props.alert, this.props.user)
    this.setState({
      showAdd: true
    }, () => {
      kitState = this.state
    })
  }

  showEntryModal = () => {
    this.setState({
      entryModal: true
    }, () => {
      const {
        currentSession,
        currentBranch,
        currentGrade
      } = this.state
      this.props.listColorItems(currentSession, currentBranch, currentGrade, true, false, this.props.alert, this.props.user)
    })
  }

  hideEntryModal = () => {
    this.setState({
      entryModal: false,
      isOldStudent: false,
      isNewStudent: false,
      isUniform: true,
      secondLang: null,
      thirdLang: null,
      itemArr: [],
      isMandatory: true,
      color: null,
      itemQuantity: {},
      kitAmount: null,
      commonKitArr: [],
      isCommon: false
    })
  }

  viewDetailsModalHandler = (id) => {
    const data = this.props.kitList.filter(ele => ele.id === id)[0]
    const existingItemArr = data.item.map((ele) => {
      return ({ value: ele.id, label: `${ele.item_name} : ${ele.item_description}`, price: ele.final_price_after_gst })
    })
    const quantity = data.quantity.flat().reduce((acc, curr) => {
      acc[curr.id] = curr.quantity
      return acc
    }, {})
    this.setState({
      showViewModal: true,
      kitdata: data,
      isCommon: data.is_common_kit,
      itemArr: existingItemArr,
      isOldStudent: data.is_applicable_to_old_student,
      isNewStudent: data.is_applicable_to_new_student,
      isUniform: data.is_uniform_kit,
      secondLang: {
        id: data.second_language && data.second_language.id ? data.second_language.id : null,
        subject_name: data.second_language && data.second_language.subject_name ? data.second_language.subject_name : null
      },
      thirdLang: {
        id: data.third_language && data.third_language.id ? data.third_language.id : null,
        subject_name: data.third_language && data.third_language.subject_name ? data.third_language.subject_name : null
      },
      isMandatory: data.is_mandatory,
      color: data.kit_colour,
      kitName: data.kit_name,
      kitDesp: data.kit_description,
      kitAmount: data.kit_price,
      kitId: data.id,
      itemQuantity: quantity,
      isDelivery: data.is_delivery_kit
    }, () => {
      const {
        currentSession,
        currentBranch,
        currentGrade
      } = this.state
      this.props.listColorItems(currentSession, currentBranch, currentGrade, data.is_uniform_kit, data.is_delivery_kit, this.props.alert, this.props.user)
    })
  }

  hideViewModalHandler = () => {
    this.setState({
      showViewModal: false,
      isOldStudent: false,
      isNewStudent: false,
      isUniform: true,
      secondLang: null,
      thirdLang: null,
      itemArr: [],
      isMandatory: true,
      color: null,
      itemQuantity: {},
      kitAmount: null,
      kitName: null,
      kitDesp: null,
      kitId: null,
      commonKitArr: [],
      isCommon: false,
      isDelivery: false
    })
  }

  showColorModal = () => {
    this.setState({
      addColorModal: true
    })
  }

  hideColorModal = () => {
    this.setState({
      addColorModal: false
    })
  }

  createColorHandler = () => {
    const color = this.colorRef.current.value
    if (color.length === 0) {
      // this.props.alert.warning('Please Give Some Color Value')
      return
    }
    this.props.createColor(color, this.props.alert, this.props.user)
    this.hideColorModal()
  }

  colorChangeHandler = (e) => {
    this.setState({
      color: {
        id: e.value,
        color_name: e.label
      }
    })
  }

  calculateKitPrice = () => {
    let { itemQuantity, itemArr, commonKitArr } = this.state
    let kitPrice = 0
    itemArr.forEach(item => {
      kitPrice += (item.price * (itemQuantity[item.value] || 0))
    })
    commonKitArr.forEach(item => {
      kitPrice += item.price
    })
    this.setState({
      kitAmount: kitPrice
    })
  }

  itemChangeHandler = (e) => {
    const {
      commonKitArr
    } = this.state
    let kitItems = []
    if (commonKitArr.length) {
      commonKitArr.forEach(kit => {
        const ids = kit.quantity.map(ele => ele.id)
        kitItems = [...kitItems, ...ids]
      })
    }
    const items = e.map(ele => +ele.value)
    const found = kitItems.some(r => items.indexOf(r) >= 0)
    if (found) {
      // this.props.alert.warning('Duplicate Item Found')
      return
    }

    this.setState({
      itemArr: e
    })
  }

  commonKitChangeHandler = (e) => {
    let kitItems = []
    let error = false
    e.forEach(kit => {
      const ids = kit.quantity.map(ele => +ele.id)
      const found = kitItems.some(r => ids.indexOf(r) >= 0)
      if (found) {
        error = true
      }
      kitItems = [...kitItems, ...ids]
    })
    if (error) {
      // this.props.alert.warning('Duplicate Items in Two Kits')
      return
    }
    const {
      itemArr
    } = this.state
    const items = itemArr.map(ele => +ele.value)
    const found = kitItems.some(r => items.indexOf(r) >= 0)
    if (found) {
      // this.props.alert.warning('Duplicate Item Found')
      return
    }
    this.setState({
      commonKitArr: e
    }, () => {
      this.calculateKitPrice()
    })
  }

  oldStudentChangeHandler = (e) => {
    this.setState({
      isOldStudent: e.target.checked
    })
  }

  newStudentChangeHandler = (e) => {
    this.setState({
      isNewStudent: e.target.checked
    })
  }

  uniformChangeHandler = (e) => {
    this.setState({
      isUniform: e.target.checked,
      isCommon: false,
      secondLang: null,
      thirdLang: null
    }, () => {
      const {
        currentBranch,
        currentSession,
        currentGrade,
        isUniform,
        isDelivery
      } = this.state
      this.props.listColorItems(currentSession, currentBranch, currentGrade, isUniform, isDelivery, this.props.alert, this.props.user)
    })
  }

  commonChangeHandler = (e) => {
    this.setState({
      isCommon: e.target.checked
    })
  }

  mandatoryChangeHandler = (e) => {
    this.setState({
      isMandatory: e.target.checked
    })
  }

  deliveryChangeHandler = (e) => {
    if (e.target.checked) {
      this.setState({
        isDelivery: e.target.checked,
        isUniform: false,
        isCommon: false
      }, () => {
        const {
          currentBranch,
          currentSession,
          currentGrade,
          isUniform,
          isDelivery
        } = this.state
        this.props.listColorItems(currentSession, currentBranch, currentGrade, isUniform, isDelivery, this.props.alert, this.props.user)
      })
    } else {
      this.setState({
        isDelivery: e.target.checked
      }, () => {
        const {
          currentBranch,
          currentSession,
          currentGrade,
          isUniform,
          isDelivery
        } = this.state
        this.props.listColorItems(currentSession, currentBranch, currentGrade, isUniform, isDelivery, this.props.alert, this.props.user)
      })
    }
  }

  langSecChangeHandler = (e) => {
    this.setState({
      secondLang: {
        id: e.value,
        subject_name: e.label
      }
    })
  }

  langThirdChangeHandler = (e) => {
    this.setState({
      thirdLang: {
        id: e.value,
        subject_name: e.label
      }
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      deleteKitId: null
    })
  }

  deleteModalShowHandler = (kitId) => {
    this.setState({
      showDeleteModal: true,
      deleteKitId: kitId
    })
  }

  createGradeKitHandler = () => {
    const kitName = this.kitNameRef.current.value.length ? this.kitNameRef.current.value : null
    const kitDesc = this.kitDescriptionRef.current.value ? this.kitDescriptionRef.current.value : null
    // console.log(kitName, kitDesc, kitPrice)
    const {
      currentBranch,
      currentGrade,
      currentSession,
      isNewStudent,
      isOldStudent,
      isUniform,
      color,
      itemArr,
      secondLang,
      thirdLang,
      isMandatory,
      itemQuantity,
      kitAmount,
      isCommon,
      commonKitArr,
      isDelivery
    } = this.state

    const {
      user,
      alert
    } = this.props
    // const quantityId = Object.keys(itemQuantity)
    let isError = false
    const items = itemArr.map(item => {
      if (!itemQuantity[item.value]) {
        isError = true
        return
      }
      return ({
        id: item.value,
        quantity: itemQuantity[item.value]
      })
    })
    const itemsId = itemArr.map(item => item.value)
    const commonKitIds = commonKitArr.map(item => item.value)
    if (isError) {
      // alert.warning('Every Item should have some quantity')
      return
    }

    const payload = {
      currentSession,
      currentBranch,
      currentGrade,
      kitName,
      kitDesc,
      kitPrice: kitAmount,
      color,
      isNewStudent,
      isOldStudent,
      isUniform,
      isMandatory,
      items,
      itemsId,
      isCommon,
      commonKitIds,
      secondLang,
      thirdLang,
      isDelivery,
      user,
      alert
    }

    if (!kitName || !kitDesc || !kitAmount || (!isNewStudent && !isOldStudent)) {
      // this.props.alert.warning('Please Fill Select all Mandatory Fields')
      return
    }

    if (!itemsId.length && !commonKitIds.length) {
      // this.props.alert.warning('Please Select at least an item or a kit')
      return
    }

    this.props.createKit(payload)
    this.hideEntryModal()
  }

  kitValueHandler = (event) => {
    switch (event.target.id) {
      case 'kit_name': {
        this.setState({
          kitName: event.target.value
        })
        break
      }
      case 'kit_desp': {
        this.setState({
          kitDesp: event.target.value
        })
        break
      }
      case 'kit_amount': {
        if (event.target.value > 0) {
          this.setState({
            kitAmount: event.target.value
          })
        } else {
          // this.props.alert.warning('Amount cant be 0')
        }
        break
      }
      default: {

      }
    }
  }

  saveKitDetails = () => {
    const {
      kitName,
      kitDesp,
      kitAmount,
      color,
      currentBranch,
      currentGrade,
      currentSession,
      isNewStudent,
      isOldStudent,
      isUniform,
      itemArr,
      secondLang,
      thirdLang,
      isMandatory,
      kitId,
      itemQuantity,
      isCommon,
      commonKitArr,
      isDelivery
    } = this.state

    const {
      user,
      alert
    } = this.props

    let isError = false
    const items = itemArr.map(item => {
      if (!itemQuantity[item.value]) {
        isError = true
        return
      }
      return ({
        id: item.value,
        quantity: itemQuantity[item.value]
      })
    })
    const itemsId = itemArr.map(item => item.value)
    const commonKitIds = commonKitArr.map(item => item.value)
    if (isError) {
      // alert.warning('Every Item should have some quantity')
      return
    }

    const payload = {
      currentSession,
      currentBranch,
      currentGrade,
      kitName,
      kitDesp,
      kitAmount,
      color,
      isNewStudent,
      isOldStudent,
      isUniform,
      isMandatory,
      itemsId,
      items,
      secondLang,
      thirdLang,
      kitId,
      user,
      alert,
      isCommon,
      commonKitIds,
      isDelivery
    }

    if (!kitName || !kitDesp || !kitAmount || (!isNewStudent && !isOldStudent)) {
      // this.props.alert.warning('Please Fill Select all Mandatory Fields')
      return
    }

    if (!itemsId.length && !commonKitIds.length) {
      // this.props.alert.warning('Please Select at least an item or a kit')
      return
    }

    this.props.updateKits(payload)
    this.hideViewModalHandler()
  }

  deleteKitHandler = () => {
    this.props.deleteKit(this.state.deleteKitId, this.props.user, this.props.alert)
    this.deleteModalCloseHandler()
  }

  itemQuantityHandler = (e, id) => {
    let { itemQuantity } = this.state
    if (e.target.value >= 1) {
      this.setState({ itemQuantity: { ...itemQuantity, [id]: e.target.value } }, () => {
        this.calculateKitPrice()
      })
    } else {
      // this.props.alert.warning('Quantity Cant be less than 1')
    }
  }
  createData = () => {
    return (this.props.kitList.map((item, index) => {
      return {
        sNo: index + 1,
        ...item,
        is_applicable_to_new_student: item.is_applicable_to_new_student ? 'Yes' : 'No',
        is_applicable_to_old_student: item.is_applicable_to_old_student ? 'Yes' : 'No',
        item: item.item && item.item.length,
        is_uniform_kit: item.is_uniform_kit ? 'Yes' : 'No',
        viewDetails: <Button
          variant='contained'
          color='primary'
          onClick={() => this.viewDetailsModalHandler(item.id)}
        >View Details</Button>,
        icon: <DeleteForever onClick={() => { this.deleteModalShowHandler(item.id) }} />
      }
    }))
  }
  render () {
    const { classes } = this.props
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

    // let itemTable = null
    // if (this.props.kitList && this.props.kitList.length) {
    //   itemTable = (<ReactTable
    //     // pages={Math.ceil(this.props.transactionDetails.count / 20)}
    //     data={this.createData()}
    //     columns={[
    //       {
    //         Header: 'S.No',
    //         accessor: 'sNo',
    //         width: 50,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Kit Name',
    //         accessor: 'kit_name',
    //         sortable: true,
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         style: {
    //           paddingLeft: '20px'
    //         }
    //       },
    //       {
    //         Header: 'Kit  Description',
    //         accessor: 'kit_description',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Kit Price',
    //         accessor: 'kit_price',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Uniform Kit',
    //         accessor: 'is_uniform_kit',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'For New Student',
    //         accessor: 'is_applicable_to_new_student',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'For Old Student',
    //         accessor: 'is_applicable_to_old_student',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: false
    //       },
    //       {
    //         Header: 'Items Count',
    //         accessor: 'item',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: false
    //       },
    //       {
    //         Header: 'View Details',
    //         accessor: 'viewDetails',
    //         filterable: false,
    //         width: 140,
    //         style: {
    //           paddingLeft: '10px',
    //           cursor: 'pointer'
    //           // width: '270px'
    //         },
    //         sortable: false
    //       },
    //       {
    //         Header: 'Delete',
    //         accessor: 'icon',
    //         filterable: false,
    //         width: 70,
    //         style: {
    //           paddingLeft: '10px',
    //           cursor: 'pointer'
    //         },
    //         sortable: false
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={20}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //   />)
    // }

    let subjectsChoice = null
    if (!this.state.isUniform && !this.state.isCommon && !this.state.isDelivery) {
      subjectsChoice = (
        <React.Fragment>
          <Grid item xs='7'>
            <label style={{ fontWeight: '20' }}>Language II</label>
            <Select
              placeholder='Select II Language'
              value={this.state.secondLang ? ({
                value: this.state.secondLang.id,
                label: this.state.secondLang.subject_name
              }) : null}
              options={
                this.props.subject && this.props.subject.length ? (this.props.subject.map(list => ({ value: list.id, label: list.subject_name })
                )) : []}
              onChange={this.langSecChangeHandler}
            />
          </Grid>
          <Grid item xs='7'>
            <label style={{ fontWeight: '20' }}>Language III</label>
            <Select
              placeholder='Select III Language'
              value={this.state.thirdLang ? ({
                value: this.state.thirdLang.id,
                label: this.state.thirdLang.subject_name
              }) : null}
              options={
                this.props.subject && this.props.subject.length ? (this.props.subject.map(list => ({ value: list.id, label: list.subject_name })
                )) : []}
              onChange={this.langThirdChangeHandler}
            />
          </Grid>
        </React.Fragment>
      )
    }

    let itemQuantityField = null
    if (this.state.itemArr) {
      itemQuantityField = (
        <div>
          {this.state.itemArr.map((item) => {
            return (
              <Grid container spacing={3} style={{ padding: 15 }}>
                <Grid item xs='6'>
                  {item.label}:
                  <input type='number'
                    value={this.state.itemQuantity[item.value]}
                    min='1' style={{ ...inputStyle, width: '100%' }}
                    placeholder='Enter Quantity' ref={this.quantityRef}
                    onChange={(e) => { this.itemQuantityHandler(e, item.value) }} />
                </Grid>
                <Grid item xs='3'>
                  <strong>Price : </strong>
                  <span>{this.state.itemQuantity[item.value] ? this.state.itemQuantity[item.value] * item.price : 0}
                  </span>
                </Grid>
              </Grid>
            )
          })}
        </div>
      )
    }
    let entryModal = null
    if (this.state.entryModal) {
      entryModal = (
        <Modal open={this.state.entryModal} click={this.hideEntryModal}>
          <React.Fragment>
            <h3 style={modalHeadStyle}>Add Kit</h3>
            <hr />
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='5'>
                <label style={{ fontWeight: '20', width: '100%' }}>Kit Name*</label>
                <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter Kit Name' ref={this.kitNameRef} />
              </Grid>
              <Grid item xs='5'>
                <label style={{ fontWeight: '20' }}>Kit Description*</label>
                <input type='text' style={{ ...inputStyle, width: '100%' }} placeholder='Enter Kit Description' ref={this.kitDescriptionRef} />
              </Grid>
              <Grid item xs='5'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isOldStudent}
                      onChange={this.oldStudentChangeHandler}
                      value='oldStudent'
                      color='primary'
                    />
                  }
                  label='Applicable To Old Student'
                />
              </Grid>
              <Grid item xs='5'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isNewStudent}
                      onChange={this.newStudentChangeHandler}
                      value='newStudent'
                      color='primary'
                    />
                  }
                  label='Applicable To New Student'
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
              {
                !this.state.isUniform ? (
                  <Grid item xs='5'>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.isCommon}
                          onChange={this.commonChangeHandler}
                          value='isCommon'
                          color='primary'
                          disabled={this.state.isDelivery}
                        />
                      }
                      label='Is Common'
                    />
                  </Grid>

                ) : null
              }
              <Grid item xs='5'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isMandatory}
                      onChange={this.mandatoryChangeHandler}
                      value='isMandatory'
                      color='primary'
                    />
                  }
                  label='Is Mandatory'
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
                  label='Delivery Charge'
                />
              </Grid>
              {!this.state.isUniform && !this.state.isCommon && !this.state.isDelivery ? (<React.Fragment>
                <Grid item xs='12' >
                  <label style={{ fontWeight: '20' }}>Select Common Kit</label>
                  <Select
                    isMulti
                    placeholder='Select Kit'
                    value={this.state.commonKitArr}
                    options={
                      this.props.kitList.filter(kit => kit.is_common_kit).map(list => ({
                        value: list.id,
                        label: `${list.kit_name} : ${list.kit_description}`,
                        price: list.kit_price,
                        quantity: list.quantity
                      }))
                    }
                    onChange={this.commonKitChangeHandler}
                  />
                </Grid>
              </React.Fragment>) : null}
              <Grid item xs='12'>
                <label style={{ fontWeight: '20' }}>Select Kit Items</label>
                <Select
                  isMulti
                  placeholder='Select Kit Items'
                  value={this.state.itemArr}
                  options={
                    this.props.itemsList.map(list => ({ value: list.id, label: `${list.item_name} : ${list.item_description}`, price: list.final_price_after_gst })
                    )}
                  onChange={this.itemChangeHandler}
                />
              </Grid>
              {itemQuantityField}
              <Grid item xs='5'>
                <label style={{ fontWeight: '20' }}>Kit Price*</label>
                <br />
                <input type='number' style={inputStyle} min='1' placeholder='Kit Price' id='kit_amount' onChange={(e) => { this.kitValueHandler(e) }} value={this.state.kitAmount ? this.state.kitAmount : ''} />
              </Grid>
              <Grid item xs='5'>
                <label style={{ fontWeight: '20' }}>Color</label>
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
              <Grid item xs='2'>
                <div className={classes.divIcon}><AddCircle className={classes.icon} onClick={this.showColorModal} /></div>
              </Grid>
              {subjectsChoice}
              <Grid item xs='12'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.createGradeKitHandler}
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
          click={this.hideColorModal}>
          <React.Fragment>
            <h3 style={modalHeadStyle}>Add New Color</h3>
            <hr />
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='8' >
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

    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small>
          <h3 className={classesCSS.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classesCSS.modal__deletebutton}>
            <Button className={classes.deleteButton} onClick={this.deleteKitHandler}>Delete</Button>
          </div>
          <div className={classesCSS.modal__remainbutton}>
            <Button className={classes.button} onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    let viewdetModal = null
    const { showViewModal, kitdata } = this.state
    if (showViewModal && kitdata) {
      viewdetModal = (
        <Modal open={showViewModal} large click={this.hideViewModalHandler}>
          <h3 className={classesCSS.modal__heading}>Kit Details</h3>
          <hr />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <label style={{ fontWeight: '20', width: '100%' }}>Kit Name :</label>&nbsp;
              <input type='text' style={inputStyle} placeholder='Kit Name' id='kit_name' onChange={(e) => { this.kitValueHandler(e) }} value={this.state.kitName ? this.state.kitName : ''} />
              {/* <label style={{ fontWeight: '20', width: '100%' }}>Kit Name :</label>&nbsp;{kitdata.kit_name ? kitdata.kit_name : ''} */}
            </Grid>
            <Grid item xs='3'>
              <label style={{ fontWeight: '20', width: '100%' }}>Kit Description* :</label>&nbsp;
              <input type='text' style={inputStyle} placeholder='Kit Description' id='kit_desp' onChange={(e) => { this.kitValueHandler(e) }} value={this.state.kitDesp ? this.state.kitDesp : ''} />
              {/* <label style={{ fontWeight: '20', width: '100%' }}>Kit Description :</label>&nbsp;{kitdata.kit_description ? kitdata.kit_description : ''} */}
            </Grid>
            <Grid item xs='3'>
              <label style={{ fontWeight: '20', width: '100%' }}>Kit Price*:</label>&nbsp;
              <input type='number' style={inputStyle} min='1' placeholder='Kit Price' id='kit_amount' onChange={(e) => { this.kitValueHandler(e) }} value={this.state.kitAmount ? this.state.kitAmount : ''} />
              {/* <label style={{ fontWeight: '20', width: '100%' }}>Kit Price :</label>&nbsp;{kitdata.kit_price ? kitdata.kit_price : ''} */}
            </Grid>
            {/* <Grid.Column
                computer={4}
                mobile={12}
                tablet={4}
                style={{ paddingLeft: '30px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.showViewModal} />
                  }
                  label='Uniform Kit'
                />
              </Grid.Column> */}
            <Grid item xs='12'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>S.No</TableCell>
                    <TableCell align='left'>Item Name</TableCell>
                    <TableCell align='left'>Final Price</TableCell>
                    <TableCell align='left'>Sale Price</TableCell>
                    <TableCell align='left'>Tax Code</TableCell>
                    <TableCell align='left'>Sku Code</TableCell>
                    <TableCell align='left'>Sac Code</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kitdata && kitdata.item.length > 0
                    ? kitdata.item.map((ele, index) => (
                      <TableRow>
                        <TableCell align='left'>{index + 1}</TableCell>
                        <TableCell align='left'>{ele.item_name ? ele.item_name : ''}</TableCell>
                        <TableCell align='left'>{ele.final_price_after_gst ? ele.final_price_after_gst : ''}</TableCell>
                        <TableCell align='left'>{ele.sale_price ? ele.sale_price : ''}</TableCell>
                        <TableCell align='left'>{ele.tax_code ? ele.tax_code : ''}</TableCell>
                        <TableCell align='left'>{ele.sku_code ? ele.sku_code : ''}</TableCell>
                        <TableCell align='left'>{ele.sac_code ? ele.sac_code : ''}</TableCell>
                      </TableRow>
                    )) : <TableRow>No Records Found !!!</TableRow>}
                </TableBody>
              </Table>
            </Grid>
            {/* other editable fields/ */}
            <Grid item xs='12'>
              <label style={{ fontWeight: '20' }}>Color</label>
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
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='5'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isOldStudent}
                      onChange={this.oldStudentChangeHandler}
                      value='oldStudent'
                      color='primary'
                    />
                  }
                  label='Applicable To Old Student'
                />
              </Grid>
              <Grid item xs='5'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isNewStudent}
                      onChange={this.newStudentChangeHandler}
                      value='newStudent'
                      color='primary'
                    />
                  }
                  label='Applicable To New Student'
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
                      checked={this.state.isMandatory}
                      onChange={this.mandatoryChangeHandler}
                      value='isMandatory'
                      color='primary'
                    />
                  }
                  label='Is Mandatory'
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
                  label='Delivery Charge'
                />
              </Grid>
              {subjectsChoice}
              {!this.state.isUniform && !this.state.isCommon && !this.state.isDelivery ? (<React.Fragment>
                <Grid item xs='12'>
                  <label style={{ fontWeight: '20' }}>Select Common Kit</label>
                  <Select
                    isMulti
                    placeholder='Select Kit'
                    value={this.state.commonKitArr}
                    options={
                      this.props.kitList.filter(kit => kit.is_common_kit).map(list => ({
                        value: list.id,
                        label: `${list.kit_name} : ${list.kit_description}`,
                        price: list.kit_price,
                        quantity: list.quantity
                      }))
                    }
                    onChange={this.commonKitChangeHandler}
                  />
                </Grid>
              </React.Fragment>
              ) : null}
            </Grid>
            <Grid item xs='12'>
              <label style={{ fontWeight: '20' }}>Select Kit Items</label>
              <Select
                isMulti
                placeholder='Select Kit Items'
                value={this.state.itemArr}
                options={
                  this.props.itemsList.map(list => ({ value: list.id, label: `${list.item_name} : ${list.item_description}`, price: list.final_price_after_gst })
                  )}
                onChange={this.itemChangeHandler}
              />
            </Grid>
            {itemQuantityField}
            <Grid item xs='12'>
              <Button
                variant='contained'
                color='primary'
                onClick={this.saveKitDetails}
                className={classes.button}
              >Save</Button>
            </Grid>
          </Grid>
        </Modal>
      )
    }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='8'>
            <label className='student-addStudent-segment1-heading' />
          </Grid>
          <Grid item xs='4'>
            {this.state.showAdd ? (<Button variant='contained' color='primary' onClick={this.showEntryModal} disabled={!this.state.currentSession || !this.state.currentBranch || !this.state.currentGrade}>
                Create New Kit
            </Button>) : null}
          </Grid>
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
        {addColorModal}
        {/* {itemTable}  Rajneesh */}
        <React.Fragment>
        <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sl No</TableCell>
                      <TableCell> Kit Name</TableCell>
                      <TableCell> Kit  Description</TableCell>
                      <TableCell> Kit Prize</TableCell>
                      <TableCell>Uniform Kit</TableCell>
                      <TableCell>For New Student</TableCell>
                      <TableCell>For Old Student</TableCell>
                      <TableCell>Items Count</TableCell>
                      <TableCell>View Details</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.kitList && this.props.kitList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((item, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{ item.kit_name ? item.kit_name : ''}</TableCell>
                      <TableCell> {item.kit_description ? item.kit_description : ''}</TableCell>
                      <TableCell> {item.kit_price ? item.kit_price : '' }</TableCell>
                      <TableCell>{item.is_uniform_kit ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{item.is_applicable_to_new_student ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{item.is_applicable_to_old_student ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{item.item && item.item.length}</TableCell>
                      <TableCell>{ <Button
          variant='contained'
          color='primary'
          onClick={() => this.viewDetailsModalHandler(item.id)}
        >View Details</Button>}</TableCell>
        <TableCell><DeleteForever onClick={() => { this.deleteModalShowHandler(item.id) }} /></TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.kitList && this.props.kitList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
        </React.Fragment>
        {deleteModal}
        {viewdetModal}
        {this.props.dataLoading || this.props.gradeLoader ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  grades: state.finance.common.gradesPerBranch,
  gradeLoader: state.gradeMap.loading,
  colorsList: state.inventory.storeAdmin.kit.colorsList,
  itemsList: state.inventory.storeAdmin.kit.itemsListKitWise,
  kitList: state.inventory.storeAdmin.kit.kitList,
  session: state.academicSession.items,
  subject: state.subjects.items
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchItems: (session, branch, grade, alert, user) => dispatch(actionTypes.listGradeKit({ session, branch, grade, alert, user })),
  createColor: (color, alert, user) => dispatch(actionTypes.createColorKit({ color, alert, user })),
  listColorItems: (session, branch, grade, isUniform = true, isDelivery, alert, user) => dispatch(actionTypes.listColorItems({ session, branch, grade, isUniform, isDelivery, alert, user })),
  createKit: (payload) => dispatch(actionTypes.createGradeKit(payload)),
  updateKits: (payload) => dispatch(actionTypes.updateKits(payload)),
  deleteKit: (id, user, alert) => dispatch(actionTypes.deleteGradeKit({ id, user, alert })),
  fetchGrades: (session, branch, user, alert) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, user, alert })),
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Kit))
