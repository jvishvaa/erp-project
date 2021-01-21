import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { Grid, Button } from '@material-ui/core'
import CreatableSelect from 'react-select/lib/Creatable'
import Dialog from '@material-ui/core/Dialog'
import Select from 'react-select'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DialogContent from '@material-ui/core/DialogContent'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import ReactTable from 'react-table'
import DialogTitle from '@material-ui/core/DialogTitle'
import { urls } from '../../../urls'

class AssessmentTypesAndCategory extends Component {
  constructor () {
    super()
    // this.props = props
    this.state = {
      assignDetails: [],
      pageSize: 5,
      mappingDetails: [],
      assessmentCategoryType: [],
      page: 1,
      pageIndex: null,
      assessmentTypeValue: '',
      subTypeValue: '',
      categoryValue: '',
      subCategoryValue: '',
      loading: false

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.SubmitAssessmentConfiguration = this.SubmitAssessmentConfiguration.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
  }
  componentDidMount () {
    this.getMappingDetails()
    this.mappingDetails()
  }
  fetchData = (state, instance) => {
    console.log(state, instance)
    this.setState({ loading: true })
    this.mappingDetails(state)
  }
  toggleloading = () => {
    console.log('toggled', this.state.loading)
    this.setState((state) => ({
      loading: !state.loading
    }))
  }
  mappingDetails = (state, pageSize) => {
    // let { assessmentType } = this.state
    this.toggleloading()
    pageSize = pageSize || this.state.pageSize
    var path = urls.getAssessmentConfiguration
    path += `?page_number=${state && state.page ? state.page + 1 : 1}`
    path += `&page_size=${pageSize}`

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ getMappingDetails: res.data.assessment_type_data,
          pageIndex: 0,
          pages: res.data.total_page_count,
          page: state.page + 1
        }, () => this.toggleloading())
        console.log(res.data, 'data')
      }
    })
      .catch((error) => {
        console.log(error)
      })
  };
    getMappingDetails = (state, pageSize) => {
      // let { assessmentType } = this.state
      this.setState({ mapOpen: true })
      pageSize = pageSize || this.state.pageSize

      var path = urls.assessmentConfiguration
      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      }).then((res) => {
        console.log(res, 'ressss')
        if (res.status === 200) {
          this.setState({ mappingDetails: res.data.assessment_type,
            assessmentType: res.data.assessment_type.map(type => ({
              value: type,
              label: type
            }))
          })
          console.log(res.data, 'data')
        }
      })
        .catch((error) => {
          console.log(error)
        })
    };
    handleClickOpen = (id) => {
      this.setState({ open: true })
      this.getMappingDetails()
    };
    handleClose = () => {
      this.setState({ open: false })
    };

    SubmitAssessmentConfiguration () {
      let { assessmentTypeValue, subTypeValue, categoryValue, subCategoryValue } = this.state
      console.log(this.state.assessmentTypeValue.label, 'this.styate')

      let obj = {
        assessment_type: assessmentTypeValue.label,
        assessment_sub_type: subTypeValue.label,
        assessment_category: categoryValue.label,
        assessment_sub_category: subCategoryValue.label ? subCategoryValue.label : ''

      }

      axios
        .post(urls.ConfigurationAssessment, JSON.stringify(obj), {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (String(res.status).startsWith(String(2))) {
            this.props.alert.success('Assessment Mapping created successfully')
            // this.mappingDetails()
          }
          this.setState({ assessmentTypeValue: '', subTypeValue: '', categoryValue: '', subCategoryValue: '' })
        })
        .catch(error => {
          this.props.alert.error('Assessment Configuration Already Exist')
          this.setState({ assessmentTypeValue: '', subTypeValue: '', categoryValue: '', subCategoryValue: '' })
          console.log(error)
        })
    }

    getAssessmentConfigurations = (option) => {
      let { assessmentTypeValue, subTypeValue, categoryValue, subCategoryValue } = this.state
      let path = ''
      if (option === 'type') {
        path += `assessment_type=${assessmentTypeValue.label}`
      } else if (option === 'subType') {
        path += `assessment_type=${assessmentTypeValue.label}&assessment_sub_type=${subTypeValue.label}`
      } else if (option === 'category') {
        path += `assessment_type=${assessmentTypeValue.label}&assessment_sub_type=${subTypeValue.label}&assessment_category=${categoryValue.label}`
      } else if (option === 'subCategory') {
        path += `assessment_type=${assessmentTypeValue.label}&assessment_sub_type=${subTypeValue.label}&assessment_category=${categoryValue.label}&assessment_sub_category=${subCategoryValue.label}`
      }

      axios.get(`${urls.assessmentConfiguration}?${path}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          // eslint-disable-next-line camelcase
          const { assessment_sub_type = [], assessment_category = [], assessment_sub_category = [] } = res.data
          this.setState({ offlineSubTypes: assessment_sub_type.map(item => {
            return {
              value: item,
              label: item
            }
          }),
          offlineCategories: assessment_category.map(item => {
            return {
              value: item,
              label: item
            }
          }),
          assessmentSubCategories: assessment_sub_category.map(item => {
            return {
              value: item,
              label: item
            }
          }) })
        })
        .catch(err => {
          console.log(err)
        })
    }
    handleAssessmentSubType = ({ value, label, pageSize }) => {
      this.setState({ mapOpen: true })
      pageSize = pageSize || this.state.pageSize

      var path = urls.assessmentConfiguration + '?'
      path += value ? 'assessment_sub_type=' + value + '&' : ''

      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      }).then((res) => {
        console.log(res, 'ressss')
        if (res.status === 200) {
          this.setState({ mappingDetails: res.data.assessment_sub_type,
            assessmentSubType: res.data.assessment_sub_type.map(subType => ({
              value: subType,
              label: subType
            }))
          })
          console.log(res.data, 'data')
        }
      })
        .catch((error) => {
          console.log(error)
        })
    }
    deleteHandler = (id, state, index) => {
      console.log(id)
      axios
        .delete(urls.deleteAssessmentConfigurations + '?id=' + id, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then((res) => {
          this.props.alert.success('Assessment Mapping deleted successfully')
          this.mappingDetails(state)
        })
        .catch((error) => {
          console.log("Error: Couldn't fetch data from " + urls.deleteAssessmentConfigurations, error)
        })
    }
    render () {
      console.log(this.state.assessmentSubType, 'assess')
      // const { assessmentType } = this.state
      return (
        <React.Fragment>
          <ReactTable
            manual
            onFetchData={this.fetchData}
            data={this.state.getMappingDetails}
            defaultPageSize={5}
            pages={this.state.pages}
            pageSize={this.state.pageSize}
            loading={this.state.loading}
            showPageSizeOptions={false}
            page={this.state.page - 1}
            columns={[
              {
                Header: 'Type',
                accessor: 'assessment_type'
              },
              {
                Header: 'Sub Type',
                accessor: 'assessment_sub_type'
              },
              {
                Header: 'Category',
                accessor: 'assessment_category'
              },
              {
                Header: 'Sub Category',
                accessor: 'assessment_sub_category'
              },
              {
                id: 'x',
                Header: 'Actions',
                minWidth: 90,
                accessor: props => {
                  return (
                    <div>

                      <IconButton
                        aria-label='Delete'
                        onClick={(e) => this.deleteHandler(props.id, { page: this.state.page - 1 })}
                        // className={classes.margin}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </div>
                  )
                }
              }

            ]}

          />
          <div>
            <Button variant='outlined' color='primary' onClick={this.handleClickOpen}>
      ADD
            </Button>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby='form-dialog-title'
            >
              <DialogTitle id='form-dialog-title'>Configuration Mappings</DialogTitle>
              <DialogContent>

                <Grid style={{ margin: 16 }} item >
                  <label>Types:</label>
                  <Select
                    label='Type'
                    options={this.state.assessmentType}
                    value={this.state.assessmentTypeValue}

                    onChange={e => {
                      this.setState({
                        assessmentTypeValue: e
                      }, () => this.getAssessmentConfigurations('type', e))
                    }}
                  />

                </Grid>
                <Grid style={{ margin: 16 }} item >
                  <label>Sub Types:</label>
                  <CreatableSelect
                    label='Sub Type'
                    options={this.state.offlineSubTypes}
                    value={this.state.subTypeValue}
                    onChange={e => {
                      this.setState({
                        subTypeValue: e
                      }, () => this.getAssessmentConfigurations('subType', e))
                    }} />

                </Grid>
                <Grid style={{ margin: 16 }} item >
                  <label>Categories:</label>
                  <CreatableSelect
                    label='Category'
                    options={this.state.offlineCategories}
                    value={this.state.categoryValue}
                    onChange={e => {
                      this.setState({
                        categoryValue: e
                      }, () => this.getAssessmentConfigurations('category', e))
                    }} />

                </Grid>
                <Grid style={{ margin: 16 }} item >
                  <label>Sub Categories:</label>
                  <CreatableSelect
                    label='Sub Category'
                    options={this.state.assessmentSubCategories}
                    value={this.state.subCategoryValue}
                    onChange={e => {
                      this.setState({
                        subCategoryValue: e
                      }, () => this.getAssessmentConfigurations('category', e))
                    }} />

                </Grid>

              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color='primary'>
              Cancel
                </Button>
                <Button onClick={this.SubmitAssessmentConfiguration} color='primary'>
              Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>

      )
    }
}
const mapStateToProps = state => ({

  user: state.authentication.user
})
export default connect(
  mapStateToProps
)(withRouter(AssessmentTypesAndCategory))
