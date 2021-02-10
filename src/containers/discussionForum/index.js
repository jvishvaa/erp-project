import React from 'react';
import CategoryPage from './discussion/CategoryPage';
import Category from './discussion/Category';
import DiscussionFilter from './discussion/DiscussionFilter';
import { discussionData } from './discussion/discussionData';
import Discussion from './discussion/Discussion';
import DiscussionPost from './discussion/DiscussionPost';
import Layout from '../Layout/index';



const Discussionforum = () => {
    const totalDiscussion = discussionData.length;
    const rowData = discussionData[0];
    return (
        <>
            <Layout>
                <DiscussionFilter totalDiscussion={totalDiscussion}/>
                
                <Category />
                <DiscussionPost rowData={rowData}/>
                {/*
                <CategoryPage />
                */}
            </Layout>
        </>
    )
}
export default Discussionforum;