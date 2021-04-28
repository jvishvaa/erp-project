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
  const [categoryGrid, setCategoryGrid] = React.useState(4);
  const [itemGrid, setItemGrid] = React.useState(12);
  const [editData, setEditData] = React.useState();
  const [selected, setSelected] = React.useState(0);

  const [showPerPage, setShowPerPage] = React.useState(12);
  const [pagination, setPagination] = React.useState({
    start: 0,
    end: showPerPage,
  });

  const onPaginationChange = (start, end) => {
    setPagination({
      start,
      end,
    });
  };

  const hadleEditCategory = (data) => {
    setItemGrid(8);
    setCategoryGrid(6);
    setEditCategory(true);
    setEditData(data);
    setSelected(data?.sub_sub_category_id)
  };

  const hadleCloseCategory = () => {
    setItemGrid(12);
    setCategoryGrid(4);
    setEditCategory(false);
    setEditData();
    setSelected(0)
  };

  // const totalCategory = props.rowData.length;

  return (
    <Grid container className={classes.discussionContainer}>
      <Grid item xs={itemGrid}>
        <Grid container>
          {props.rowData.map((data, id) => {
            return (
              (props.tabValue === 'active' && !data.is_delete && (
                <Grid item sm={categoryGrid} xs={12} key={data.sub_sub_category_id}>
                  <CategoryCard
                    id={data.category_id}
                    data={data}
                    selectedId={selected}
                    status={data.is_delete}
                    category={data.category}
                    subCategory={data.sub_category_name}
                    subSubCategory={data.sub_sub_category_name}
                    editCategory={hadleEditCategory}
                    isEdit={editCategory}
                  />
                </Grid>
              )) ||
              (props.tabValue === 'inactive' && data.is_delete && (
                <Grid item sm={categoryGrid} xs={12} keys={data.sub_sub_category_id}>
                  <CategoryCard
                    id={data.category_id}
                    data={data}
                    selectedId={selected}
                    status={data.is_delete}
                    category={data.category}
                    subCategory={data.sub_category_name}
                    subSubCategory={data.sub_sub_category_name}
                    editCategory={hadleEditCategory}
                    isEdit={editCategory}
                  />
                </Grid>
              )) ||
              (props.tabValue === 'all' && (
                <Grid item sm={categoryGrid} xs={12} keys={data.sub_sub_category_id}>
                  <CategoryCard
                    id={data.category_id}
                    data={data}
                    selectedId={selected}
                    status={data.is_delete}
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
        <Grid item sm={4} xs={12}>
          <CategoryEdit cardData={editData} hadleClose={hadleCloseCategory} />
        </Grid>
      )}
    </Grid>
  );
};

export default DiscussionCategory;
