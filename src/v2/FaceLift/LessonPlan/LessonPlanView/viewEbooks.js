import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, SvgIcon, Dialog, Slide } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import EbookPdf from 'containers/ebooks/EbookPDF';
import { EyeFilled } from '@ant-design/icons';
import { Card, Divider, Tag, Button, Pagination, Empty, Tooltip } from 'antd';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '-10px auto',
    boxShadow: 'none',
  },
  card: {
    textAlign: 'center',
    margin: theme.spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'auto',
  },
  textEffect: {
    overflow: 'hidden',
    display: '-webkit-box',
    maxWidth: '100%',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    margin: '0%',
    padding: '0%',
    height: '65px !important',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}));
function Transition(props) {
  return <Slide direction='up' {...props} />;
}

const EbookList = (props) => {
  const classes = useStyles();
  const { data, totalEbooks } = props;
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const handleClickOpen = (data) => {
    setSelectedItem(data);
    const ebookName = data.ebook_name;
    const necrtUrl = data.ebook_link;
    const url = data.ebook_file_type;
    if (ebookName && ebookName.includes('NCERT')) {
      window.open(necrtUrl);
    } else {
      const { host } = new URL(axiosInstance.defaults.baseURL);
      const hostSplitArray = host.split('.');
      const subDomainLevels = hostSplitArray.length - 2;
      let domain = '';
      let subDomain = '';
      let subSubDomain = '';
      if (hostSplitArray.length > 2) {
        domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
      }
      if (subDomainLevels === 2) {
        subSubDomain = hostSplitArray[0];
        subDomain = hostSplitArray[1];
      } else if (subDomainLevels === 1) {
        subDomain = hostSplitArray[0];
      }
      setPdfUrl(url && url);
      setLoading(true);
      setOpen(true);
      axiosInstance
        .get(`${endpoints.ebook.EbookUser}?ebook_id=${data.id}`)
        .then(({ data }) => {
          console.log(data);
          setLoading(false);
          setPageNumber(data.page_number);
          setTimeSpent(data.time_spent);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItem('');
  };

  const getPageNum = (pageNum) => {
    setPageNumber(pageNum);
  };

  return (
    <>
      <div
        className={classes.root}
        id='ebooktop'
        style={{ minHeight: '30vh', height: '40vh', overflow: 'scroll', marginTop: '1%' }}
      >
        {data?.length > 0 &&
          data.map((item, index) => (
            <>
              <div className='ebookCard' style={{ margin: '1%' }}>
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <img
                    className='col-3'
                    alt='example'
                    src={`${endpoints.centralBucket}/${item?.ebook_thumbnail}`}
                    style={{ width: '100px', height: '100px', padding: '1%' }}
                  />
                  {item?.ebook_name?.length > 50 ? (
                    <Tooltip
                      zIndex={2100}
                      autoAdjustOverflow='false'
                      placement='bottomLeft'
                      title={item?.ebook_name}
                      overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
                    >
                      <span className='col-8 align-content-center'>
                        {item?.ebook_name?.charAt(0).toUpperCase() +
                          item?.ebook_name?.slice(1, 50) +
                          '...'}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className='col-8 align-content-center'>
                      {item?.ebook_name?.charAt(0).toUpperCase() +
                        item?.ebook_name.slice(1)}
                    </span>
                  )}

                  <Button
                    className='col-1'
                    icon={<EyeFilled />}
                    onClick={() => handleClickOpen(item)}
                  />
                </div>
                <Divider style={{ margin: '0px' }} />
              </div>
            </>
          ))}

        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          style={{ zIndex: '10000' }}
          TransitionComponent={Transition}
        >
          <Grid>
            <EbookPdf
              pageNumber={pageNumber}
              timeStore={timeSpent}
              id={selectedItem?.id}
              url={`${pdfUrl && pdfUrl}`}
              passLoad={loading}
              goBackFunction={handleClose}
              name={selectedItem?.ebook_name}
              getPageNum={getPageNum}
            />
          </Grid>
        </Dialog>
      </div>
    </>
  );
};

export default withRouter(EbookList);
