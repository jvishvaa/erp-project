/* eslint-disable no-undef */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import SaveIcon from '@material-ui/icons/Save'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import { urls } from '../../urls'
import { InternalPageStatus } from '../../ui'

const styles = theme => ({
  root: {
    // maxWidth: 345
  },
  media: {
    // height: 140
  },
  gridroot: {
    flexGrow: 1
  },
  under__line: {
    'margin-top': '2%',
    'margin-bottom': '2%',
    'border-bottom': '2px solid #5d2449'
  }
})
class Step0 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isTemplateLoading: true,
      selectedTemplate: '',
      bgColor: '',
      title: 'This template is not selected'

    }
    this.detailObj = JSON.parse(sessionStorage.getItem('detailedObj'))
  }
  componentWillMount () {
    let { selectedTemplate, bgColor, title } = this.props
    if (selectedTemplate && bgColor && title) {
      this.setState({ selectedTemplate: selectedTemplate, bgColor: bgColor, title: title })
    }
    console.log(selectedTemplate)
    axios.get(`${urls.CertificateTemplatels}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }

    }).then(res => {
      let { data: { data = [] } = {} } = res

      this.setState({ template: data, isTemplateLoading: false })

      console.log(data)
    }).catch(error => {
      this.setState({ isTemplateLoading: false, isLoadingFailed: true })
      //
      console.log(JSON.stringify(error), error)
      let { response: { data: { status } = {} } = {}, message } = error
      if (!status && message) {
        this.props.alert.error(JSON.stringify(message))
      } else {
        this.props.alert.error(JSON.stringify(status))
      }
      this.setState({ isTemplateLoading: false })
      //
    })
  }
  selectTemplate =(event, val) => {
    let { template } = this.state
    const selectedTem = template.filter(v => v.id === val.id)[0].certificate_template
    this.setState({ selectedTemplate: selectedTem })
    this.setState({
      bgColor: '#4CAF50',
      title: 'template  selected '
    })

    this.props.handleTemplate(selectedTem, '#4CAF50', 'template  selected ')
  }
  render () {
    const { classes } = this.props
    let { template, isTemplateLoading, selectedTemplate, isLoadingFailed } = this.state
    // console.log(template, this.state.selectedTemplate)
    console.log(selectedTemplate)
    const ModalTemplate = require('./img/template.png')
    // console.log(template && template.certificate_template)
    return (
      <div className={classes.gridroot}>
        <Grid className={classes.under__line} />
        {/* {isTemplateLoading ? <InternalPageStatus label={`fetching template please wait...`} /> : <InternalPageStatus
          loader={false}
          label={'Oops..Server is Down'} />} */}
        {isTemplateLoading ? <InternalPageStatus label={`fetching template please wait...`} /> : isLoadingFailed ? <InternalPageStatus
          loader={false}
          label={'Oops..Server is Down'} /> : ''}
        <hr />
        {template && template.map(e => {
          return (<Grid
            container
            direction='row'
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={4}>
              <Card className={classes.root}>
                <CardActionArea
                >
                  <Button
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      width: '100%',
                      backgroundColor: this.state.bgColor
                    }}
                    width='100%'
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={(event) => this.selectTemplate(event, e)}
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    // value={selectedTemplate}
                  >
                    {this.state.title}
                  </Button>
                  {/* {isTemplateLoading && <InternalPageStatus />}
                  {template && <iframe
                    width='100%'
                    height='345'
                    src={`${e.certificate_template}`} allowFullScreen />} */}
                  {isTemplateLoading && <InternalPageStatus />}
                  {template && <img
                    style={{ maxWidth: '100%',
                      height: 'auto' }}
                    src={ModalTemplate} allowFullScreen />}
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>)
        })}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Step0)))
