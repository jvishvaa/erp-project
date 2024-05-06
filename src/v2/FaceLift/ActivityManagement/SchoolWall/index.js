import Layout from 'containers/Layout';
import React, { useState } from 'react';
import { Breadcrumb, Empty } from 'antd';
import { dummyPostData } from './dummyData';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './postCard';

const SchoolWall = () => {
  const [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {};

  const handleLikePost = () => {};
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/school-wall' className='th-black'>
              School Wall
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-12 my-3'>
          {dummyPostData?.length > 0 ? (
            <InfiniteScroll
              dataLength={dummyPostData?.length} //This is important field to render the next data
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <span className='mt-4 text-center w-100'>
                  Loading... <i className='fas fa-circle-notch fa-spin th-primary'></i>
                </span>
              }
              endMessage={
                <p className='pt-2 text-center'>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              className='th-scrollbar-hidden'
              // height={"calc(100vh)"}
            >
              {dummyPostData?.map((each) => (
                <PostCard
                  post={each}
                  likePost={() => {
                    handleLikePost(each?.id);
                  }}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <div className='card mt-3 text-center'>
              <div className='card-body align-items-center'>
                <Empty />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SchoolWall;
