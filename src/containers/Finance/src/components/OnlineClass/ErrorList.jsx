import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Modal, FormControlLabel, Checkbox, Button } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import Card from '@material-ui/core/Card'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import ReactTable from 'react-table'
import '../css/staff.css'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: '30px 10px 0px 10px'
  }
}))

export default function ErrorList (props) {
  const classes = useStyles()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (props.count) {
      setChecked(false)
    }
  }, [props.count])

  let { openmodal, toggle, resultData } = props

  function getrowValue (value) {
    if (Array.isArray(value)) {
      let data = value.map(e => {
        if (!Array.isArray(e) && typeof e === 'object') {
          return `${e.username} - ${e.value}`
        } else {
          return e
        }
      }).join(', ')
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

  const handleCheck = (event) => {
    const { checked } = event.target
    setChecked(checked)
  }

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={openmodal}
        onClose={() => {
          setChecked(false)
          toggle()
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Card style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%'
        }}
        >
          <div className={classes.paper} style={{ position: 'relative' }}>
            <HighlightOffIcon style={{ position: 'absolute', right: 20, top: 2 }} className='clear__files' onClick={() => {
              setChecked(false)
              toggle()
            }} />
            {resultData && resultData.length > 0 && <ReactTable
              data={resultData}
              style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold', height: '500px', overflow: 'auto' }}
              columns={[
                {
                  Header: () => <span style={{ color: 'white' }}>Sr No.</span>,

                  accessor: 'id',
                  Cell: (row) => {
                    return <div>{row.index + 1}</div>
                  },
                  maxWidth: 80

                },
                {
                  Header: () => <span style={{ color: 'white' }}>File Name</span>,
                  accessor: 'file_name',
                  maxWidth: 200

                },
                {
                  Header: () => <span style={{ color: 'white' }}>Header Name</span>,
                  accessor: 'Header',
                  Cell: props => <span>{getrowValue(props.original.Header)}</span>,
                  maxWidth: 200

                },

                {
                  Header: () => <span style={{ color: 'white' }}>Error Message</span>,
                  accessor: 'message',
                  style: { 'whiteSpace': 'unset', height: 'auto' },
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
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleCheck} name='checkedA' />}
              label='Ignore Errors and Proceed to Upload'
            />
            <Button variant='contained' color='primary' style={{ marginBottom: 10 }} disabled={!checked || props.isUploading} onClick={props.uploadIgnoringErrors}>
              {props.isUploading ? 'Uploading Please wait...' : 'Upload'}
            </Button>
          </div>
        </Card>
      </Modal>
    </div>
  )
}
