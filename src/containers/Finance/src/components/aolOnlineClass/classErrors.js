import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Modal, FormControlLabel, Checkbox, Button, Typography } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import Card from '@material-ui/core/Card'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import ReactTable from 'react-table'
import { InternalPageStatus } from '../../ui'

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

export default function ExcelError (props) {
  console.log(props)
  const classes = useStyles()
  const [ignore, setIgnore] = useState(false)
  const [loading] = useState(false)
  const [fileName, setFileName] = useState('')

  let { open, toggle, errorList, firstValidationErrors, ignoreErrorCase, loadingStatus, notCreatedClass } = props
  useEffect(() => {
    let file
    if (firstValidationErrors && firstValidationErrors[0] && firstValidationErrors[0].file_name !== undefined) {
      file = firstValidationErrors[0].file_name
    }

    setFileName(file)
  }, [firstValidationErrors])
  const notCreatedClassColumn = [
    {
      Header: () => <span style={{ color: 'white' }}>Sr No.</span>,

      accessor: 'id',
      Cell: (row) => {
        return <div>{row.index + 1}</div>
      },
      maxWidth: 80

    },

    {
      Header: () => <span style={{ color: 'white' }}>Date</span>,
      accessor: 'date',
      maxWidth: 100

    },
    {
      Header: () => <span style={{ color: 'white' }}>Duration</span>,
      accessor: 'duration',
      maxWidth: 100

    },
    {
      Header: () => <span style={{ color: 'white' }}>End Time</span>,
      accessor: 'end_time',
      maxWidth: 100

    },
    {
      Header: () => <span style={{ color: 'white' }}>Group Name</span>,
      accessor: 'group name'

    }, {
      Header: () => <span style={{ color: 'white' }}>Join Limit</span>,
      accessor: 'join limit'

    }, {
      Header: () => <span style={{ color: 'white' }}>Remark</span>,
      accessor: 'remark'

    }, {
      Header: () => <span style={{ color: 'white' }}>Start Time</span>,
      accessor: 'start time'

    }, {
      Header: () => <span style={{ color: 'white' }}>Start time</span>,
      accessor: 'start_time'

    }, {
      Header: () => <span style={{ color: 'white' }}>Subject Name</span>,
      accessor: 'subject name'

    }, {
      Header: () => <span style={{ color: 'white' }}>Title</span>,
      accessor: 'title'

    }, {
      Header: () => <span style={{ color: 'white' }}>Tutor Email</span>,
      accessor: 'tutor_email'

    }

  ]
  const columns = [
    {
      Header: () => <span style={{ color: 'white' }}>Sr No.</span>,

      accessor: 'id',
      Cell: (row) => {
        return <div>{row.index + 1}</div>
      },
      maxWidth: 80

    },
    {
      Header: () => <span style={{ color: 'white' }}>Title</span>,
      accessor: 'title',
      maxWidth: 100

    },

    {
      Header: () => <span style={{ color: 'white' }}>Subject Name</span>,
      accessor: 'subject name',
      style: { 'whiteSpace': 'unset', height: 'auto' },
      maxWidth: 100

    },

    {
      Header: () => <span style={{ color: 'white' }}>Date</span>,
      accessor: 'date',
      style: { 'whiteSpace': 'unset', height: 'auto' },
      maxWidth: 100

    },
    {
      Header: () => <span style={{ color: 'white' }}>Start Time</span>,
      accessor: 'start time',
      style: { 'whiteSpace': 'unset', height: 'auto' },
      maxWidth: 100

    },
    {
      Header: () => <span style={{ color: 'white' }}>End Time</span>,
      accessor: 'end_time',
      style: { 'whiteSpace': 'unset', height: 'auto' },
      maxWidth: 100

    },
    {
      Header: () => <span style={{ color: 'white' }}>Remark</span>,
      accessor: 'remark',
      style: { 'whiteSpace': 'unset', height: 'auto' }

    }

  ]

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={() => {
          setIgnore(false)
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
          <div className={classes.paper} style={{ position: 'relative', overflow: 'scroll', 'max-height': '90vh' }}>
            <HighlightOffIcon style={{ position: 'absolute', right: 20, top: 2 }} className='clear__files' onClick={() => {
              setIgnore(false)
              toggle()
            }} />
            {
              firstValidationErrors && firstValidationErrors.length > 0
                ? <Typography style={{ 'text-transform': 'capitalize', background: 'rgba(0, 140, 255, 0.59)', 'box-shadow': '2px 2px 2px 2px', 'font-size': 'large', 'text-align': 'center' }}>FileName :  {fileName}</Typography>
                : ''
            }
            { loadingStatus ? <InternalPageStatus label={'Class is creating, please wait...'} />
              : (errorList && errorList.length > 0) || (notCreatedClass && notCreatedClass.length)

                ? <ReactTable
                  data={notCreatedClass.length > 0 ? notCreatedClass : errorList}
                  style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold', height: '500px', overflow: 'auto' }}
                  columns={notCreatedClass.length > 0 ? notCreatedClassColumn : columns}
                  defaultPageSize={5}
                  showPageSizeOptions
                  loading={loading}
                  className='-striped -highlight'
                  getTheadThProps={() => {
                    return {
                      style: {
                        background: 'rgba(0, 140, 255, 0.59)',
                        position: 'sticky',
                        zIndex: 99
                      }
                    }
                  }}
                  getTrProps={(state, rowInfo, instance) => {
                    return {
                      style: {
                        background: 'rgba(20, 33, 255, 0)',
                        color: 'black'
                      }
                    }
                  }
                  }
                /> : ' '

            }
            <br />
            {
              (errorList && errorList.length > 0) || (notCreatedClass && notCreatedClass.length > 0) ? <div>
                {
                  notCreatedClass && notCreatedClass.length > 0 ? ''
                    : <FormControlLabel
                      control={<Checkbox checked={ignore} disabled={loadingStatus} onClick={() => setIgnore(!ignore)} name='checkedA' />}
                      label='Ignore Errors and Proceed to Upload'
                    />
                }

                {
                  (errorList && errorList.length > 0) || (notCreatedClass && notCreatedClass.length > 0)
                    ? <Button variant='contained' color='primary' disabled={(!ignore || loadingStatus) && (notCreatedClass.length <= 0 || loadingStatus)} style={{ marginBottom: 10 }} onClick={() => ignoreErrorCase()}>
                      {notCreatedClass && notCreatedClass.length > 0 ? 'Download' : 'Upload'}
                    </Button> : ''
                }
              </div> : ''

            }

            {
              firstValidationErrors && firstValidationErrors.length > 0

                ? firstValidationErrors.map(data => {
                  return (
                    <div className='error__list'>

                      <h1 style={{ 'color': '#5d1049', 'text-transform': 'capitalize' }}>{ data.message}</h1>
                      {
                        data.error && Object.values(data.error).map((val, index) => {
                          return (
                            <h3>{index + 1}. &nbsp;{val}</h3>
                          )
                        })
                      }
                      <hr />
                    </div>

                  )
                }

                ) : ''
            }
          </div>
        </Card>
      </Modal>
    </div>
  )
}
