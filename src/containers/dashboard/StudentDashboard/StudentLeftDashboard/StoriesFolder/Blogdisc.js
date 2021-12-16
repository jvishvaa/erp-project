import React, { useEffect, useState } from 'react';
import Blog from './Blog';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Masonry from 'react-masonry-css'
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles(() => ({
  my_masonry_grid: {
    // display: -webkit-box; /* Not needed if autoprefixing */
    // display: -ms-flexbox; /* Not needed if autoprefixing */
    display: 'flex',
    marginLeft: '-10px',
    width: 'auto',

  },
  my_masonry_grid_column: {
    paddingLeft: '10px', /* gutter size */
    backgroundClip: 'paddingBox',
  },

  /* Style your items */
  'my_masonry_grid_column > div': { /* change div to reference your elements you put in <Masonry> */
    background: 'grey',
    marginBottom: '30px',
  }
}));

const Blogdisc = (props) => {
  const classes = useStyles();
  const [Blogdata, setBlogdata] = React.useState([]);
  const [next, setNext] = React.useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  // const [prev, setPrev] = React.useState();

  const getBlogData = () => {
    apiRequest('get', endpoints.dashboard.student.blogdata, null, null, true, 5000)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setIsEnabled(result?.data?.data?.is_enabled);
          setBlogdata(result?.data?.data?.results);
          setNext(result?.data?.data?.next);
          // setAlert('success', result.data.message)
        }
      })
      .catch((error) => {
        console.log('error');
        // setAlert('error', 'Failed to mark attendance');
      });
  };

  useEffect(() => {
    getBlogData();
  }, []);

  function extractContent(s) {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  const breakpoints = {
    default: 2,
    1024: 1,
  }

  const fetchData = () => {
    apiRequest('get', `${endpoints.dashboard.student.nextBlogdata}${next.split('page=')[1]}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBlogdata([...Blogdata, ...result?.data?.data?.results]);
          setNext(result?.data?.data?.next);
        }
      })
      .catch((error) => {
        console.log('error');
        // setAlert('error', 'Failed to mark attendance');
      });
  };

  const likes = (postId, type) => {



    let url, method, params;
    if (type === 'Blog') {
      url = endpoints.dashboard.student.blogLike;
      method = 'post'
      params = {
        blog_id: postId
      };
    }
    else {
      url = `${endpoints.dashboard.student.dicussionLike}${postId}/post-like/`;
      method = 'put'
    }

    apiRequest(method, url, params)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          console.log("post like")
        }
      })
      .catch((error) => {
        console.log('Failed to like post');
      });
  }

  return (
    <div className={classes.box}>
      <h2>Stories, Blog, Discussion and more...</h2>
      <InfiniteScroll
        dataLength={Blogdata?.length}
        next={fetchData}
        hasMore={next}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>{'Yay! You have seen it all'}</b>
          </p>
        }
        height={500}
      >

        <Masonry
          breakpointCols={breakpoints}
          className={classes.my_masonry_grid}
          columnClassName={classes.my_masonry_grid_column}>
          {isEnabled ? (Blogdata &&
            Blogdata.map((blogandd = {}) => {
              return (

                <Blog
                  postId={blogandd?.post_id}
                  key={blogandd?.post_id}
                  user={blogandd?.author?.name}
                  role_branch={blogandd?.author?.branch}
                  time={blogandd?.relative_time}
                  // data={ReactHtmlParser(blogandd.description)}
                  data={extractContent(blogandd?.description)}
                  img={blogandd?.media_content?.images}
                  blogtitle={blogandd?.title}
                  likes={blogandd?.action_counts?.likes_count}
                  comments={blogandd?.action_counts?.comments_count}
                  type={blogandd?.post_type}
                  award={blogandd?.action_counts?.awards_count}
                  c_like={likes}
                  likestatus={blogandd?.user_actions?.liked}
                />
              );
            })) :
            [1, 2].map((i) => (
              <Blog
                postId={1}
                key={1}
                user={''}
                role_branch={''}
                time={''}
                // data={ReactHtmlParser(blogandd.description)}
                data={extractContent('')}
                // img={blogandd?.media_content?.images}
                blogtitle={'Temporarily Disabled'}
                likes={''}
                comments={''}
                type={'Discussion'}
                // award={blogandd?.action_counts?.awards_count}
                c_like={false}
                likestatus={false}
                isEnabled={isEnabled}
              />
            ))
          }
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};

export default Blogdisc;