import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { AppBarEmployee } from '../AppBarEmployee';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import '../../App.css'

  
  export default function UserBills() {
    
    useEffect(() => {
      if (localStorage.getItem('userType') == 10) {
        fetch(`http://localhost:5000/bills/getList/${localStorage.getItem('user')}`, {
          method: "GET"
        })
        .then(response => {
            return response.json()})
        .then(resListInform => {
            console.log("TTTT: " + resListInform.result[1]);
          for (var index = 0; index <  resListInform.result.length; index++) {
            setResData([resListInform.roomNumber, resListInform.dormAddress, resListInform.user, resListInform.result[index]]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      else if (localStorage.getItem('userType') == 20) {
        fetch(`http://localhost:5000/bills/getList`, {
          method: "GET"
        })
        .then(response => {
            return response.json()})
        .then(resListInform => {
          for (var index = 0; index <  resListInform.length; index++) {
            setResData(resListInform[index]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      setWaitingData(false);
    }, []);

    const[waiting, setWaitingInfo] = useState(true);
    function setWaitingData(newElement) {
      setWaitingInfo(newElement);
    }

    const[resListInfo, setResListInfo] = useState([]);
    function setResData(newElement) {
        setResListInfo(resListInfo => [...resListInfo, newElement]);
    }

    useEffect(() => {
      if (waiting == false) {
        console.log(resListInfo);
        createDataTable();
      }
    }, [resListInfo]);

    function createData(number, user_id, userName, userSurname, _id, dormAddress, roomNumber, dateCreated, deadlineDate, totalAmount, isPaid) {
        return {
          number,
          user_id,
          userName,
          userSurname,
          _id,
          dormAddress,
          roomNumber,
          dateCreated,
          deadlineDate,
          totalAmount,
          isPaid
        };
      }
      
      function createDataTable() {
        for (var index = resListInfo.length - 1; index >= 0; index--) {
            let date = new Date(resListInfo[index][3].dateCreated);
            let dateLast = new Date(resListInfo[index][3].deadlineDate);
            setTableData(createData(index, resListInfo[index][2][0].user_id, resListInfo[index][2][0].firstName, resListInfo[index][2][0].surname, resListInfo[index][3]._id, resListInfo[index][1], resListInfo[index][0], date.toISOString().split('T')[0], dateLast.toISOString().split('T')[0], resListInfo[index][3].totalAmount, resListInfo[index][3].isPaid));
        }
      }

      const[rows, setTableInfo] = useState([]);
      function setTableData(newElement) {
        setTableInfo(rows => [...rows, newElement]);
      }
      
      function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
      
      function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }
      
      // This method is created for cross-browser compatibility, if you don't
      // need to support IE11, you can use Array.prototype.sort() directly
      function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }
      
      const headCells = [
        {
          id: 'number',
          numeric: false,
          disablePadding: true,
          label: 'Nr',
        },
        {
          id: 'userName',
          numeric: false,
          disablePadding: true,
          label: 'Vardas',
        },
        {
          id: 'userSurname',
          numeric: true,
          disablePadding: false,
          label: 'Pavardė',
        },
        {
          id: 'dorm',
          numeric: true,
          disablePadding: false,
          label: 'Bendrabutis',
        },
        {
          id: 'room',
          numeric: true,
          disablePadding: false,
          label: 'Kambarys',
        },
        {
            id: 'date',
            numeric: true,
            disablePadding: false,
            label: 'Sąskaitos data',
        },
        {
            id: 'deadlineDate',
            numeric: true,
            disablePadding: false,
            label: 'Sumokėti iki',
        },
        {
            id: 'totalAmount',
            numeric: true,
            disablePadding: false,
            label: 'Iš viso (Eur)',
          },
      ];
      
      function EnhancedTableHead(props) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
          props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };
      
        return (
          <TableHead>
            <TableRow>
      
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      }
      
      EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
      };
      
      const EnhancedTableToolbar = (props) => {
        const { numSelected } = props;

      
        return (
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(numSelected > 0 && {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              }),
            }}
          >
              <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Turimos sąskaitos
              </Typography>

              <Tooltip title="Filtruoti">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
          </Toolbar>
        );
      };
      
      EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
      };



    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('surname');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = rows.map((n) => n.number);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };


    const [open, setOpen] = React.useState(false);


    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const isSelected = (number) => selected.indexOf(number) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

      if (localStorage.getItem('userType') == 10) {
        return (
          <div className="text-center m-0">
          <AppBarEmployee />
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 350 }}
                  aria-labelledby="tableTitle"
                  size={'small'}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {stableSort(rows, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;
      
                        return (
                          <TableRow
                            hover
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.number}
                            selected={isItemSelected}
                          >
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.number}
                            </TableCell>
                            <TableCell align="right" name="userName">{row.userName}</TableCell>
                            <TableCell align="right" name="userSurname">{row.userSurname}</TableCell>
                            <TableCell align="right" name="fileName">{row.dormAddress}</TableCell>
                            <TableCell align="right" name="userSurname">{row.roomNumber}</TableCell>
                            <TableCell align="right" name="userSurname">{row.dateCreated}</TableCell>
                            <TableCell align="right" name="userSurname">{row.deadlineDate}</TableCell>
                            <TableCell align="right" name="userSurname">{row.totalAmount.toFixed(2)}</TableCell>
                            <TableCell align="right" name="isPaid" bgcolor={row.isPaid ? "#6fd466" : "#e6735c"}>{row.isPaid ? "Sumokėta" : "Nesumokėta"}</TableCell>
                            <TableCell style={{display: row.isPaid ? 'none' : 'block' }}>
                              <Button variant="contained" endIcon={<BorderColorIcon />} >
                                Sumokėti
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
          <button onClick={() => {console.log(rows)}}>test</button>
          </div>
        );
      } else {
        return (
          <div className="text-center m-0">
          <AppBarEmployee />
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 350 }}
                  aria-labelledby="tableTitle"
                  size={'small'}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {stableSort(rows, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;
      
                        return (
                          <TableRow
                            hover
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.number}
                            selected={isItemSelected}
                          >
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.number}
                            </TableCell>
                            <TableCell align="right" name="userName">{row.userName}</TableCell>
                            <TableCell align="right" name="userSurname">{row.userSurname}</TableCell>
                            <TableCell align="right" name="fileName">{row.dormAddress}</TableCell>
                            <TableCell align="right" name="userSurname">{row.roomNumber}</TableCell>
                            <TableCell align="right" name="userSurname">{row.dateCreated}</TableCell>
                            <TableCell align="right" name="userSurname">{row.deadlineDate}</TableCell>
                            <TableCell align="right" name="userSurname">{row.totalAmount}</TableCell>
                            <TableCell align="right" name="isSigned" bgcolor={row.isPaid ? "#6fd466" : "#e6735c"}>{row.isPaid ? "Sumokėta" : "Nesumokėta"}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
          </div>
        );
      }
    
  }
  