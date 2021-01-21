/* eslint-disable no-useless-computed-key */
export default (theme) => ({
  orchadioContainer: {
    backgroundColor: '#ffe3bd',
    width: '100%',
    minHeight: '125vh',
    position: 'relative',
    overflow: 'hidden',
    ['@media (min-width: 640px)']: {
      minHeight: '125vh'
    }
  },
  mainImg: {
    width: '100%',
    height: '100vh'
  },
  buttonFiller: {
    width: '100%',
    // position: 'absolute',
    backgroundColor: '#ffe3bd',
    // height: '28%',
    // bottom: '0px',
    paddingTop: '30px',
    // ['@media (min-width: 640px)']: {
    //   height: '24vh'
    // },
    ['@media (min-width: 1025px)']: {
      marginBottom: '15px'
    }
  },
  buttonsSection: {
    display: 'flex',
    justifyContent: 'center',
    ['@media (min-width: 640px)']: {
      display: 'block'
    }
  },
  button: {
    width: '100px',
    height: '40px',
    backgroundColor: '#c96e30',
    marginLeft: '20px',
    textAlign: 'center',
    color: '#eed2bf',
    paddingTop: '3px',
    borderRadius: '10px',
    '&:hover': {
      cursor: 'pointer'
    },
    ['@media (min-width: 640px)']: {
      width: '30%',
      height: '25px',
      paddingTop: '0px',
      lineHeight: '25px',
      margin: 'auto',
      marginLeftt: '0px',
      marginBottom: '10px',
      fontSize: '1.4rem',
      fontWeight: '500px'
    }
  },
  emailSection: {
    textAlign: 'center',
    fontSize: '1rem',
    paddingBottom: '10px',
    ['@media (min-width: 640px)']: {
      fontSize: '1.2rem'
    }
  },
  audioContainer: {
    width: '98%',
    minHeight: '150px',
    border: '0.5px solid black',
    margin: 'auto',
    padding: '10px',
    position: 'relative',
    paddingTop: '25px'
  },
  audioOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgb(0,0,0,0.7)'
  },
  radioImg: {
    margin: 'auto',
    maxWidth: '100%',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  notFound: {
    width: '90%',
    height: '25px',
    paddingTop: '0px',
    lineHeight: '25px',
    backgroundColor: '#b62b3a',
    textAlign: 'center',
    color: '#eed2bf',
    fontSize: '1.2rem',
    fontWeight: '500px',
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    borderRadius: '10px',
    transform: 'translateX(-50%)',
    ['@media (min-width: 640px)']: {
      width: '50%',
      fontSize: '1.4rem'
    }
  },
  backButton: {
    width: '100px',
    height: '30px',
    lineHeight: '30px',
    margin: 'auto',
    backgroundColor: '#c96e30',
    position: 'absolute',
    bottom: '50px',
    color: '#eed2bf',
    left: '50%',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '1.2rem',
    transform: 'translateX(-50%)',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  audioPlayer: {
    height: '100%',
    width: '100%'
  },
  icons: {
    fontSize: '50'
  },
  albumDetails: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'lighter'
  },
  meter: {
    position: 'relative',
    borderRadius: '25px',
    border: '1px solid #555',
    boxShadow: 'inset 0 -1px 1px rgba(255,255,255,0.3)'
  },
  progressBar: {
    display: 'block',
    height: '100%',
    padding: '2.5px',
    backgroundColor: '#85adad',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
    width: '0%'
  },
  albumImage: {
    width: '90%',
    margin: 'auto',
    overflow: 'hidden',
    position: 'relative'
  },
  iconButton: {
    padding: '0px'
  },
  albumDetailsOverlay: {
    position: 'absolute',
    minHeight: '40px',
    lineHeight: '40px',
    fontWeight: 'lighter',
    fontSize: '1rem',
    textAlign: 'center',
    color: '#f2f2f2',
    width: '50%',
    margin: 'auto',
    backgroundColor: 'rgb(0, 0, 0, 0.8)',
    bottom: '5px',
    transform: 'translate(50%)'
  },
  timer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  },
  textRoot: {
    textAlign: 'center'
  },
  likeContainer: {
    width: '100%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#f2f2f2',
    backgroundColor: 'rgb(0, 0, 0, 0.8)'
  }
})
