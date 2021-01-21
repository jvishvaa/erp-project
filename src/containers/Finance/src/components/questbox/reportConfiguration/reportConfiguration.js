import React, { Component } from 'react'
import { Button, Box, Radio, Modal,
  IconButton
} from '@material-ui/core'
// import AddIcon from '@material-ui/icons/AddCircle'
import { AddCircle, RemoveCircle } from '@material-ui/icons'
import axios from 'axios'
import { urls } from '../../../urls'
import ReportConfigurationHeader from './reportConfigurationHeader.js'
import './reportConfiguration.css'
import { InternalPageStatus } from '../../../ui'

class ReportConfiguration extends Component {
  constructor () {
    super()
    this.state = {
      open: false,
      questionEndRange: null,
      marksStartRange: 1,
      marksEndRange: 100,
      isAddRangeDisabled: true,
      isAddSegmentDisabled: true,
      selectedIndex: null,
      currentPage: 0,
      pageSize: 10,
      assessmentRangesList: [],
      newRange: [
        {
          'range_name': '',
          'start_point': 1,
          'end_point': '',
          'remarks_segment': [{
            'min_marks': 0
          }]
        }
      ],
      showLoader: true
    }
  }

  componentDidMount () {
    this.getExistingRanges()
    this.setState({ questionEndRange: this.props.questionsCount })
  }

  handleNewQuestionRange = (e) => {
    this.setState({ open: true,
      newRange: [
        {
          'range_name': '',
          'start_point': 1,
          'end_point': '',
          'remarks_segment': [{
            'min_marks': 0
          }]
        }
      ] })
  }

  handleRadioButtonChange = (event, index) => {
    this.setState({ selectedIndex: index }, () => {
      this.props.getConfigurations(this.state.assessmentRangesList[index])
    })
  }

  renderRadioButton = (index) => {
    return <Radio
      checked={index === this.state.selectedIndex}
      onChange={(event) => {
        this.handleRadioButtonChange(event, index)
      }}
      value={''}
      name='radio-button-demo'
    />
  }

  handleChange = (value, isSegment, propertyName, rangeIndex, segmentIndex) => {
    console.log(isSegment)
    const { newRange } = this.state
    let newRangeCopy = newRange
    if (!isSegment) {
      newRangeCopy[rangeIndex][propertyName] = value
    } else {
      newRangeCopy[rangeIndex].remarks_segment[segmentIndex][propertyName] = value
    }
    this.setState({ newRange: newRangeCopy })
  }

  renderTextBox = (value, placeholder, isSegment, propertyName, rangeIndex, segmentIndex, width) => {
    return (
      <input
        type='text'
        value={value}
        placeholder={placeholder}
        style={{ width: propertyName !== 'segment_grade' ? 120 : 80,
          height: 30,
          borderRadius: 3,
          paddingLeft: 5 }}
        onChange={(event) => {
          this.handleChange(event.target.value, isSegment, propertyName, rangeIndex, segmentIndex)
        }}
      />
    )
  };

  checkRange = (value, min, max, isSegment) => {
    if (!value || (value === String(max))) {
      isSegment ? this.setState({ isAddSegmentDisabled: true }) : this.setState({ isAddRangeDisabled: true })
      return true
    } else if (!value || (value < max)) {
      isSegment ? this.setState({ isAddSegmentDisabled: false }) : this.setState({ isAddRangeDisabled: false })
      return true
    }
  }

  validate = (value, property, rangeIndex, segmentIndex) => {
    const { questionEndRange, marksStartRange, marksEndRange, newRange } = this.state
    if (property === 'start_point') {
      return false
    } else if (property === 'end_point') {
      let copy = this.state.newRange
      let isValid = this.checkRange(value, newRange[rangeIndex].start_point, questionEndRange)
      if (isValid) {
        copy[rangeIndex][property] = value
        this.setState({ newRange: copy })
      }
    } else if (property === 'min_marks') {
      return false
    } else if (property === 'max_marks') {
      let copy = this.state.newRange
      let isValid = this.checkRange(value, marksStartRange, marksEndRange, true)
      if (isValid) {
        copy[rangeIndex]['remarks_segment'][segmentIndex][property] = value
        this.setState({ newRange: copy })
      }
    }
  }

  renderNumericField = (value, placeholder, isSegment, propertyName, rangeIndex, segmentIndex) => {
    return (<input
      type='number'
      value={value}
      placeholder={placeholder}
      style={{ width: 80, height: 30, borderRadius: 3, paddingLeft: 5 }}
      onChange={(event) => {
        let { value } = event.target
        isSegment
          ? this.validate(value, propertyName, rangeIndex, segmentIndex)
          : this.validate(value, propertyName, rangeIndex)
      }}
    />)
  }

  getExistingRanges = () => {
    const { currentPage, pageSize, assessmentRangesList } = this.state
    let path = `${urls.QuestionRange}?subject_id=${this.props.subjectId}&page_number=${currentPage + 1}&page_size=${pageSize}`
    axios.get(path, {
      header: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.setState({ assessmentRangesList: [...assessmentRangesList, ...res.data.assessment_range_data], showLoader: false })
      })
      .catch(res => {
        console.log('something went wrong')
        this.setState({ showLoader: false })
      })
  }

  handleScroll = (event) => {
    const { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      this.getExistingRanges()
    }
  }

  render () {
    const { assessmentRangesList, open, newRange } = this.state
    return (
      <React.Fragment>
        <Button
          variant='contained'
          color='primary'
          style={{ marginLeft: 30, marginBottom: 20 }}
          onClick={this.handleNewQuestionRange}
        >
            Add New Configuration
        </Button>
        <div
          onScroll={this.handleScroll}
          className='ranges_parent'
        >
          {
            this.state.showLoader
              ? (<InternalPageStatus label={`Loading Configurations...`} />)
              : ''
          }
          {assessmentRangesList.map((question, index) => {
            return (
              <React.Fragment>
                <Box
                  boxShadow={3}
                  className='report__configuration__container'>
                  <span style={{ position: 'absolute', left: '-40px' }}>{this.renderRadioButton(index)}</span>
                  <ReportConfigurationHeader />
                  {
                    question.map((range, index, array) => {
                      return (
                        <React.Fragment>
                          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px auto' }}>
                            <span style={{ width: '20%' }}>{range.start_point} - {range.end_point}</span>
                            <span style={{ width: '20%' }}>{range.range_name}</span>
                            <span style={{ width: '60%' }}>
                              {range.remarks_segment.map(mark => {
                                return (
                                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <span style={{ width: '33%' }}>
                                      {mark.min_marks} - {mark.max_marks}
                                    </span>
                                    <span style={{ width: '33%' }}>
                                      {mark.segment_grade}
                                    </span>
                                    <span style={{ width: '33%' }}>
                                      {mark.remarks}
                                    </span>
                                  </div>
                                )
                              })}
                            </span>
                          </div>
                          {
                            index < array.length - 1
                              ? (<hr />)
                              : ''
                          }
                        </React.Fragment>
                      )
                    })
                  }
                </Box>
              </React.Fragment>
            )
          })}
        </div>
        <Modal
          open={open}
          onClose={() => {
            this.setState({ open: false })
          }}
        >
          <div
            className='new__configuration__container'
          >
            <ReportConfigurationHeader />
            {
              newRange.map((range, rangeIndex) => {
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20 }}
                    key={rangeIndex}>
                    <span style={{ width: '20%' }}>
                      {this.renderNumericField(range.start_point, 'from', false, 'start_point', rangeIndex, null, 2)} -{' '}
                      {this.renderNumericField(range.end_point, 'to', false, 'end_point', rangeIndex, null, 2)}
                    </span>
                    <span style={{ width: '20%' }}>{this.renderTextBox(range.range_name, 'Question name', false, 'range_name', rangeIndex)}</span>
                    <span style={{ width: '60%' }}>
                      {
                        range.remarks_segment.map((segment, index, array) => {
                          return (
                            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-around', position: 'relative' }}>
                              <span>
                                {this.renderNumericField(segment.min_marks, 'from', true, 'min_marks', rangeIndex, index)} -{' '}
                                {this.renderNumericField(segment.max_marks, 'to', true, 'max_marks', rangeIndex, index)}
                              </span>
                              <span>
                                {this.renderTextBox(segment.segment_grade, 'Grade', true, 'segment_grade', rangeIndex, index)}
                              </span>
                              <span>
                                {this.renderTextBox(segment.remarks, 'Remarks', true, 'remarks', rangeIndex, index)}
                              </span>
                              {
                                index === array.length - 1
                                  ? (
                                    <React.Fragment>
                                      <IconButton
                                        disabled={segment.max_marks >= 100}
                                        style={{ position: 'absolute', right: 20, top: -10 }}
                                        onClick={() => {
                                          const { newRange } = this.state
                                          let newRangeCopy = newRange
                                          newRangeCopy[rangeIndex].remarks_segment.push({
                                            'min_marks': Number(newRangeCopy[rangeIndex].remarks_segment[index].max_marks) + 1
                                          })
                                          this.setState({ newRange: newRangeCopy })
                                        }} aria-label='Add Row' color='primary'>
                                        <AddCircle />
                                      </IconButton>
                                      {
                                        index !== 0
                                          ? <IconButton
                                            onClick={() => {
                                              const { newRange } = this.state
                                              let newRangeCopy = newRange
                                              newRangeCopy[rangeIndex].remarks_segment.pop()
                                              this.setState({ newRange: newRangeCopy })
                                            }}
                                            style={{ position: 'absolute', right: -10, top: -10 }}
                                          >
                                            <RemoveCircle />
                                          </IconButton>
                                          : ''
                                      }
                                    </React.Fragment>
                                  )
                                  : ''
                              }

                            </div>)
                        })
                      }
                    </span>
                  </div>
                )
              })
            }
            <div style={{ position: 'absolute', bottom: 10 }}>
              <Button
                disabled={this.state.isAddRangeDisabled}
                variant='contained'
                onClick={() => {
                  this.setState({ newRange: [...newRange, {
                    'range_name': '',
                    'start_point': Number(newRange[newRange.length - 1].end_point) + 1,
                    'end_point': '',
                    'remarks_segment': [{
                      'min_marks': 0
                    }]
                  }] })
                }}>
                Add Range
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                variant='contained'
                color='primary'
                onClick={
                  () => {
                    let newList = assessmentRangesList
                    newList.unshift(newRange)
                    this.setState({ assessmentRangesList: [...newList], open: false, selectedIndex: 0 }, () => {
                      this.props.getConfigurations()
                      this.props.getConfigurations(this.state.assessmentRangesList[0])
                    })
                  }
                }>
                Finish
              </Button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default ReportConfiguration
