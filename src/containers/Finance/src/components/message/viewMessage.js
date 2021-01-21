import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

// import { Document, Page } from 'react-pdf'
import { urls } from '../../urls'

class viewMessage extends React.Component {
  constructor () {
    super()
    this.state = {
      numPages: null,
      pageNumber: 1
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  componentDidMount () {
    var url
    if (this.role === 'Admin') {
      url = urls.Message
    } else if (this.role === 'Principal') {
      url = urls.Message + '?acad_branch=' + this.userProfile.academic_profile.branch_id
    } else if (this.role === 'Student') {
      url = urls.Message + '?student_erp=' + this.userProfile.erp
    } else if (this.role === 'Teacher') {
      url = urls.Message + '?acad_branch=' + this.userProfile.academic_profile[0].branch_id
    }
    axios
      .get(url, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ media: res.data })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document
    this.setState({
      numPages,
      pageNumber: 1
    })
  }

  handleDelete (id) {
    axios
      .delete(urls.Message + '?msg_id=' + id, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Message deleted')
          let data = this.state.media
          let index = data.findIndex(data => data.id === id)
          data.splice(index, 1)
          this.setState({ media: data })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  render () {
    let { media } = this.state
    window.Pace && window.Pace.restart()
    // const { pageNumber } = this.state
    return (
      <React.Fragment>
        {media && media.map((data, index) => {
          return ([
            <React.Fragment>
              <div style={{ padding: '20px' }}>
                <h3>{index + 1}. {data.title}</h3>
                <h4>{data.message}</h4>
                {this.role === 'Student' ? ''
                  : <div>
                    {/* <Button onClick={e => {
                      e.stopPropagation()
                      this.props.history.push('/message/edit/' + data.id)
                    }}>
                      Edit Message
                    </Button> */}
                    <Button onClick={e => this.handleDelete(data.id)}>
                      Delete Message
                    </Button></div>
                }
              </div>
            </React.Fragment>,
            data.msg_media.map((pdf, count) => {
              return (
                <React.Fragment>
                  <div style={{ padding: '20px' }}>
                    <h4>{(index + 1) + '.' + (count + 1)}. {pdf.file_name}</h4>
                    <a href={urls.BASE + pdf.msg_media_file} target='_blanck'>
                      {/* {pdf.file_name.includes('pdf')
                        ? <Document
                          file={urls.BASE + pdf.msg_media_file}
                          onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                        : pdf.file_name.includes('png', 'jpg', 'jpeg', 'img') &&
                          <img
                            src={urls.BASE + pdf.msg_media_file}
                            width='60%'
                            height='40%'
                          />
                      } */}
                    </a>
                  </div>
                  <Divider />
                </React.Fragment>
              )
            })
          ])
        })}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(viewMessage))
