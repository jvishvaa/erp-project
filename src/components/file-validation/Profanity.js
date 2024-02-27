import axiosInstance from 'config/axios';
import endpoints from 'v2/config/endpoints';
const token = JSON.parse(localStorage.getItem('userDetails'))?.token || null;
let addProfanityWords = [];
const getWords = async () => {
  if (token != null) {
    axiosInstance
      .get(`${endpoints.academics.profanity}`)
      .then((response) => {
        if (response?.data?.status_code == '200') {
          console.log(response, 'config data');
          addProfanityWords = response?.data?.result;
        }
      })
      .catch((error) => {
        console.log('Error fetching config data:', error);
      });
  }
};
getWords();

const Profanity = (message) => {
  if (message) {
    message = message.trim().replace(/\s+/g, ' '); // Remove extra spaces
    const words = message.split(',').map((word) => word.trim()); // Split message by commas and trim each word
    const profanity = require('profanity-hindi');
    const newWords = addProfanityWords;
    profanity.addWords(newWords);

    let cleaned = false;
    words.forEach((word) => {
      if (typeof word === 'string' && word.length > 0 && profanity.isMessageDirty(word)) {
        cleaned = true;
      }
    });

    console.log(cleaned, 'profanity');
    return cleaned;
  }
};

export { Profanity };
