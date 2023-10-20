import axiosInstance from 'config/axios';

const token = JSON.parse(localStorage.getItem('userDetails'))?.token || null;
let addProfanityWords = [];
const getWords = async () => {
  if (token != null) {
    axiosInstance
      .get(`/assessment/check-sys-config/?config_key=profanity-words`)
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
  console.log(addProfanityWords);
  var profanity = require('profanity-hindi');
  var newWords = addProfanityWords;
  profanity.addWords(newWords);
  var cleaned = profanity.isMessageDirty(message);
  console.log(cleaned, 'profanity');
  return cleaned;
};

export { Profanity };
