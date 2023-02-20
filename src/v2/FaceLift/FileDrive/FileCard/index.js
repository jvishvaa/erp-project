import React from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { Card, Popconfirm, Badge, Tag } from 'antd';
import moment from 'moment';
import PdfImage from 'v2/Assets/images/pdfIcon.png';
import ExcelImage from 'v2/Assets/images/excelIcon.png';
import VideoImage from 'v2/Assets/images/videoIcon.png';
import ZipImage from 'v2/Assets/images/zipIcon.png';
import MusicImage from 'v2/Assets/images/musicImage.png';
import PptImage from 'v2/Assets/images/pptImage.png';
import FileImage from 'v2/Assets/images/fileIcon.png';

const { Meta } = Card;

const FileCard = (props) => {
  let eachFile = props.eachFile;

  var filePreview;
  switch (eachFile?.file_type) {
    case 'pdf':
      filePreview = PdfImage;
      break;
    case 'xlsx':
      filePreview = ExcelImage;
      break;
    case 'xls':
      filePreview = ExcelImage;
      break;
    case 'csv':
      filePreview = ExcelImage;
      break;
    case 'mp4':
      filePreview = VideoImage;
      break;
    case 'mp3':
      filePreview = MusicImage;
      break;
    case 'zip':
      filePreview = ZipImage;
      break;
    case 'ppt':
      filePreview = PptImage;
      break;
    case 'png':
      filePreview = eachFile?.file;
      break;
    case 'jpg':
      filePreview = eachFile?.file;
      break;
    case 'jpeg':
      filePreview = eachFile?.file;
      break;

    default:
      filePreview = FileImage;
  }

  return (
    <>
      {!props.isEdited ? (
        <Badge.Ribbon
          text={
            eachFile?.category?.name?.length > 20
              ? eachFile?.category?.name?.substring(0, 20) + '..'
              : eachFile?.category?.name
          }
          title={eachFile?.category?.name}
          color='#e2eaff'
        >
          <Card
            className='th-file-upload-card'
            style={{
              borderRadius: '10px',
              padding: '5px',
            }}
            cover={
              <div
                style={{
                  backgroundImage: `url(${filePreview})`,
                  height: '150px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px',
                }}
              ></div>
            }
            actions={[
              <EyeOutlined
                key='view'
                onClick={() => {
                  window.open(eachFile?.file);
                }}
              />,

              <EditOutlined key='edit' onClick={(e) => props.handleEdit(eachFile.id)} />,

              <Popconfirm
                key='delete1'
                title='Sure to delete?'
                onConfirm={(e) => props.handleDelete(eachFile.id)}
              >
                <DeleteOutlined key='delete1' />
              </Popconfirm>,
            ]}
          >
            <Meta
              title={eachFile?.file_name}
              description={
                <>
                  <div className='th-12'>Uploaded By: {eachFile?.added_by?.username}</div>
                  <div className='th-12'>
                    {moment(eachFile?.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                  </div>
                </>
              }
            />
          </Card>
        </Badge.Ribbon>
      ) : (
        <Badge.Ribbon text={props.version} color='#e2eaff' className='mb-2'>
          <Card
            className='th-file-upload-card'
            style={{
              borderRadius: '10px',
              padding: '5px',
            }}
            cover={
              <div
                style={{
                  backgroundImage: `url(${filePreview})`,
                  height: '150px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px',
                }}
              ></div>
            }
            actions={
              props.isCurrent
                ? [
                    <EyeOutlined
                      key='view'
                      onClick={() => {
                        window.open(eachFile?.file);
                      }}
                    />,
                  ]
                : [
                    <EyeOutlined
                      key='view'
                      onClick={() => {
                        window.open(eachFile?.file);
                      }}
                    />,

                    <DeleteOutlined
                      key='delete'
                      onClick={(e) => props.handleDelete(eachFile.id)}
                    />,
                  ]
            }
          >
            <Meta
              description={
                <>
                  <div className='th-12'>Uploaded By: {eachFile?.added_by?.username}</div>
                  <div className='th-12'>
                    {moment(eachFile?.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                  </div>
                </>
              }
            />
          </Card>
        </Badge.Ribbon>
      )}
    </>
  );
};

export default FileCard;
