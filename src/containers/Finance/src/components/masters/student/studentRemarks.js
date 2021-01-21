import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import { withStyles, CardActions } from '@material-ui/core'
import red from '@material-ui/core/colors/red'
import { urls } from '../../../urls'
import './remark.css'
import { InternalPageStatus } from '../../../ui'

const styles = theme => ({
  card: {
    maxWidth: 400,
    margin: 16
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
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
  },
  avatar: {
    backgroundColor: red[500]
  }
})
class StudentRemarks extends Component {
  constructor () {
    super()
    this.state = {
      currentPage: 1,
      remarksData: [],
      pageSize: 5,
      loading: true

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    this.getRemarksData()
  }
  getRemarksData (state, pageSize) {
    let url = urls.GetStudentDiscipline
    pageSize = pageSize || this.state.pageSize
    axios
      .get(url, {
        params: {
          student_id: this.props.match.params.id,
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize

        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ remarksData: res.data.student_discipline_data, loading: false })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  scrollHandle = (event, state, pageSize) => {
    let { currentPage } = this.state
    pageSize = pageSize || this.state.pageSize
    let { target } = event

    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      // axios.get(`${urls.Circular}?page_number=${currentPage + 1}&role=${this.role}`, {
      if (this.role === 'Admin' || this.role === 'Teacher') {
        axios.get(`${urls.GetStudentDiscipline}?page_number=${currentPage + 1}&page_size=${pageSize}&student_id=${this.props.match.params.id}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.student_discipline_data.length) {
            this.setState({ currentPage: this.state.currentPage + 1,
              remarksData: [...this.state.remarksData, ...res.data.student_discipline_data] })
          }
        })
      } else if (this.role === 'Student') {
        axios.get(`${urls.GetStudentDiscipline}?page_number=${currentPage + 1}&page_size=${pageSize}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.student_discipline_data.length) {
            this.setState({ currentPage: this.state.currentPage + 1,
              remarksData: [...this.state.remarksData, ...res.data.student_discipline_data] })
          }
        })
      }
    }
  }
  handleDelete = (id) => {
    var updatedList = urls.DeleteRemarks + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        this.props.alert.success('Deleted Remarks Successfully')
        this.getRemarksData()
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.DeleteRemarks, error)
      })
  }
  render () {
    console.log(this.state.remarksData, 'remarks')
    const { classes } = this.props
    const { remarksData } = this.state
    const remarkList = remarksData.map(remarks => {

    })
    return (
      <React.Fragment>
        {(this.role === 'Admin' || this.role === 'Student' || this.role === 'Teacher' || this.role === 'CFO')
          ? <div className='remark-container'onScroll={this.scrollHandle}>
            <div>
              {remarkList}
            </div>
            {remarksData && remarksData.length <= 0
              ? <InternalPageStatus label={'No Remarks available'} loader={false} /> : <Grid container>
                {remarksData && remarksData.length > 0 && remarksData.map(remarks => <Grid item><Card className={classes.card}key={remarks.id} >
                  <CardHeader
                    action={
                      <React.Fragment>
                        {moment(remarks.added_time).format('MMMM Do YYYY, h:mm:ss a')} <br />

                      </React.Fragment>
                    }
                    avatar={
                      <Avatar aria-label='Recipe'
                        style={{ 'backgroundColor': remarks.color }}
                      />
                    }
                  />

                  <CardContent>
                    <Typography component='p'>
                      {remarks.remarks}
                    </Typography>
                    <br />
                    <Typography paragraph>Updated by: {remarks.added_by.first_name},{remarks.added_by.username}
                    </Typography>
                    <Typography className='card-text' variant='body1'>
                      <React.Fragment>
                        {this.role === 'Admin' || this.role === 'Teacher'
                          ? <React.Fragment>
                            <IconButton
                              aria-label='Delete'
                              onClick={e => this.handleDelete(remarks.id)}>
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                    DELETE
                          </React.Fragment> : ''}
                      </React.Fragment>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <React.Fragment>

                    </React.Fragment>
                  </CardActions>
                </Card></Grid>)}
              </Grid> }
          </div>
          : ''
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(StudentRemarks)))
