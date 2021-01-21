import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Card from '@material-ui/core/Card'
import ReactTable from 'react-table'
import './css/staff.css'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5]

  }
}))

export default function UploadAssessmentModal (props) {
  const classes = useStyles()

  let { openmodal, toggle, resultData } = props

  function getrowValue (value) {
    if (Array.isArray(value)) {
      let data = value.map(e => e).join(', ')
      return data
    } else {
      return value
    }
  }

  function rendermessage (props) {
    if (!Array.isArray(props.original.row)) {
      return (
        <div className='assessment_reacttable'>
          <span >{getrowValue(props.original.row)}</span>
          <span style={{ paddingLeft: '10px' }}>{props.original.message}</span>
        </div>)
    } else {
      return (
        <div className='assessment_reacttable'>
          <span >{props.original.message}</span>
          <span style={{ paddingLeft: '10px' }}>{getrowValue(props.original.row)}</span>
        </div>)
    }
  }

  return (
    <div>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={openmodal}
        onClose={toggle}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Card style={{
          position: 'fixed',
          top: '5%',
          left: '10%',
          width: '80vw'

        }}
        >
          <div className={classes.paper}>
            {resultData && resultData.length > 0 && <ReactTable
              data={resultData}
              style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold', height: '500px', overflow: 'auto' }}
              columns={[
                {
                  Header: () => <span >Sr No.</span>,

                  accessor: 'id',
                  Cell: (row) => {
                    return <div>{row.index + 1}</div>
                  },
                  maxWidth: 80

                },
                {
                  Header: () => <span >File Name</span>,
                  accessor: 'file_name',
                  maxWidth: 200

                },
                {
                  Header: () => <span >Header Name</span>,
                  accessor: 'Header',
                  Cell: props => <span>{getrowValue(props.original.Header)}</span>,
                  maxWidth: 200

                },

                {
                  Header: () => <span >Error Message</span>,
                  accessor: 'message',
                  Cell: props =>
                    <React.Fragment>
                      {rendermessage(props)}
                    </React.Fragment>
                }

              ]}

              className='-striped -highlight'
              showPagination={resultData.length > 20}
              getTheadThProps={() => {
                return {
                  style: {
                    background: 'rgba(5, 87, 97, 0.61)',
                    position: 'sticky',
                    zIndex: 99
                  }
                }
              }}
              getTrProps={(state, rowInfo, instance) => {
                return {
                  style: {
                    background: 'rgba(63, 181, 117, 0.2)',
                    color: 'black'
                  }
                }
              }
              }
            />}
            <br />

          </div>
        </Card>
      </Modal>
    </div>
  )
}
