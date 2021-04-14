import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import CategoryCard from './CategoryCard';
import CategoryEdit from './CategoryEdit';
import DiscussionPagination from './DiscussionPagination';

const useStyles = makeStyles({
  discussionContainer: {
    marginTop: '10px',
  },
});

const DiscussionCategory = (props) => {
  const classes = useStyles({});
  const [editCategory, setEditCategory] = React.useState(false);
  const [categoryGrid, setCategoryGrid] = React.useState(3);
  const [itemGrid, setItemGrid] = React.useState(12);
  const [editData, setEditData] = React.useState({});

  const [showPerPage, setShowPerPage] = React.useState(8);
  const [pagination, setPagination] = React.useState({
    start: 0,
    end: showPerPage,
  });

  const onPaginationChange = (start, end) => {
    console.log(`${start} ---- ${end}`);
    setPagination({
      start,
      end,
    });
  };

  const hadleEditCategory = (data) => {
    setItemGrid(9);
    setCategoryGrid(4);
    setEditCategory(true);
    setEditData(data);
  };

  const hadleCloseCategory = () => {
    setItemGrid(12);
    setCategoryGrid(3);
    setEditCategory(false);
  };

  // const totalCategory = props.rowData.length;

  return (
    <Grid container className={classes.discussionContainer}>
      <Grid item xs={itemGrid}>
        <Grid container>
          {props.rowData.slice(pagination.start, pagination.end).map((data, id) => {
            return (
              (props.tabValue === 'active' && props.tabValue === data.status && (
                <Grid item xs={categoryGrid} key={id}>
                  <CategoryCard
                    id={data.id}
                    status={data.status}
                    category={data.category}
                    subCategory={data.subCategory}
                    subSubCategory={data.subSubCategory}
                    editCategory={hadleEditCategory}
                    isEdit={editCategory}
                  />
                </Grid>
              )) ||
              (props.tabValue === 'inactive' && props.tabValue === data.status && (
                <Grid item xs={categoryGrid} keys={id}>
                  <CategoryCard
                    id={data.id}
                    status={data.status}
                    category={data.category}
                    subCategory={data.subCategory}
                    subSubCategory={data.subSubCategory}
                    editCategory={hadleEditCategory}
                    isEdit={editCategory}
                  />
                </Grid>
              )) ||
              (props.tabValue === 'all' && (
                <Grid item xs={categoryGrid} keys={id}>
                  <CategoryCard
                    id={data.id}
                    status={data.status}
                    category={data.category}
                    subCategory={data.sub_category_name}
                    subSubCategory={data.sub_sub_category_name}
                    editCategory={hadleEditCategory}
                    isEdit={editCategory}
                  />
                </Grid>
              ))
            );
          })}
        </Grid>
      </Grid>
      {editCategory && (
        <Grid item xs={3}>
          <CategoryEdit cardData={editData} hadleClose={hadleCloseCategory} />
        </Grid>
      )}
      <Grid item xs={12}>
        <DiscussionPagination
          showPerPage={showPerPage}
          onPaginationChange={onPaginationChange}
          totalCategory={props.rowData.length}
        />
      </Grid>
    </Grid>
  );
};

export default DiscussionCategory;
