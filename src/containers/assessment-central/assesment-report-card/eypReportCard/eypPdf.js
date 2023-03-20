/* eslint-disable */
import React, { useState } from 'react';
import JSPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import './customFont';
import FrontImg from './img/frontPage.png';
import BodyBg from './img/report-card-bg.png';

const EypReportCardPdf = (reportCardData, branchName) => {
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
  doc.text(`${branchName}`, 155, 125, null, null, 'center');

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
    `ERP ID: ${reportCardData?.student_details?.erp_id}`,
    155,
    163,
    null,
    null,
    'center'
  );

  doc.text(
    `Grade: ${reportCardData?.student_details?.grade} , ${reportCardData?.student_details?.section}`,
    155,
    173,
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
    doc.text(`${eachReportCardData?.component_name}`, 30, 20, null, null, 'left');

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
          data.cell.styles.cellPadding = { top: 2.8, right: 11, bottom: 3.4, left: 5 };
        } else {
          data.cell.styles.halign = 'center';
          data.cell.styles.cellPadding = { top: 2.8, bottom: 3.4 };
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
      styles: { fontSize: 12.5, lineColor: [155, 155, 155], lineWidth: 0.1 },
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
      startY: 27,
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
      y = 192;

      doc.setFillColor(255, 255, 255);
      doc.rect(95, 186, 68, 30, 'F');

      doc.setFontSize(18);
      doc.setFont('LoveYaLikeASister-Regular', 'normal');
      doc.setTextColor(255, 112, 131);
      doc.text(`Achievement Indicators`, 30, y, null, null, 'left');
      // y += 10

      doc.setFillColor(0, 253, 43);
      doc.rect(30, 194, 57, 10, 'F');

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11.2);
      doc.setFont('Karla-VariableFont_wght', 'normal');
      doc.text(`EE - Exceeding Expectations`, 32, 200, null, null, 'left');

      doc.setFillColor(251, 171, 0);
      doc.rect(87, 194, 57, 10, 'F');
      doc.text(`ME - Meeting Expectations`, 89, 200, null, null, 'left');

      doc.setFillColor(170, 192, 71);
      doc.rect(144, 194, 63, 10, 'F');
      doc.text(`AE - Approaching Expectations`, 146, 200, null, null, 'left');

      doc.setFillColor(255, 0, 43);
      doc.rect(207, 194, 43, 10, 'F');
      doc.text(`NS - Needs Support`, 209, 200, null, null, 'left');
    }
  }

  doc.deletePage(pageCount);
  doc.setProperties({
    title: `${reportCardData?.student_details?.name}- ${reportCardData?.student_details?.erp_id}`,
  });
  window.open(doc.output('bloburl'));
};

export default EypReportCardPdf;
