import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
// import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    maxWidth: 'sm'
  },
  media: {
    height: 140
  }
})

export default function MediaCard () {
  const classes = useStyles()

  return (
    <Card className={classes.root} >
      <CardContent>
        <Typography gutterBottom variant='h5' component='h2' color='initial' align='center' position='secondary'> Policy </Typography>
        <Typography variant='subtitle1' color='textSecondary' component='h4'>
          Eduvate values your trust. In order to honour that trust, eduvate adheres to ethical standards in gathering, using, and safeguarding any information you provide. Eduvate recognizes the importance of maintaining your privacy. We value your privacy and appreciate your trust in us. This Policy describes how we treat user information we collect on the application ”Eduvate Parents Portal” and other offline sources. This Privacy Policy applies to current and former Privacyvisitors to our application and to our online customers. By visiting and/or using our application, you agree to this Privacy Policy.
        </Typography><br />
        <Typography gutterBottom variant='h5' component='h2' color='initial' align='center' position='secondary' > Information we collect </Typography>
        <Typography variant='body1' color='textSecondary' component='h4' >
          <Typography variant='h6' color='textPrimary' >Contact Information:</Typography> We collect the “Erp Code” or the identification code issued by Orchids from the User to fetch user data.
          <br /><br />
          <Typography variant='h6' color='textPrimary'>Information You Post:</Typography> We collect information sent as a complaint by the user to track issues related to that user and solve issues encountered by the user.
We collect information in different ways. We collect information directly from you: We collect the Erp code from every user when he logs in. We collect information from you passively: We collect different information fetched on the server to collect data and crash results of the app to provide a better and crash-free experience to our users
          <br /><br />
          <Typography variant='h6' color='textPrimary'>Use of your Personal Information</Typography>
Your personal information is used to provide a better response from the application to you and also able us to track issues and complaints from the user
Sharing information with third parties We don’t share any of your information with any third party.
          <br /><br />
          <Typography variant='h6' color='textPrimary'>Grievance Officer</Typography>
          <Typography variant='body1' color='textPrimary'>Phone Number: +91-9036017100 </Typography>
          <Typography variant='subtitle1' color='textPrimary'>Email Address: info@letseduvate.com</Typography>
Updates to this policy This Privacy Policy was last updated on 16.12.2019. From time to time we may change our privacy practices. We will notify you of any material changes to this policy as required by law. We will also post an updated copy on our website. Please check our site periodically for updates. Jurisdiction If you choose to visit the website, your visit and any dispute over privacy is subject to this Policy and the website's terms of use. In addition to the foregoing, any disputes arising under this Policy shall be governed by the laws of India.

        </Typography>
      </CardContent>
      {/* </CardActionArea> */}
    </Card>
  )
}
