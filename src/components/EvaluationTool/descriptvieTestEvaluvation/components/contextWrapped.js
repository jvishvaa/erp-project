import React, { useRef, useState, useEffect } from 'react';
import { Button, Tooltip, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import FormControl from '@material-ui/core/FormControl';
// import ImageSearchIcon from '@material-ui/icons/ImageSearch'
import Select from '@material-ui/core/Select';
import {
  Brush,
  FullscreenRounded,
  FullscreenExitRounded,
  GetApp,
  ArrowBack,
  ArrowForward,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import CorrectionComponent from '../editor/index';
import { useDescriptvieContex } from '../context/index';
import SaveIcon from '@material-ui/icons/Save';
// import { InternalPageStatus } from '../../../ui'

import '../editor/correction_styles.css';
import '../correction.css';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    top: `calc(1rem + ${theme.mixins.toolbar.minHeight}px) !important`,
    right: '1rem !important',
  },
}));

function Evaluvation(props) {
  const classes = useStyles();
  const containerRef = useRef();
  const [fullscreen, setFullscreen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [drawedChanges, setDrawedChanges] = useState({});
  const {
    tool,
    enableTool,
    onChange,
    url,
    pageNumber,
    open,
    setOpen,
    drawing,
    loading,
    isPending,
    downloadPdfFile,
    setIsPending,
    handleClose,
    correctionLoading,
    isSaved,
    onClickNext,
    onClickPrevious,
    totalPages,
    handleTotalPage,
    setPdfState,
    enableRotation,
    rotation,
    angleInDegrees,
    splittedMedia,
    handleONSaveHW,
    initialAngle,
    enableZoom,
    zoom,
    isReset,
  } = useDescriptvieContex();

  const showEvaluvationPage = () => {
    setOpen(!open);
  };

  const handleCloseMenu = () => {
    setOpenMenu(!openMenu);
  };

  function onClickFullscreen() {
    let container = containerRef.current;
    if (!fullscreen) {
      container.requestFullscreen().then(() => {
        setFullscreen(true);
      });
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }

  const handleChangeMenu = (e) => {
    downloadPdfFile(e.target.value);
  };

  const handleSave = (data) => {
    setDrawedChanges(data);
  };

  const dragToolbar = (elmnt) => {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    elmnt.onmousedown = dragMouseDown;
  };

  useEffect(() => {
    dragToolbar(document.querySelector('.evaluvation_tool_bar'));
  }, []);

  const containerStyle = {
    background: fullscreen ? 'white' : 'none',
    overflow: fullscreen ? 'auto' : 'none',
  };
  
  const borderStyle={
    borderTop:'none',borderLeft:'none',borderRight:'none'
  }
  return (
    <React.Fragment>
      <div
        ref={containerRef}
        style={containerStyle}
        className='evaluvation_parent_container'
      >
        <div
          style={{
            top: 0,
            borderRadius: '50px',
            // float: 'right',
            position: 'fixed',
            right: 0,
          }}
          className={`evaluvation_tool_bar ${classes.toolbar}`}
        >
          {/* <Button
            onClick={() => handleCloseMenu()}
            aria-label='download'
            style={{
              border: 'none',
              display: open ? '' : 'none',
            }}
          >
            <Tooltip title='Download' arrow>
              <GetApp />
            </Tooltip>
            {openMenu && (
              <FormControl>
                <Select
                  labelId='demo-controlled-open-select-label'
                  id='demo-controlled-open-select'
                  open={openMenu}
                  onClose={handleCloseMenu}
                  onOpen={handleCloseMenu}
                  onChange={handleChangeMenu}
                >
                  <MenuItem value='original'>original file</MenuItem>
                  <MenuItem value='corrected'>corrected file </MenuItem>
                </Select>
              </FormControl>
            )}
          </Button> */}
          {totalPages ? (
            <Button
              onClick={onClickPrevious}
              aria-label='pre'
              style={{
                border: 'none',
                display: open ? '' : 'none',
              }}
            >
              <Tooltip title='Previous' arrow>
                <ArrowBack />
              </Tooltip>
            </Button>
          ) : null}
          {totalPages ? (
            <Typography
              style={{
                marginTop: '14px',
                display: open ? '' : 'none',
              }}
            >
              {pageNumber} / {totalPages}
            </Typography>
          ) : null}
          {totalPages ? (
            <Button
              onClick={onClickNext}
              aria-label='next'
              style={{
                border: 'none',
                display: open ? '' : 'none',
              }}
            >
              <Tooltip title='Next' arrow>
                <ArrowForward />
              </Tooltip>
            </Button>
          ) : null}
          {/* <div className='evaluation-toolbar-btn-grp'> */}
          <ToggleButtonGroup
            exclusive
            value={tool}
            onChange={enableTool}
            aria-label='text formatting'
            className='tool-group'
          >
            &nbsp;&nbsp;&nbsp;
            <ToggleButton
              value='paint'
              aria-label='paint'
              style={{ display: !open ? 'none' : '' },borderStyle}
            >
              <Tooltip title='Pencil' arrow>
                <Brush />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value='eraser'
              aria-label='eraser'
              style={{
                display: !open ? 'none' : ''
              },borderStyle}
            >
              <Tooltip title='Eraser' arrow>
                <svg style={{ width: '24', height: '24' }} viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M15.14,3C14.63,3 14.12,3.2 13.73,3.59L2.59,14.73C1.81,15.5 1.81,16.77 2.59,17.56L5.03,20H12.69L21.41,11.27C22.2,10.5 22.2,9.23 21.41,8.44L16.56,3.59C16.17,3.2 15.65,3 15.14,3M17,18L15,20H22V18'
                  />
                </svg>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            exclusive
            value={zoom}
            onChange={enableZoom}
            aria-label='text formatting'
            className='tool-group'
          >
            <ToggleButton
              value='zoom in'
              aria-label='paint'
              style={{
                display: !open ? 'none' : '',
              },borderStyle}
            >
              <Tooltip title='zoom in' arrow>
                <ZoomInIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value='zoom out'
              aria-label='paint'
              style={{
                display: !open ? 'none' : '',
              },borderStyle}
            >
              <Tooltip title='zoom out' arrow>
                <ZoomOutIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            exclusive
            value={rotation}
            onChange={enableRotation}
            aria-label='text formatting'
            className='tool-group'
          >
            <ToggleButton
              value='rLeft'
              aria-label='paint'
              style={{
                display: !open ? 'none' : '',
              },borderStyle}
            >
              <Tooltip title='rotate left' arrow>
                <RotateLeftIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              color="primary"
              value='rRight'
              aria-label='paint'
              style={{
                display: !open ? 'none' : '',
              },borderStyle}
            >
              <Tooltip title='rotate right' arrow>
                <RotateRightIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          {/* </div> */}
          <Button
            onClick={onClickFullscreen}
            aria-label='paint'
            color="primary"
            variant="contained"
            style={{
              display: open ? '' : 'none',
              width:'50%'
            },borderStyle}
            disabled={!open}
          >
            <Tooltip title='Full Screen' arrow>
              {fullscreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
            </Tooltip>
          </Button>
          {/* <Tooltip title='reset' arrow>
            <Button
              edge='start'
              color='primary'
              variant='contained'
              onClick={reset}
              style={{ borderRadius: 'inherit' }}
            >
              reset
            </Button>
          </Tooltip> */}
            <Button
              edge='start'
              color='primary'
              variant='contained'
              onClick={(e) => onChange(drawedChanges)}
              aria-label='close'
              disabled={isSaved}
              style={{marginTop:'1px',width:'40%'},borderStyle}
            >
              <Tooltip title='save' arrow>
                <SaveIcon/>
              </Tooltip>
              {/* {isSaved ? 'SAVING...' : 'SAVE'} */}
            </Button>
          &nbsp;&nbsp;
          <Tooltip title='close' arrow>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
              aria-label='close'
              style={{ margin: '-5px 10px'}}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>

        {!open ? (
          showEvaluvationPage()
        ) : (
          <div className='loading_container' style={{}}>
            {(loading || isPending || correctionLoading) && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 900,
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '100%',
                  background: fullscreen ? 'grey' : 'white',
                }}
              >
                {correctionLoading ? `Updating changes please wait.` : `Loading...`}
              </div>
            )}
            {url && (
              <CorrectionComponent
                pageNumber={pageNumber}
                setIsPending={setIsPending}
                fullscreen={fullscreen}
                onChange={onChange}
                tool={tool}
                url={url}
                drawing={drawing}
                loader={loading}
                handleSave={handleSave}
                handleTotalPage={handleTotalPage}
                setPdfState={setPdfState}
                rotation={rotation}
                angleInDegrees={angleInDegrees}
                splittedMedia={splittedMedia}
                handleONSaveHW={handleONSaveHW}
                initialAngle={initialAngle}
                zoom={zoom}
                // reset={reset}
                isReset={isReset}
                // magnify={magnify}
              />
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
export default Evaluvation;
