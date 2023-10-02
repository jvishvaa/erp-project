import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, SvgIcon, Dialog, Slide } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import EbookPdf from 'containers/ebooks/EbookPDF';
import { Card, Divider, Tag, Button, Pagination, Empty, message } from 'antd';
import moment from 'moment';
import './newebook.scss';
import { EyeFilled } from '@ant-design/icons';
import { domain_name } from 'v2/commonDomain';

const useStyles = makeStyles((theme) => ({
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

const EbookCards = (props) => {
  const classes = useStyles();
  const { data, totalEbooks } = props;
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const userDetails = JSON.parse(localStorage.getItem('userDetails'))?.user_id || {};
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const env = window.location.host;
  const domain = window.location.host.split('.');

  const user_level = JSON.parse(localStorage.getItem('userDetails'))?.user_level || '';

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
      axiosInstance
        .get(`${endpoints.ebook.EbookUser}?ebook_id=${data.id}`)
        .then((res) => {
          setLoading(false);
          if (props?.recently == true) {
            setPageNumber(data?.page_number);
          } else {
            setPageNumber(res?.data?.page_number);
          }
          setTimeSpent(res?.data?.time_spent);
          setOpen(true);
        })
        .catch((error) => {
          if (error.response.data.status_code == 402) {
            message.error(
              'Access has been denied, please contact your Branch Administration for further assistance'
            );
          }
        });
    }
  };
  const dateToday = new Date();
  const handleClose = () => {
    setOpen(false);
    setSelectedItem('');
    ebookClose({
      ebook_id: selectedItem?.id,
      user_id: userDetails,
      lst_opened_date: new Date(),
      book_type: '3',
      page_number: pageNumber,
      session_year: selectedAcademicYear?.id,
    });
    if (props?.recently == true) {
      props.fetchEbooksDefault({
        book_type: '3',
        session_year: selectedAcademicYear?.session_year,
        page_number: props?.page,
        page_size: '9',
        domain_name: domain_name,
      });
    } else {
      props.fetchEbooks({
        grade: props?.centralGrade,
        subject: props?.centralSubject,
        is_ebook: 'true',
        volume: props?.volumeId,
        branch: props?.branchId,
        domain_name: domain_name,
        academic_year: selectedAcademicYear?.id,
        session_year: selectedAcademicYear?.session_year,
        page_number: props?.page,
        page_size: '9',
        book_type: '3',
      });
    }
  };

  const ebookClose = (params) => {
    axiosInstance
      .post(`${endpoints.ebook.ebookClose}`, params)
      .then((res) => {})
      .catch((error) => {});
  };

  const getPageNum = (pageNum) => {
    setPageNumber(pageNum);
  };

  return (
    <>
      {data?.length > 0 ? (
        <div
          className={classes.root}
          style={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}
          >
            {data?.length > 0 &&
              data.map((item, index) => (
                <div className='ebookCard' style={{ margin: '5px' }}>
                  <Card
                    hoverable
                    style={{
                      width: 370,
                      display: 'flex',
                      background: item?.ebook_type == 2 ? 'aliceblue' : '',
                      cursor: 'pointer',
                    }}
                    cover={
                      <img
                        alt='example'
                        src={`${endpoints.centralBucket}/${item?.ebook_thumbnail}`}
                        style={{ width: '150px', height: '150px', padding: '1%' }}
                      />
                    }
                    onClick={() => handleClickOpen(item)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div style={{ marginLeft: '2%' }}>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '600',
                            marginLeft: '2px',
                          }}
                        >
                          Published On :{' '}
                        </span>
                        <span style={{ fontSize: '10px', color: 'grey' }}>
                          {moment(item?.created_at).format('DD-MM-YYYY')}
                        </span>
                      </div>
                      <Tag color='#87d068' style={{ margin: '0px', height: '20px' }}>
                        {item?.ebook_type == 1
                          ? 'General'
                          : item?.ebook_type == 2
                          ? 'Curriculum'
                          : ''}
                      </Tag>
                    </div>
                    <div className='namediv '>
                      <Tooltip
                        title={
                          item?.ebook_name.charAt(0).toUpperCase() +
                          item?.ebook_name.slice(1)
                        }
                      >
                        <div style={{ width: 200 }}>
                          <div className='ebookname col-md-10 p-0 text-truncate'>
                            {item?.ebook_name.charAt(0).toUpperCase() +
                              item?.ebook_name.slice(1)}
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                    <Divider />
                    <div className='bottomcard'>
                      <div style={{ display: 'flex', marginLeft: '2%' }}>
                        <span
                          style={{ fontSize: '9px', fontWeight: '600', color: 'grey' }}
                        >
                          Last Viewed :{' '}
                        </span>
                        <span style={{ fontSize: '10px' }}>
                          {moment(item?.lst_open_date).format('DD-MM-YYYY')}
                        </span>
                      </div>
                      <div className='btndiv'>
                        <Button
                          type='primary'
                          className='btnant'
                          onClick={() => handleClickOpen(item)}
                        >
                          Read
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
          </div>
          {data?.length > 0 ? (
            <>
              <div
                className='th-16 p-3'
                style={{ display: 'flex', justifyContent: 'center', color: 'grey' }}
              >
                Books cannot be downloaded due to copyright claim
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  defaultCurrent={props?.page}
                  total={props?.total}
                  onChange={props?.handlePageChange}
                  pageSize={9}
                />
              </div>
            </>
          ) : (
            ''
          )}

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
                recently={props?.recently}
              />
            </Grid>
          </Dialog>
        </div>
      ) : (
        <div style={{ minHeight: '50vh' }}>
          <Empty
            style={{ marginTop: '5%' }}
            description={
              <>
                {props?.centralSubject && props?.volumeId ? (
                  <span>No Ebooks Available For The Selected Subject</span>
                ) : user_level == 13 && props?.centralSubject ? (
                  <span>No Ebooks Available For The Selected Subject</span>
                ) : (
                  <span>Please Select Filters</span>
                )}
              </>
            }
          />
        </div>
      )}
    </>
  );
};

export default withRouter(EbookCards);
