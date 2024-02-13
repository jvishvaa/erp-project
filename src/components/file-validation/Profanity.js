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
  message = message.trim().replace(/\s+/g, ' ');
  console.log('addProfanityWords', addProfanityWords);
  var profanity = require('profanity-hindi');
  var newWords = addProfanityWords;
  profanity.addWords(newWords);
  var cleaned = profanity.isMessageDirty(message);
  console.log(cleaned, 'profanity');
  return cleaned;
};

export { Profanity };
