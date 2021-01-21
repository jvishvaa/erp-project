import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CardHeader from '@material-ui/core/CardHeader'
import CloseButton from '@material-ui/icons/Close'
import { CardContent } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Info } from '@material-ui/icons'
import Card from '@material-ui/core/Card'
import Modal from '@material-ui/core/Modal'
// import Button from '@material-ui/core/Button'

import { apiActions } from '../../_actions'
import './styles.css'

function createData (name, column1) {
  return { name, column1 }
}

class DisplayModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false

    }
  }

    handleOpen = () => {
      this.setState({ open: true })
    }

    handleClose = () => {
      this.setState({ open: false })
    }

    render () {
      console.log(this.props)
      let { file, grades = [], subjects = [] } = this.props

      let { chapter, grade, subject } = file
      let gradeObj = grades.filter(item => {
        return (item.id === grade)
      })[0]
      let subjectObj = subjects.filter(item => {
        console.log(item.id, subject)
        return (item.id === subject)
      })[0]
      console.log(subjectObj, subject)

      console.log(this.props)
      console.log(subjectObj)
      console.log(gradeObj)

      console.log(file, { chapter, grade })

      const rows = [

        createData('extension', file.extension),
        createData('grade', gradeObj && gradeObj.grade),
        createData('subject', subjectObj && subjectObj.subject_name)
      ]

      return (

        <span className='displayModal'>
          <IconButton color='secondary'IconButton style={{ right: '30px', bottom: '10px' }} aria-label='Add an alarm' onClick={(e) => {
            e.stopPropagation()
            this.handleOpen()
          }}>
            <Info size='small' />
          </IconButton>
          <Modal
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
            open={this.state.open}
            onClose={this.handleClose}
          >
            <Card style={{
              position: 'fixed',
              top: '10%',
              left: '25%',
              width: '50vw',
              height: 'auto',
              overflow: 'visible'
            }} >
              <Typography style={{ wordBreak: 'break-word' }}>
                <CardHeader
                  action={
                    <IconButton>
                      <CloseButton onClick={this.handleClose} />
                    </IconButton>
                  }
                  title={(file.files.split('/'))[file.files.split('/').length - 1]}
                />
              </Typography>
              <CardContent style={{ padding: 16 }}>
                {rows.map(row => (

                  <div component='th' scope='row' style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span>{row.name}</span>
                    <span>{row.column1}</span>
                  </div>

                ))}

              </CardContent>
            </Card>
          </Modal>
        </span>
      )
    }
}

const mapStateToProps = state => {
  // eslint-disable-next-line no-debugger

  return {
    user: state.authentication.user,
    grades: state.grades.items,
    subjects: state.subjects.items
  }
}
const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  listSubjects: gradeId => dispatch(apiActions.listSubjects(gradeId)),
  loadGrades: () => dispatch(apiActions.listGrades())

})
export default connect(
  mapStateToProps, mapDispatchToProps)(DisplayModal)

// We need an intermediary variable for handling the recursive nesting.
