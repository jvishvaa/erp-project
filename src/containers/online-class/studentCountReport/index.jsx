import React, { useEffect, useState } from 'react';
import Layout from 'containers/Layout';
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Paper,
} from '@material-ui/core';
// import { Pagination } from '@material-ui/lab';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';

const StudentCountReport = () => {
  const [studentCountData, setStudentCountData] = useState(null);
  const [tableHead, setTableHead] = useState(null);
//   const [paginationData, setPaginationData] = useState({
//     totalPages: 10,
//     currentPage: 1,
//   });

  useEffect(() => {
    getStudentCountReportData();
  }, []);

  const getStudentCountReportData = () => {
    axiosInstance
      .get(`${endpoints.academics.getStudentCountReportData}?acad_session=5`)
      .then((res) => {
        console.log(res);
        setStudentCountData(res.data);
        setTableHead(Object.keys(res.data[0]));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //   const createHead = () => {
  //     let arr = Object.keys(studentCountData[0]);
  //     console.log(arr);
  //   };
  //   const handlePagination = (event, page) => {
  //     event.preventDefault();
  //     setPaginationData({
  //       ...paginationData,
  //       currentPage: page,
  //     });
  //   };
  return (
    <Layout>
      <div style={{ padding: '10px' }}>
        <h1>Student Count Report</h1>
        {/* <button onClick={() => createHead()}>hello</button> */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHead &&
                  tableHead.map((each, index) => (
                    <TableCell key={index}>
                      {studentCountData && studentCountData[0][each]}
                    </TableCell>
                  ))}
                {/* <TableCell>Total</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {studentCountData &&
                studentCountData
                  .filter((item, index) => index !== 0)
                  .map((eachStudent, index) => {
                    return (
                      <TableRow key={index}>
                        {tableHead &&
                          tableHead.map((each, i) => (
                            <TableCell key={i}>{eachStudent[each]}</TableCell>
                          ))}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Pagination
        //   style={{ textAlign: 'center', display: 'inline-flex' }}
          onChange={handlePagination}
          count={paginationData.totalPages}
          color='primary'
          page={paginationData.currentPage}
        /> */}
      </div>
    </Layout>
  );
};

export default StudentCountReport;
