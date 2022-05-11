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

  
  export default function DocumentPage() {

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const Input = styled('input')({
      display: 'none',
    });

    const [fileArrayBuffer, setFileArrayBuffer] = useState();
    function setArrayBufferData(newElement) {
      setFileArrayBuffer(newElement);
  }

    const[userFileInfo, setUserFileInfo] = useState({
      user_id: "",
      room_id: "",
      userName: "",
      userSurname: "",
      _id: "",
      firstName: "",
      surname: "",
      status: ""
  }); 

    const statusAll = ['Nepasirašyta', 'Pasirašyta']
    
    useEffect(() => {
      if (localStorage.getItem('userType') == 10) {
        fetch(`http://localhost:5000/documents/getList/${localStorage.getItem('user')}`, {
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
      else if (localStorage.getItem('userType') == 20) {
        fetch(`http://localhost:5000/documents/getFiles`, {
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

    function createData(number, user_id, reservation_id, _id, userName, userSurname, fileName, isSigned) {
        return {
          user_id,
          reservation_id,
          number,
          _id,
          userName,
          userSurname,
          fileName,
          isSigned,
        };
      }
      
      function createDataTable() {
        for (var index = 0; index <  resListInfo.length; index++) {
          setTableData(createData(index, resListInfo[index].user_id, resListInfo[index].reservation_id, resListInfo[index]._id, resListInfo[index].userName, resListInfo[index].userSurname, resListInfo[index].fileName, resListInfo[index].isSigned));
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
          id: 'view',
          numeric: false,
          disablePadding: true,
          label: '',
        },
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
          id: 'fileName',
          numeric: true,
          disablePadding: false,
          label: 'Dokumentas',
        },
        {
          id: 'isSigned',
          numeric: true,
          disablePadding: false,
          label: 'Būsena',
        }
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
                Įkelti dokumentai
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

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleSubmit = () => {

    }


    const showFile = async (id) => {
      await axios
      .get(`http://localhost:5000/documents/getFullFile/${id}`, {
        responseType: 'blob'

      })
      .then(response => {
        //console.log("response: " + response[0]._id);
        setArrayBufferData(response.data);
        //Create a Blob from the PDF Stream
        //const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        //const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         //window.open(fileURL);
         //pdfWindow.location.href = fileURL;            
      })
      .catch((error) => {
        console.log(error);
      });

    }

    const submitSigning = (doc_id, res_id) => {
      console.log(res_id);

      const jsonDoc = JSON.stringify({
        _id: doc_id,
        isSigned: true
    });
      fetch(`http://localhost:5000/documents/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonDoc,
        })
        .then(response => console.log(response.json()))
        .catch((error) => {
          console.error("Error:", error);
        });

      const json = JSON.stringify({
        _id: res_id,
        status: "Laukiama depozito"
    });
      fetch(`http://localhost:5000/reservations/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        })
        .then(response => console.log(response.json()))
        .catch((error) => {
          console.error("Error:", error);
        });

    }

    useEffect(() => {
      if (fileArrayBuffer != "") {
        console.log(resListInfo);
        const file = new Blob([fileArrayBuffer], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         window.open(fileURL);
      }
    }, [fileArrayBuffer]);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  
    const handleClick = (event, number) => {
      setOpen(true);

    };
  
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
                            <IconButton aria-label="view" size="large" onClick={() => showFile(row._id)}>
                              <RemoveRedEyeIcon />
                            </IconButton>
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
                            <TableCell align="right" name="fileName">{row.fileName}</TableCell>
                            <TableCell align="right" name="isSigned" bgcolor={row.isSigned ? "#6fd466" : "#e6735c"}>{row.isSigned ? "Pasirašyta" : "Nepasirašyta"}</TableCell>
                            <TableCell style={{display: row.isSigned ? 'none' : 'block' }}>
                              <Button variant="contained" endIcon={<BorderColorIcon />} onClick={() => {submitSigning(row._id, row.reservation_id)}}>
                                Pasirašyti
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
                            <IconButton aria-label="view" size="large" onClick={() => showFile(row._id)}>
                              <RemoveRedEyeIcon />
                            </IconButton>
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
                            <TableCell align="right" name="fileName">{row.fileName}</TableCell>
                            <TableCell align="right" name="isSigned" bgcolor={row.isSigned ? "#6fd466" : "#e6735c"}>{row.isSigned ? "Pasirašyta" : "Nepasirašyta"}</TableCell>
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
  