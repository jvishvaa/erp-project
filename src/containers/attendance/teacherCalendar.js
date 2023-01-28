import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import { message, Spin } from 'antd';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import CalendarV2 from './CalendarEventHoliday';
import AttedanceCalender from './AttedanceCalender';

const TeacherCalendar = () => {
    const [configOn, setConfigOn] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectedBranch = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch
    );
    const fetchConfigStatus = (params = {}) => {
        setLoading(true);
        axios
            .get(`${endpoints.doodle.checkDoodle}?config_key=calendar-v2`)
            .then((response) => {
                if (response?.data?.result[0] === 'True') {
                    setConfigOn(true);
                    setLoading(false);

                } else {
                    setConfigOn(false);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    //   useEffect(() => {
    //     if (selectedBranch) {
    //       fetchConfigStatus({ branch_id: selectedBranch?.branch?.id });
    //     }
    //   }, [selectedBranch]);

    useEffect(() => {
        fetchConfigStatus()
    }, [])
    return (
        <>
            {loading ?
                <div className='th-width-100 text-center mt-5' style={{height: '50vh'}} >
                    <Spin tip='Loading...'></Spin>
                </div> :
                <>
                    {configOn ? <CalendarV2 /> : <AttedanceCalender />}
                </>
            }
        </>
    );
};

export default TeacherCalendar;
