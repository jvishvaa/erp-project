import React, { useState, useEffect ,useRef} from 'react';
import {
    Grid,
    TextField,
    Card,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    Checkbox,
    Button,
    InputBase,
    Paper
  } from '@material-ui/core';
  import { Pagination } from '@material-ui/lab';
  import NoFilterData from 'components/noFilteredData/noFilterData';
  import SearchIcon from '@material-ui/icons/Search';
  import { makeStyles } from '@material-ui/core';

  const useStyles = makeStyles((theme) => ({

    checkbox : {
        height: '20px',
        width : '20px',
        // 'accent-color' : theme.palette.primary.main,
        // border : `1px solid ${theme.palette.primary.main}` 
    }

  }
  ))

  const UserTable = (props) => {
    const classes = useStyles()
    const {
        header,
        rows,
        totalRows,
        changePage,
        setSelectedUsers,
        completeData,
        selectedUsers,
        pageno,
        setSelectAll,
        name,
        showContactInfo,
        selectedBranch
      } = props || {};
      const [selectedIds,setSelectedIds] = useState([])
      const [completeDatacopy , setCompleteDatacopy] = useState([])
      const searchRef = useRef();
      const [isSellectAll,setisSelectAll] = useState(false)


      useEffect(() => {
      if(completeData) setCompleteDatacopy(completeData)

      },[completeData])


      const isSelected = (id) => {
        console.log(pageno,"JK")
        if(selectedUsers.length){
            let res = selectedUsers[pageno -1].selected.indexOf(id) !== -1;
            console.log(res,"JK1")
            return res
        }
        
      }

      const krishhhhh = () =>{
        setisSelectAll(true)
      }

      const handleSelectAll = (e) => {
        console.log('orchids','outside')
        if(e.target.checked){
            console.log('orchids','inside')
            let tempSelect = []
            tempSelect = selectedUsers
           let allSelectedIds =  completeDatacopy.map((item) => item.id)
           tempSelect[pageno - 1].selected = allSelectedIds
           setSelectedUsers(tempSelect)
           setSelectedIds(allSelectedIds)
        //    setisSelectAll(true)
        }else{
            let tempSelect = []
            tempSelect = selectedUsers
            tempSelect[pageno - 1].selected = []
            setSelectedUsers(tempSelect)
            setSelectedIds([])
            // setisSelectAll(false)
        }
      }
      
      const handleSearch = (e) => {
        if(e.target.value.length > 0){
          let filterData = completeData?.filter((item) =>{
            let name = item.data.fullName.toLowerCase()
            if(name.startsWith(e.target.value.toLowerCase()))
                 return item
          })
          setCompleteDatacopy(filterData)
          
        }else{
          setCompleteDatacopy(completeData)
        }
      }

      const handlePagination = (e,page) => {
        changePage(page)
        searchRef.current.value = null
      }


      const handleClick = (event, id) => {
        if (
            selectedUsers.length &&
            // !e.isSelected &&
            selectedUsers[pageno - 1].selected.includes(id)
          ) {
            let tempSelection = [];
            tempSelection = selectedUsers;
            tempSelection[pageno - 1].selected.splice(
              tempSelection[pageno - 1].selected.indexOf(id),
              1
            );
            setSelectedUsers(tempSelection);
          }else{
            let tempSelection = [];
            tempSelection = selectedUsers;
            tempSelection[pageno - 1].selected.push(id);
            setSelectedUsers(tempSelection);
          }
        setSelectedIds([...selectedIds , id])
      };


  return (
  <div>

    {completeData && completeData.length !== 0 ? 
     ( 
        <div>
        <Grid item md={4} style={{marginLeft:'1%'}}>
                  <Paper elevation={3} className='search'>
                    <div>
                      <SearchIcon />
                    </div>
                    <InputBase
                      style={{width:'100%'}}
                      placeholder=' Search'
                      onChange={(e) => handleSearch(e)}
                      inputRef = {searchRef}
                    />
                  </Paper>
        </Grid>

        <Grid item md={12} xs={12} style={{ margin: '0px 10px', padding: '10px' }}>
          <Card style={{ width: '100%', overflow: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell float='left'>
                    Select All
                    <Checkbox
                      onClick={handleSelectAll}
                      checked={
                        (selectedUsers.length && selectedUsers[pageno - 1].selected.length) ===
                        (completeDatacopy &&
                            completeDatacopy?.length)
                      }
                    />
                  </TableCell>
                  {/* <TableCell float='left'>S.No</TableCell> */}
                  {/* <TableCell float='left'>ID</TableCell> */}
                  <TableCell float='left'>Name</TableCell>
                  {/* <TableCell float='left'>Email Id</TableCell> */}
                  <TableCell float='left'>Erp Id</TableCell>
                  <TableCell float='left'>Branch</TableCell>
                  <TableCell float='left'>Grade</TableCell>
                  <TableCell float='left'>Section</TableCell>


                  {/* <TableCell float='left'>Gender</TableCell> */}
                  {/* <TableCell float='left'>Contact</TableCell> */}
                </TableRow>
              </TableHead>

              { completeDatacopy && completeDatacopy.length ? <TableBody>
                { completeDatacopy.map((item, index) => {
                    const isItemSelectedId = isSelected(item.id);
                    // console.log('orchids',isItemSelectedId,)
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, item.id)}
                        role='checkbox'
                        tabIndex={-1}
                        key={item.id}
                        // selected={item.selected}
                        selected={isSelected(item.id)}

                      >
                        <TableCell float='left'>
                          {/* <Checkbox
                            color='primary'
                            checked={isSelected(item.id)}
                            id={item.id}
                            key={item.user.first_name + item.id}
                          /> */}
                          {isItemSelectedId ? <input type='checkbox' className={classes.checkbox} checked /> : <input  type='checkbox' className={classes.checkbox} />}
                        </TableCell>
                        {/* <TableCell float='left'>{index + 1}</TableCell> */}
                        <TableCell float='left'>
                          {(item.data && item.data.fullName) || ''}
                          {/* &nbsp;
                          {(item.user && item.user.last_name) || ''} */}
                        </TableCell>
                        <TableCell float='left'>{item.data.erp_id || ''}</TableCell>

                        <TableCell float='left'>
                          {(item.data && selectedBranch && selectedBranch?.branch_name) || ''}
                        </TableCell>
                       
                        <TableCell float='left'>
                          {(item.data && item.data.section_mapping && item.data.section_mapping[0]?.grade?.grade_name) || ''}
                        </TableCell>
                        <TableCell float='left'>{item.data && item.data.section_mapping && item.data.section_mapping[0]?.section?.section_name || ''}</TableCell>
                        {/* <TableCell float='left'>{item.contact || ''}</TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody> : <caption><NoFilterData data = " No Data Found"/></caption>}
            </Table>
          </Card>
        </Grid>
        </div>
      )
    : <NoFilterData data = "No Data Found" />
    }
        <Grid container justify='center'>
            {completeData && completeData.length > 9 && (
              <Pagination
                // totalPages={totalRows}
                // currentPage={pageno}
                // setCurrentPage={changePage}
                onChange={handlePagination}
                count={Math.ceil(totalRows/15)}
                color='primary'
                page={pageno}
              />
            )}
          </Grid>
  </div>
  )
}
export default UserTable;