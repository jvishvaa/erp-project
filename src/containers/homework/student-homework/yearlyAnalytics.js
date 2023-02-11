import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const GroupedChart = (props) => {
    const [data, setData] = useState([]);

    let newDataObj = []

    useEffect(() => {
        let sortedData = props?.data.map((item) => {
            let tempAssigned = {
                assigned_subject_wise_count: item?.assigned_subject_wise_count,
                student_pending_count: item?.student_pending_count,
                student_submitted_count: item?.student_submitted_count,
                subject_id: item?.subject_id,
                uploaded_at__month: item?.uploaded_at__month,
                uploaded_at__year: item?.uploaded_at__year,
                monthYear: getmonthStr(item),
                value: item?.assigned_subject_wise_count,
                type: 'Total Assigned'
            }
            let tempPending = {
                assigned_subject_wise_count: item?.assigned_subject_wise_count,
                student_pending_count: item?.student_pending_count,
                student_submitted_count: item?.student_submitted_count,
                subject_id: item?.subject_id,
                uploaded_at__month: item?.uploaded_at__month,
                uploaded_at__year: item?.uploaded_at__year,
                monthYear: getmonthStr(item),
                value: item?.student_pending_count,
                type: 'Total Pending'
            }
            let tempSubmit = {
                assigned_subject_wise_count: item?.assigned_subject_wise_count,
                student_pending_count: item?.student_pending_count,
                student_submitted_count: item?.student_submitted_count,
                subject_id: item?.subject_id,
                uploaded_at__month: item?.uploaded_at__month,
                uploaded_at__year: item?.uploaded_at__year,
                monthYear: getmonthStr(item),
                value: item?.student_submitted_count,
                type: 'Total Submit'
            }
            newDataObj.push(tempAssigned, tempPending, tempSubmit)
        })
        setData(newDataObj)
    }, [props?.data])



    const getmonthStr = (item) => {
        if (item?.uploaded_at__month == 1) {
            return `Jan ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 2) {
            return `Feb ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 3) {
            return `Mar ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 4) {
            return `Apr ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 5) {
            return `May ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 6) {
            return `Jun ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 7) {
            return `Jul ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 8) {
            return `Aug ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 9) {
            return `Sep ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 10) {
            return `Oct ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 11) {
            return `Nov ${item?.uploaded_at__year}`
        }
        if (item?.uploaded_at__month == 12) {
            return `Dec ${item?.uploaded_at__year}`
        }
    }

    console.log(data, 'sort');


    const config = {
        data,
        xField: 'monthYear',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        // minColumnWidth: 15,
        maxColumnWidth: 50,
        padding: 50,
        width: 400,
        height: 300,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        // dodgePadding: 1,
        // intervalPadding: 0,
        colorField: 'type',
        color: ({ type }) => {
            if (type === 'Total Assigned') {
                return '#69D8D1';
            }
            if (type === 'Total Pending') {
                return '#E26599';
            }
            return '#6190BC';
        }
    };


    return <Column {...config} />;
};

export default GroupedChart;

