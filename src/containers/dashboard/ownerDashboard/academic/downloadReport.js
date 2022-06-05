import React, { useContext } from 'react';
import { Button, Menu, Fade, Typography } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVert from '@material-ui/icons/MoreVert';
import GetAppIcon from '@material-ui/icons/GetApp';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { useDashboardContext } from '../../dashboard-context';
import Loader from 'components/loader/loader';
// import SyncIcon from '@mui/icons-material/Sync';  
import SyncIcon from '@material-ui/icons/Refresh';
import '../../WelcomeComponent/Styles.css'

const reportTypes = [
  { type: 'Daily Report', days: '1' },
  { type: 'Weekly Report', days: '7' },
  { type: 'Monthly Report', days: '30' },
];

const DownloadReport = ({ title, branchData }) => {
  const { branchIds = [], downloadReport = () => {}, getReport = () => {}, setCard, setReports } = useDashboardContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { setAlert } = useContext(AlertNotificationContext);
  const[loader,setLoader] = React.useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const getAttendanceReport = () => {    
  const decisonParam = title.toLowerCase().split(' ')[0];
  setCard(decisonParam);
  };

  const downloadExcelFile = (excelData) => {
    const blob = window.URL.createObjectURL(
      new Blob([excelData], {
        type: 'application/vnd.ms-excel',
      })
    );
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = blob;
    link.setAttribute('download', 'report.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (days) => {
    let branchIds = branchData?.length > 1 ? branchData.map((item) => item?.branch?.id) : branchData
    const params = { days, branch_ids: branchIds?.length > 1 ? branchIds.join(','): branchIds };
    const decisonParam = title.toLowerCase().split(' ')[0];
    setLoader(true)
    downloadReport(decisonParam, params)
      .then((response) => {
        setLoader(false)
        const {
          headers = {},
          message = 'Downloadable report not available',
          data = '',
        } = response || {};
        const contentType = headers['content-type'] || 'application/json';
        if (contentType === 'application/json') {
          setAlert('info', message);
        } else {
          downloadExcelFile(data);
        }
      })
      .catch(() => {});
    handleClose();
  };

  return (
  <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* <SyncIcon id="refreshButton1"  style={{cursor:'pointer'}}  onClick={getAttendanceReport}/> */}
      <Button
        aria-label='download'
        ref={anchorEl}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
        variant = 'contained'
        color = 'primary'
      >
        <GetAppIcon />
        Download Report
      </Button>
      <Menu
        id='fade-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {reportTypes.map(({ type, days }) => (
          <MenuItem
            dense={true}
            key={`${type - days}`}
            onClick={() => handleDownload(days)}
            component='button'
          >
            <ListItemIcon>
              <GetAppIcon fontSize='small' />
            </ListItemIcon>
            <Typography variant='inherit'>{type}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
    {loader && <Loader />}
    </>
  );
};

export default DownloadReport;
