import React, { Component } from 'react'
import { withStyles, Grid, Tab, Tabs } from '@material-ui/core'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { OmsSelect } from '../../ui'
import { urls } from '../../urls'

function TabContainer (props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

const StyledTableCell = withStyles(theme => ({
  head: {
    fontSize: 14,
    borderRight: '1px solid #d0cdcd'
  },
  body: {
    fontSize: 14,
    borderRight: '1px solid #d0cdcd'
  }
}))(TableCell)

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}
const styles = theme => ({
  table: {
    minWidth: 650
  },
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper
    backgroundColor: 'white'
  },
  button: {
    // marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

class StudentReportCard extends Component {
  constructor () {
    super()
    this.state = {
      termList: [],
      showButton: false,
      normalType: [],
      studentData: [],
      types: [],
      competitionType: [],
      theatreType: [],
      gameSkillType: [],
      coscholasticType: [],
      value: 0,
      maximumIndex: 0,
      maximumCompetitionIndex: 0,
      showTab: false

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.StudentReport = this.StudentReport.bind(this)
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile
    console.log(academicProfile, this.role)
    if (this.role === 'Student') {
      this.setState({
        studentErp: academicProfile.erp
      }

      )
    }
    this.getTerms()
      .then(result => {
        this.setState({ termList: result.data })
        let termListCopy = [...this.state.termList]
        this.setState({ termList: termListCopy })
      })
      .catch(err => { console.log(err) })
  }
  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }
  handleTermChange = (data, e) => {
    this.setState({ selectedTermId: e.value })
    this.setState({ showSelectors: true, selectedTermId: data.value }, () => {
    })
  }

  handleChange = (event, value) => {
    this.setState({ value })
  };
  StudentReport () {
    let { studentErp } = this.state
    let path = urls.StudentWiseReportCard
    if (!studentErp) return
    let { selectedTermId } = this.state
    path += `?erp=${studentErp}`
    path += selectedTermId ? `&term_id=${selectedTermId}` : ''

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        let normalGradebookCriterias = new Set()
        res.data.Normal.forEach(subject => {
          subject.gradebook_criterias.forEach(criteria => {
            normalGradebookCriterias.add(criteria.gradebook_criteria)
          })
        })
        let competitionGradebookCriterias = new Set()
        res.data.Competition.forEach(subject => {
          subject.gradebook_criterias.forEach(criteria => {
            competitionGradebookCriterias.add(criteria.gradebook_criteria)
          })
        })
        let maximumCompetitionIndex = 0
        let maximumCoscholasticValue = 0
        let maximumCompetitionValue = res.data.Competition.length > 0 ? res.data.Competition[0].gradebook_criterias.length : 0

        for (let i = 0; i < res.data.Competition.length; i++) {
          if (res.data.Competition[i].gradebook_criterias.length > maximumCompetitionValue) {
            maximumCompetitionValue = res.data.Competition[i].gradebook_criterias.length
            maximumCompetitionIndex = i
          }
        }

        for (let i = 0; i < res.data.Coscholastic.length; i++) {
          if (res.data.Coscholastic[i].gradebook_criterias.length > maximumCoscholasticValue) {
            maximumCoscholasticValue = res.data.Coscholastic[i].gradebook_criterias.length
            maximumCompetitionIndex = i
          }
        }
        let gameSkillArr = []
        for (let i in res.data.Gameskill) {
          gameSkillArr = [...gameSkillArr, { key: i, value: res.data.Gameskill[i] }]
        }
        console.log(maximumCompetitionIndex, maximumCompetitionValue)
        this.setState({ studentData: res.data,
          types: Object.keys(res.data).map(item => item),
          normalGradebookCriterias,
          competitionGradebookCriterias,
          maximumCompetitionIndex,
          normalType: res.data.Normal,
          competitionType: res.data.Competition,
          coscholasticType: res.data.Coscholastic,
          gameSkillType: gameSkillArr,
          theatreType: res.data.Theatre,
          loading: false,
          showTab: true })
        console.log(this.state.studentData, 'dataa')
      }
    })
      .catch(e => console.log(e))
  }

  render () {
    console.log(this.state.competitionType)
    let { termList, normalType, competitionType, coscholasticType, gameSkillType, theatreType } = this.state
    const { classes } = this.props
    const { value } = this.state

    // let { studentData } = this.state
    // const classes = useStyles()

    return (
      // <TableContainer component={Paper}>
      <React.Fragment>
        <Grid container>
          <Grid>
            <OmsSelect
              label={'Term'}
              options={termList.map((term) => {
                return { label: term.term, value: term.id }
              })}
              change={this.handleTermChange}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid>
            <Button variant='outlined' color='primary' className={classes.button} onClick={this.StudentReport}>
        Get Report Card
            </Button>
          </Grid>
        </Grid>

        {/* <div className={classes.root}> */}
        <div>
          {/* <AppBar position='static'> */}
          {this.state.showTab && <Tabs value={this.state.value}
            onChange={this.handleChange}
            // indicatorColor='secondary'
            // textColor='secondary'
            variant='fullWidth'
          >
            {/* {types.(row => ( */}
            <Tab key={'Normal'} label={'Normal'} />
            <Tab key={'Competition'} label={'Competition'} />
            <Tab key={'Coscholastic'} label={'Coscholastic'} />

            <Tab key={'Gameskill'} label={'Gameskill'} />
            <Tab key={'Theatre'} label={'Theatre'} />

            {/* ))} */}
          </Tabs>}
          {/* </AppBar> */}
          {value === 0 && <TabContainer>
            <Table className={this.props.classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow >
                  {this.state.showTab && <StyledTableCell align='left'>Gradebook Criteria</StyledTableCell>}
                  {/* <StyledTableCell>Gradebook Criteria</StyledTableCell> */}
                  {normalType.map(row => (
                    <StyledTableCell key={row.subject_name} align='right'>{row.subject_name}</StyledTableCell>
                  ))}
                </TableRow>

              </TableHead>
              <TableBody>
                {normalType.length > 0 && [...this.state.normalGradebookCriterias].map((gradebookCriteria, index) => (
                  <TableRow>
                    <StyledTableCell>
                      {gradebookCriteria}
                    </StyledTableCell>
                    {normalType.map((row, rowIndex) => {
                      let item = row.gradebook_criterias.filter(item => (item.gradebook_criteria === gradebookCriteria))
                      return (
                        <StyledTableCell key={index + 'a' + rowIndex} align='right'>{item.length > 0 ? item[0].secured_score : 'NA'}</StyledTableCell>
                      )
                    })}
                  </TableRow>

                ))
                }
              </TableBody>
            </Table></TabContainer>}
          {value === 1 && <TabContainer>
            <Table className={this.props.classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow >
                  <StyledTableCell align='left'>Gradebook Criteria</StyledTableCell>
                  {/* <StyledTableCell>Gradebook Criteria</StyledTableCell> */}
                  {competitionType.map(row => (
                    <StyledTableCell key={row.subject_name} align='right'>{row.subject_name}</StyledTableCell>
                  ))}
                </TableRow>

              </TableHead>
              <TableBody>
                {competitionType.length > 0 && [...this.state.competitionGradebookCriterias].map((gradebookCriteria, index) => (
                  <TableRow>
                    <StyledTableCell>
                      {gradebookCriteria}
                    </StyledTableCell>
                    {competitionType.map((row, rowIndex) => {
                      let item = row.gradebook_criterias.filter(item => (item.gradebook_criteria === gradebookCriteria))
                      return (
                        <StyledTableCell key={index + 'a' + rowIndex} align='right'>{item.length > 0 ? item[0].secured_score : 'NA'}</StyledTableCell>
                      )
                    })}
                  </TableRow>

                ))
                }
              </TableBody>
            </Table></TabContainer>}
          {value === 2 &&
            <TabContainer>
              <Table className={this.props.classes.table} aria-label='simple table'>
                <TableBody>

                  {Array.isArray(coscholasticType.gradebook_criterias) && coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias.map((row, index) => (
                    <TableRow key={row.gradebook_criteria}>
                      <StyledTableCell component='th' scope='row'>
                        {row.gradebook_criteria}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableHead>
                  <TableRow >
                    <StyledTableCell align='left'>Gradebook Criteria</StyledTableCell>
                    {coscholasticType.map(row => (
                      <StyledTableCell key={row.subject_name} align='right'>{row.subject_name}</StyledTableCell>
                    ))}
                  </TableRow>

                </TableHead>
                <TableBody>
                  {coscholasticType.length > 0 && coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias.map((gradebookCriteria, index) => (
                    <TableRow>
                      <StyledTableCell>
                        {coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria}
                      </StyledTableCell>
                      {coscholasticType.map((row, rowIndex) => {
                        row.gradebook_criterias.filter(item => {
                          if (item.gradebook_criteria === coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria) {
                            console.log(item.gradebook_criteria, coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria, item.secured_score)
                            return true
                          }
                          return false
                        })

                        return (
                          <StyledTableCell key={index + 'a' + rowIndex} align='right'>{row.gradebook_criterias.filter(item => item.gradebook_criteria === coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria)[0] && row.gradebook_criterias.filter(item => item.gradebook_criteria === coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria)[0].secured_score ? row.gradebook_criterias.filter(item => item.gradebook_criteria === coscholasticType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria)[0].secured_score : 'NA'}</StyledTableCell>
                        )
                      })}
                    </TableRow>

                  ))
                  }
                </TableBody>
              </Table></TabContainer>}
          {value === 3 &&
          <TabContainer>
            <Table className={this.props.classes.table} aria-label='simple table'>

              <TableHead>
                {gameSkillType.map(item => {
                  return (
                    <TableRow >
                      <StyledTableCell
                        key={item.key}
                        align='left'
                      >
                        {item.key}
                      </StyledTableCell>
                      <StyledTableCell
                        key={item.value}
                        align='left'
                      >
                        {item.value}
                      </StyledTableCell>
                    </TableRow>
                  )
                })}

              </TableHead>

            </Table></TabContainer>}
          {value === 4 &&
            <TabContainer>
              <Table className={this.props.classes.table} aria-label='simple table'>
                <TableBody>

                  {Array.isArray(theatreType.gradebook_criterias) && theatreType[this.state.maximumCompetitionIndex].gradebook_criterias.map((row, index) => (
                    <TableRow key={row.gradebook_criteria}>
                      <StyledTableCell component='th' scope='row'>
                        {row.gradebook_criteria}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableHead>
                  <TableRow >
                    <StyledTableCell align='left'>Gradebook Criteria</StyledTableCell>
                    {theatreType.map(row => (
                      <StyledTableCell key={row.subject_name} align='right'>{row.subject_name}</StyledTableCell>
                    ))}
                  </TableRow>

                </TableHead>
                <TableBody>
                  {theatreType.length > 0 && theatreType[this.state.maximumCompetitionIndex].gradebook_criterias.map((gradebookCriteria, index) => (
                    <TableRow>
                      <StyledTableCell>
                        {theatreType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria}
                      </StyledTableCell>
                      {theatreType.map((row, rowIndex) => {
                        row.gradebook_criterias.filter(item => {
                          if (item.gradebook_criteria === theatreType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria) {
                            console.log(item.gradebook_criteria, theatreType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria, item.secured_score)
                            return true
                          }
                          return false
                        })

                        return (
                          <StyledTableCell key={index + 'a' + rowIndex} align='right'>{row.gradebook_criterias.filter(item => item.gradebook_criteria === theatreType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria)[0] && row.gradebook_criterias.filter(item => item.gradebook_criteria === theatreType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria)[0].secured_score ? row.gradebook_criterias.filter(item => item.gradebook_criteria === theatreType[this.state.maximumCompetitionIndex].gradebook_criterias[index].gradebook_criteria)[0].secured_score : 'NA'}</StyledTableCell>
                        )
                      })}
                    </TableRow>

                  ))
                  }
                </TableBody>
              </Table></TabContainer>}
        </div>

      </React.Fragment>

    )
  }
}
StudentReportCard.propTypes = {
  classes: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
  user: state.authentication.user

})
export default connect(mapStateToProps,
  null
)(withRouter(withStyles(styles)(StudentReportCard)))
