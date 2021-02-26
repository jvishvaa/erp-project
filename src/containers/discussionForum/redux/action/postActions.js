import { DISCUSSION_POST } from './types';

export const postAction = (data) => {
  return {
    type: DISCUSSION_POST,
    payload: data,
  };
};
