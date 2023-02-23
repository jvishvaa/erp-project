/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import _ from 'lodash';
import JSPDF from 'jspdf';
import 'jspdf-autotable';
import './customFont';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import FrontImg from './img/frontPage.png';
import BodyBg from './img/report-card-bg.png';

const EypReportCard = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

  const getEypReprtData = (params = {}) => {
    let obj = {};
    obj.acad_session_id = props.acadSessionId;
    obj.grade_id = props.gradeId;
    obj.erp_id = props.erpId;
    setLoading(true);
    axiosInstance
      .get(`${endpoints.assessmentReportTypes.eypReportCard}`, { params: { ...obj } })
      .then((response) => {
        if (response?.data) {
          generateEypReport(response?.data?.result);
        }
      })
      .catch((err) => {
        setAlert('error', err?.response?.data?.message);
        setLoading(false);
      });
  };

  const generateEypReport = (reportCardData) => {
    const doc = new JSPDF({
      orientation: 'l',
      unit: 'mm',
      format: [210, 297],
      lineHeight: 1.8,
      letterSpacing: 2,
    });

    var frontImg = new Image();
    frontImg.src = FrontImg;
    doc.addImage(frontImg, 'png', 0, 0, 297, 210);

    doc.setFontSize(22);
    doc.setFont('LoveYaLikeASister-Regular', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(`${props.branchName}`, 155, 125, null, null, 'center');

    doc.setFontSize(24);
    doc.setTextColor(107, 76, 109);
    doc.text(`Academic Year 2022 - 2023`, 155, 140, null, null, 'center');

    doc.setFontSize(18);
    doc.setFont('Karla-VariableFont_wght', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Name: ${reportCardData?.student_details?.name}`,
      155,
      153,
      null,
      null,
      'center'
    );

    doc.text(
      `Grade: ${reportCardData?.student_details?.grade}  Section: ${reportCardData?.student_details?.section}`,
      155,
      163,
      null,
      null,
      'center'
    );
    doc.addPage();

    doc.setCharSpace(0.15);
    let y = 20;

    reportCardData?.report_data?.map((eachReportCardData, index) => {
      doc.setFontSize(30);
      doc.setFont('LoveYaLikeASister-Regular', 'normal');
      doc.setTextColor(255, 112, 131);
      doc.text(`${eachReportCardData?.component_name}`, 30, y, null, null, 'left');

      var bodyArr = [];

      let headerArr = eachReportCardData.sub_component.header;

      for (var k = 0; k < headerArr.length; k++) {
        var qusetionArr = headerArr[k].question_arr;

        let tempHeader = [];
        tempHeader[0] = '';
        tempHeader[1] = headerArr[k].header_name;
        tempHeader.concat(Array(reportCardData?.volumes_arr?.length).fill(''));
        bodyArr.push(tempHeader);

        for (var j = 0; j < qusetionArr.length; j++) {
          let tempArr = [];
          tempArr[0] = j + 1;
          tempArr[1] = qusetionArr[j]?.question;
          tempArr.push(_.map(qusetionArr[j]?.marks_arr, 'marks'));
          bodyArr.push(tempArr.flat(2));
        }
      }

      y += 5;

      doc.setFontSize(20);
      let drawCell = function (data) {
        var doc = data.doc;
        var rows = data.table.body;

        if (data.section === 'head') {
          data.cell.styles.font = 'Karla-VariableFont_wght';
          data.cell.styles.halign = 'center';
        }

        if (rows.length === 1) {
        } else if (data.row.raw?.length === 2) {
          data.cell.styles.fillColor = [125, 230, 233];
          data.cell.styles.fontSize = 15;
        }

        if (data.section === 'body') {
          var col = data.column.index;
          if (col == 1) {
            data.cell.styles.halign = 'left';
            data.cell.styles.cellPadding = { top: 3, right: 11, bottom: 3.6, left: 5 };
          }
        }
      };
      let volColWidth =
        80 /
        (reportCardData?.volumes_arr?.length ? reportCardData?.volumes_arr?.length : 1);
      doc.autoTable({
        head: [['S.No', 'Milestones'].concat(reportCardData?.volumes_arr)],
        body: bodyArr,
        margin: { left: 30, bottom: 20 },
        styles: { fontSize: 13, lineColor: [155, 155, 155], lineWidth: 0.1 },
        headStyles: {
          fontSize: 18,
          fontStyle: 'bold',
        },
        didParseCell: drawCell,
        columnWidth: 'wrap',
        columnStyles: {
          0: { cellWidth: 18, halign: 'center' },
          1: { cellWidth: 138 },
          2: { cellWidth: volColWidth, halign: 'center' },
          3: { cellWidth: volColWidth, halign: 'center' },
          4: { cellWidth: volColWidth, halign: 'center' },
          5: { cellWidth: volColWidth, halign: 'center' },
        },
        theme: 'plain',
        tableWidth: 236,
        startY: y + 5,
      });
      doc.addPage();
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (var i = 2; i <= pageCount; i++) {
      doc.setPage(i);
      var img = new Image();
      img.src = BodyBg;

      doc.addImage(img, 'png', 0, 0, 297, 210);

      if (i === pageCount - 1) {
        y = 185;

        doc.setFillColor(255, 255, 255);
        doc.rect(95, 186, 68, 30, 'F');

        doc.setFontSize(18);
        doc.setFont('LoveYaLikeASister-Regular', 'normal');
        doc.setTextColor(255, 112, 131);
        doc.text(`Achievement Indicators`, 30, y, null, null, 'left');
        // y += 10

        doc.setFillColor(0, 253, 43);
        doc.rect(30, 192, 57, 10, 'F');

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('Karla-VariableFont_wght', 'normal');
        doc.text(`EE - Exceeding Expectations`, 32, 198, null, null, 'left');

        doc.setFillColor(251, 171, 0);
        doc.rect(87, 192, 57, 10, 'F');
        doc.text(`ME - Meeting Expectations`, 89, 198, null, null, 'left');

        doc.setFillColor(170, 192, 71);
        doc.rect(144, 192, 63, 10, 'F');
        doc.text(`AE - Approaching Expectations`, 146, 198, null, null, 'left');

        doc.setFillColor(255, 0, 43);
        doc.rect(207, 192, 51, 10, 'F');
        doc.text(`NS - Needs Expectations`, 209, 198, null, null, 'left');
      }
    }

    doc.deletePage(pageCount);
    setLoading(false);
    window.open(doc.output('bloburl'));
    // doc.save("Registration")
  };
  return (
    <>
      {loading ? (
        <Button variant='contained' color='primary'>
          Please Wait... <CircularProgress color='#ffffff' size={20} />
        </Button>
      ) : (
        <Button variant='contained' color='primary' onClick={() => getEypReprtData()}>
          View EYP Report
        </Button>
      )}
    </>
  );
};

export default EypReportCard;
