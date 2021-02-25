export const types = { DISCUSSION_POST: 'DISCUSSION_POST' };

const { DISCUSSION_POST } = types;

export const postAction = (data) => {
  return {
    type: DISCUSSION_POST,
    payload: data,
  };
};
