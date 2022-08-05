import React from 'react';
import { Table } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';

const TableViewData = [
  {
    chapter: 'Real Numbers',
    period: 14,
    concepts: 11,
    id: 1,
  },
  {
    chapter: 'Fake Numbers',
    period: 14,
    concepts: 11,
    id: 2,
  },
  {
    chapter: 'Real Numbers',
    period: 14,
    concepts: 11,
    id: 3,
  },
  {
    chapter: 'Fake Numbers',
    period: 14,
    concepts: 11,
    id: 4,
  },
  {
    chapter: 'Real Numbers',
    period: 14,
    concepts: 11,
    id: 5,
  },
  {
    chapter: 'Fake Numbers',
    period: 14,
    concepts: 11,
    id: 6,
  },
];

const columns = [
  {
    title: <span className='th-white pl-4 th-fw-700 '>CHAPTER</span>,
    dataIndex: 'chapter',
    width: '25%',
    align: 'left',
    render: (data) => <div className='pl-4 th-black-1'>{data}</div>,
  },
  {
    title: <span className='th-white th-fw-700'>KEY CONCEPTS</span>,
    dataIndex: 'concepts',
    width: '50%',
    align: 'center',
    render: (data) => <span className='th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
    dataIndex: 'period',
    width: '20%',
    align: 'center',
    render: (data) => <span className='th-black-1'>{data}</span>,
  },
];

const TableView = () => {
  const expandedRowRender = () => {
    const innerColumn = [
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '25%',
      },
      {
        title: '',
        dataIndex: 'concept',
        align: 'left',
        width: tableWidthCalculator(50) + '%',
        key: 'concept',
        id: 2,
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: '',
        dataIndex: 'period',
        align: 'center',
        width: '20%',
        key: 'prsent',
        id: 3,
        render: (data) => <span className='th-black-2'>{data}</span>,
      },

      {
        title: '',
        align: 'center',
        width: '5%',
      },
    ];

    const data = [
      {
        concept: 'Fundamental Theorm of Arithmetics Typical Problems',
        period: 1,
      },
      {
        concept: 'Fundamental Theorm of Arithmetics Typical Problems',
        period: 1,
      },
      {
        concept: 'Fundamental Theorm of Arithmetics Typical Problems',
        period: 1,
      },

      {
        concept: 'Fundamental Theorm of Arithmetics Typical Problems',
        period: 1,
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={data}
        rowKey={(record) => record?.id}
        pagination={false}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <div className='row th-16 py-3 px-2'>
      <div className='col-12'>
        <Table
          className='th-table'
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
          columns={columns}
          rowKey={(record) => record?.id}
          expandable={{ expandedRowRender }}
          dataSource={TableViewData}
          pagination={false}
          expandIconColumnIndex={3}
          expandIcon={({ expanded, onExpand, record }) =>
            expanded ? (
              <UpOutlined className='th-black-1' onClick={(e) => onExpand(record, e)} />
            ) : (
              <DownOutlined className='th-black-1' onClick={(e) => onExpand(record, e)} />
            )
          }
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default TableView;
