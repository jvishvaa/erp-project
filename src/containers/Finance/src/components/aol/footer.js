import React from 'react'
// import axios from 'axios'
import './aol.css'
import youtube from './assets/youtube (1).png'
// import logo from './assets/logo.png'
// import AccountCircle from '@material-ui/icons/AccountCircle'
// import LockIcon from '@material-ui/icons/Lock'

// const useStyles = makeStyles(theme => ({
//   margin: {
//     margin: theme.spacing(1),
//   },
//   pap: {
//     // width: '40%'
//   }
// }))
function Footer () {
  return (
    <React.Fragment>
      <div className='aol_footer'>
        <div>
          {/* Copyright &copy; - Always On Learning */}
          Copyright&copy; 2020, K12 Techno Services Pvt. Ltd. All Rights Reserved
        </div>
        <div>
          <a href='https://www.youtube.com/channel/UCGxtpqR_RdVq1dqkUehLZCg/videos' target='_blank'><img src={youtube} alt='youtube' width='50px' height='50px' /></a>
        </div>
        <div>
          Terms and Conditions | Privacy Policy
        </div>
      </div>
    </React.Fragment>
  )
}

export default Footer
