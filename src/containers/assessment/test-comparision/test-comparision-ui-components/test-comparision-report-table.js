import React from 'react';

const TestComparisionReportTable = ({ dataRows = [] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Total marks</th>
          <th>Obtained marks</th>
          <th>Development</th>
        </tr>
      </thead>
      <tbody>
        {dataRows.map((data) => (
          <tr key={`row--${data.test_id}`}>
            <td>{data.test_id}</td>
            <td>{data.test__total_mark}</td>
            <td>{data.obtained_marks}</td>
            <td>0</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TestComparisionReportTable;
