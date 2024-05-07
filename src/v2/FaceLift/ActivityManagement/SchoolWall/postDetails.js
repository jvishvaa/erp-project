import React, { useState, useEffect } from 'react';


const PostDetails = () => {
//   let { postId } = useParams();
  const [postDetails, setPostDetails] = useState(false);

  const fetchPostDetails = () => {};
  useEffect(() => {
    fetchPostDetails({});
  }, [window.location.pathname]);
  return <>asdsads</>;
};

export default PostDetails;
