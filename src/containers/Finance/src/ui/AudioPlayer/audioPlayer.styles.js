export default (theme) => ({
  audioContainer: {
    width: '98%',
    minHeight: '150px',
    border: '1.5px solid #85adad',
    margin: 'auto',
    padding: '10px',
    '&:hover': {
      border: '1.5px solid #476b6b'
    },
    position: 'relative'
  },
  audioOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgb(0,0,0,0.7)'
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
    position: 'relative',
    boxSizing: 'border-box',
    border: '0.5px solid black'
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
    bottom: '0px',
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
