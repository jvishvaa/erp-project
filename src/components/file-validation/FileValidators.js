import {FileSize} from '../../config/axios';

const FileValidators = (file) => {
    //const [sizeValied, setSizeValied] = React.useState(false);
    //3145728 5242880
    if(file.name.lastIndexOf('.mp3') > 0 || file.name.lastIndexOf('.mp4') > 0 ){
        if(file.size < FileSize.audio_video){
            const isFileValid = {
                msg: 'Accepted files: jpeg,jpg,mp3,mp4,pdf,png',
                msgColor: '#014b7e',
                isValid: true
            };
            return isFileValid;
        }
        else {
            const isFileValid = {
                msg: 'Document size should be less than 50MB !',
                msgColor: 'red',
                isValid: false
            };
          return isFileValid;
        }
    }
    else if(file.name.lastIndexOf('.pdf') > 0 || file.name.lastIndexOf('.jpeg') > 0 || file.name.lastIndexOf('.jpg') > 0 || file.name.lastIndexOf('.png') > 0 ) {
        if(file.size < FileSize.img_pdf){
            const isFileValid = {
                msg: 'Accepted files: jpeg,jpg,mp3,mp4,pdf,png',
                msgColor: '#014b7e',
                isValid: true
            }
            return isFileValid
        }
        else {
            const isFileValid = {
                msg: 'Document size should be less than 30MB !',
                msgColor: 'red',
                isValid: false
            }
            return isFileValid
        }
    }
    else {
        return false
    }
}

export default FileValidators;