import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';

export default function AssesmentReportBackNew({ reportCardDataNew }) {
  const [pricipalSignData, setPricipalSignData] = useState([]);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchPrincipalSignature({
      branch_id: selectedBranch?.branch?.id,
    });
  }, [reportCardDataNew]);

  const fetchPrincipalSignature = (params = {}) => {
    axios
      .get(`${endpoints.principalSign}`, {
        params: { ...params },
      })
      .then((response) => {
        if (response.status === 200) {
          setPricipalSignData(response?.data);
        }
      })
      .catch((error) => {});
  };

  var backData = reportCardDataNew?.back_page_report;
  let schoolData = reportCardDataNew?.school_info;
  return (
    <React.Fragment>
      <div className='row bg-white py-2'>
        {/* Teachers Remarks */}
        <table className='w-100 mt-1 th-12 th-report-table '>
          <tbody className='th-table-border'>
            <tr>
              <td
                className=' py-2 text-center th-fw-600'
                style={{ background: '#FDBF8E' }}
              >
                OBSERVATION FEEDBACK AND ADVISE
              </td>
            </tr>
          </tbody>
        </table>
        <table className='w-100 mt-1 th-12 th-report-table '>
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '70%' }} />
            <col style={{ width: '5%' }} />
          </colgroup>
          {backData?.map((eachData, j) => {
            return (
              <tbody className='th-table-border'>
                <tr>
                  <td
                    className='py-2 text-center th-fw-600'
                    rowSpan={eachData?.parameter_details?.length + 2}
                  >
                    {eachData?.subject?.subject_name}
                  </td>

                  <td colSpan={2} className=' py-2 text-center th-fw-600'>
                    <div className='d-flex justify-content-between px-2 th-fw-600 '>
                      <div>MARKS - {eachData?.marks}</div>
                      <div>Grade - {eachData?.grade_name} </div>
                      <div>OSR - {eachData?.OSR}</div>

                      <div>AIR - {eachData?.AIR}</div>
                    </div>
                  </td>

                  <td
                    className='py-2 text-center th-fw-600'
                    rowSpan={eachData?.parameter_details?.length + 1}
                  ></td>
                </tr>

                {eachData?.parameter_details?.map((eachParameter, i) => {
                  return (
                    <>
                      <tr>
                        <td
                          className='py-2 text-center th-fw-600'
                          style={{ background: '#ffffff' }}
                        >
                          {eachParameter?.parameter_name}
                        </td>
                        <td className='py-2' style={{ background: '#ffffff' }}>
                          {eachParameter?.parameter_description}
                        </td>
                      </tr>
                    </>
                  );
                })}

                <tr>
                  <td
                    className=' py-2 text-center th-fw-600'
                    style={{ background: '#fdbf8e' }}
                  ></td>
                  <td className=' py-2' style={{ background: '#fdbf8e' }}></td>
                  <td className=' py-2' style={{ background: '#fdbf8e' }}></td>
                </tr>
              </tbody>
            );
          })}
        </table>

        <table className='w-100 mt-1 th-12 th-report-table '>
          <tbody className='th-table-border'>
            <tr>
              <td
                className='py-2 text-center th-fw-600'
                style={{ background: '#FDBF8E' }}
              >
                PRINCIPAL - {schoolData?.principal_name}
                {pricipalSignData?.length ? (
                  <span className='pl-2'>
                    <img
                      src={
                        `https://letseduvate.s3.amazonaws.com/prod/media/` +
                        pricipalSignData[0]?.principle_sign
                      }
                      width={'120px'}
                    />
                  </span>
                ) : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
