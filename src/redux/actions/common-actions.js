/* eslint-disable import/prefer-default-export */
import axios from '../../config/axios';

export const uploadFile = async (file) => {
  try {
    const response = await axios.post('/academic/upload-question-file/', file);
    return response.data.data.path;
  } catch (error) {
    throw new Error(error);
  }
};
