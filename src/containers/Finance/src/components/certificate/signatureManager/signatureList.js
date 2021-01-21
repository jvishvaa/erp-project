/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  Grid,
  CardActions,
  Button,
  Card,
  CardActionArea,
  CardMedia
  // Paper,
  // TextField
} from '@material-ui/core'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '10px'
  },
  card_root: {
    maxWidth: '100%'
  },
  img__sign: {
    width: '100%',
    height: '35vh',
    padding: '10px'
  },
  progress: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '60px !important',
    height: '60px !important',
    'z-index': '1550',
    color: '#5d1049'
  },
  viewButton: {
    width: '100%',
    color: '#fff'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  view__remove: {
    display: 'flex',
    background: '#5d2449',
    width: '100%'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  title_row: {
    fontWeight: 'bold',
    margin: '5px',
    display: 'flex',
    background: '#5c2449',
    'text-align': 'center',
    padding: '5px 0px'
  },
  title_row1: {
    color: '#FFEB3B',
    marginRight: '10px',
    display: 'block',
    margin: '0 auto'
  },
  paper__search: {
    padding: '20px',
    background: '#d0d0d0'
  },
  loader__circularPro: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}))

const SignatureList = (props) => {
  const [signaList, setSignaList] = useState()
  // const [search, setSearch] = useState()
  const [open, setOpen] = useState(false)
  const [signImg, setSingImage] = useState()
  const [loader, setLoader] = useState(true)
  const classes = useStyles()
  const viewSignature = (sign) => {
    setOpen(true)
    setSingImage(sign)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const removeSigna = (id) => {
    console.log('click remove button', id)
    axios.delete(urls.signatureUpload + String(id) + '/', {
      headers: {
        Authorization: 'Bearer ' + props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          props.alert.success('Remove successfully')
          // console.log('res.status', res.status)
        }
        setLoader(false)
        getSignature()
      })
      .catch(error => {
        console.log(error)
        console.log(JSON.stringify(error), error)
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          props.alert.error(JSON.stringify(message))
        } else {
          props.alert.error(JSON.stringify(status))
        }
        setLoader(false)
      })
  }

  const getSignature = () => {
    axios
      .get(urls.signatureUpload, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res)

        let { data: { data = [] } = {} } = res
        if (res.status === 200) {
          setLoader(false)
          props.alert.success('Signature List Fetch successfully')
          setSignaList(data)
        }
      })
      .catch(error => {
        console.log(error)
        console.log(JSON.stringify(error), error)
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          props.alert.error(JSON.stringify(message))
        } else {
          props.alert.error(JSON.stringify(status))
        }
        setLoader(false)
      })
  }
  useEffect(() => {
    getSignature()
  }, [props.user])

  return (
    <React.Fragment>
      <Grid className={classes.loader_icon}>
        {loader && <CircularProgress className={classes.loader__circularPro} />}
        {
          <Grid container spacing={2}>
            { signaList && signaList.length
              ? signaList.map((list) => {
                return <Grid item xs={12} md={4} sm={4}>
                  <Card key={list.id} {...list} className={classes.card_root}>
                    <div className={classes.title_row}>
                      <p className={classes.title_row1}>Name : {list.name}</p> <span className='vl' /> &nbsp;
                      <p className={classes.title_row1}>Erp : {list.erp}</p> <span className='vl' />&nbsp;
                      <p className={classes.title_row1}>Branch : {list.branch.branch_name}</p>
                    </div>
                    <CardActionArea>
                      <CardMedia
                        className={classes.img__sign}
                        component='img'
                        alt={`${list.added_time}`}
                        height='140'
                        src={`${list.sign}`}
                        title='Contemplative Reptile'
                      />
                    </CardActionArea>
                    <CardActions>
                      <div className={classes.view__remove}>
                        <Button
                          className={classes.viewButton}
                          size='small'
                          color='primary'
                          onClick={() => viewSignature(`${list.sign}`)}
                        >
                      View
                        </Button>
                        <Button
                          className={classes.viewButton}
                          size='small'
                          color='primary'
                          onClick={() => removeSigna(`${list.id}`)}
                        >
                      Remove
                        </Button>
                      </div>
                    </CardActions>
                  </Card>
                  <Modal
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500
                    }}
                  >
                    <Fade in={open}>
                      <div className={classes.paper}>
                        {/* <h2 id='transition-modal-title'>{list.name}</h2> */}
                        <img src={signImg} id='transition-modal-description' height='200' />
                      </div>
                    </Fade>
                  </Modal>

                </Grid>
              }) : ''
            }
          </Grid>
        }
        <Grid />
      </Grid>
    </React.Fragment>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  roles: state.roles.items
})
const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignatureList)
