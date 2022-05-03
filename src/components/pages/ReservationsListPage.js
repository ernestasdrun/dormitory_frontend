import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { AppBarEmployee } from '../AppBarEmployee';
import { CheckoutForm } from '../CheckoutForm';
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
import EditIcon from '@mui/icons-material/Edit';
import EuroIcon from '@mui/icons-material/Euro';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import '../../App.css'

const stripePromise = loadStripe("pk_test_51KvQTcDUppirLbInEaeKDbh2PVoJYvpEzklG1S8ohxBNGP9x1h90FZNQH9n97zoF0sY0mZS9maVy4tDIAvtfGuKk00zc6fG0WJ");

  export default function ReservationsListPage() {

    ////////////////////STRIPE payment
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      fetch("http://localhost:5000/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
      theme: 'stripe',
    };
    const options = {
      clientSecret,
      appearance,
    };
    ////////////////////////////////

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const[roomInfo, setRoomInfo] = useState({
      maxResidents: "",
      residents: ""
    }
    ); 
    function setRoomData(newElement) {
        setRoomInfo(newElement);
    }
  
    const Input = styled('input')({
      display: 'none',
    });

    const[userFileInfo, setUserFileInfo] = useState({
      user_id: "",
      room_id: "",
      _id: "",
      firstName: "",
      surname: "",
      dorm: "",
      room: "",
      floor: "",
      status: ""
  }); 

    const statusAll = ["Nepatvirtinta", "Sutarties pasirašymas", "Laukiama depozito", "Apgyvendinimas", "Įvikdyta", "Atšaukta"]
    
    useEffect(() => {
      if (localStorage.getItem('userType') == 10) {
        fetch(`http://localhost:5000/reservations/getList/${localStorage.getItem('user')}`, {
          method: "POST"
        })
        .then(response => {
            return response.json()})
        .then(resListInform => {
          for (var index = 0; index <  resListInform.length; index++) {
            console.log("data: " + resListInform[index].roomNum);
            setResData(resListInform[index]);
          }
            
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      if (localStorage.getItem('userType') == 20) {
        fetch(`http://localhost:5000/reservations/getList`, {
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
        console.log(waiting);
        createDataTable();
      }
    }, [resListInfo]);

    function createData(number, user_id, room_id, _id, firstName, surname, dorm, room, floor, status) {
        return {
          user_id,
          room_id,
          number,
          _id,
          firstName,
          surname,
          dorm,
          room,
          floor,
          status,
        };
      }
      
      function createDataTable() {
        for (var index = 0; index <  resListInfo.length; index++) {
          setTableData(createData(index, resListInfo[index].user_id, resListInfo[index].room_id, resListInfo[index]._id, resListInfo[index].firstName, resListInfo[index].surname,  resListInfo[index].dormNum,  resListInfo[index].roomNum,  resListInfo[index].floorNum,  resListInfo[index].status));
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
          id: 'firstName',
          numeric: false,
          disablePadding: true,
          label: 'Vardas',
        },
        {
          id: 'surname',
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
          id: 'floor',
          numeric: true,
          disablePadding: false,
          label: 'Aukštas',
        },
        {
          id: 'status',
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
                Rezervacijų sąrašas
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
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
  
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

    const handleSubmit = (e) => {
      const json = JSON.stringify(selectedInfo);
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
        uploadFile(e);
    }

    const showFile = async (e) => {
      await axios
      .get("http://localhost:5000/documents/getFiles", {
        responseType: "blob",

      })
      .then((response) => {
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         const pdfWindow = window.open();
         pdfWindow.location.href = fileURL;            
      })
      .catch((error) => {
        console.log(error);
      });

      handleSubmit();
    }

    const uploadFile = async (e) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);
      console.log("appended: " + formData.get('file'));
      try {
        const res = await axios.post(
          `http://localhost:5000/documents/create/${selectedInfo.user_id}/${selectedInfo._id}`,
          formData
        );
        console.log(res);
      } catch (ex) {
        console.log(ex);
      }
    };


    //???????????????????????????
    const[selectedInfo, setSelectedInfo] = useState({
      user_id: "",
      room_id: "",
      _id: "",
      firstName: "",
      surname: "",
      dorm: "",
      room: "",
      floor: "",
      status: ""
  }); 

  function SetSelectedInfoData(event) {
    setSelectedInfo(prevFormData =>  {
        return {
            ...prevFormData,
            [event.target.name]: event.target.value
        }
    })
}

  function SetSelectedData(event, user_id, room_id, _id, firstName, surname, dorm, room, floor, status) {
      setSelectedInfo(prevFormData =>  {
          return {
            user_id: user_id,
            room_id: room_id,
            _id: _id,
            firstName: firstName,
            surname: surname,
            dorm: dorm,
            room: room,
            floor: floor,
            status: status
          }
      })
  }
  //??????????????????????????

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  
    const handleClick = (event, number) => {

      console.log("kambarys: " + selectedInfo.room_id);
      fetch(`http://localhost:5000/rooms/getRoom/${selectedInfo.room_id}`, {
          method: "GET"
        })
        .then(response => {
            return response.json()})
        .then(roomInform => {
          setRoomData(roomInform[0]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    useEffect(() => {
      if (selectedInfo.room_id != "") {
        handleClick();
      }
    }, [selectedInfo]);

    useEffect(() => {
      if (roomInfo.maxResidents != "") {
        console.log("ID: " + roomInfo._id);
        setOpen(true);
      }
    }, [roomInfo]);
  
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
        <ResponsiveAppBar />
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
                          onClick={(event) => SetSelectedData(event, row.user_id, row.room_id, row._id, row.firstName, row.surname, row.dorm, row.room, row.floor, row.status)}
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
                          <TableCell align="right">{row.firstName}</TableCell>
                          <TableCell align="right">{row.surname}</TableCell>
                          <TableCell align="right">{row.dorm}</TableCell>
                          <TableCell align="right">{row.room}</TableCell>
                          <TableCell align="right">{row.floor}</TableCell>
                          <TableCell align="right">{row.status}</TableCell>
                          <TableCell style={{display: row.status == "Laukiama depozito" ? 'block' : 'none' }}>
                            <Button variant="contained" endIcon={<EuroIcon />} >
                              Sumokėti depozitą
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[50, 100, 200]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Dialog open={open} onClose={handleClose}>
        {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
        )}
        </Dialog>
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
                          <TableCell align="right" name="firstName">{row.firstName}</TableCell>
                          <TableCell align="right" name="surname">{row.surname}</TableCell>
                          <TableCell align="right" name="dorm">{row.dorm}</TableCell>
                          <TableCell align="right" name="room">{row.room}</TableCell>
                          <TableCell align="right" name="floor">{row.floor}</TableCell>
                          <TableCell align="right" name="status">{row.status}</TableCell>
                          <TableCell align="right">
                            <IconButton aria-label="delete" size="large" onClick={(event) => SetSelectedData(event, row.user_id, row.room_id, row._id, row.firstName, row.surname, row.dorm, row.room, row.floor, row.status)}>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[50, 100, 200]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Vartotojo {selectedInfo.firstName} {selectedInfo.surname} rezervacija</DialogTitle>
            <DialogContent>
              <Box sx={{ minWidth: 100, maxWidth: 500 }}>
                <h5>Visas kambario vietų skaičius: {roomInfo.maxResidents}</h5>
                <h5>Užimtų vietų skaičius: {roomInfo.residents}</h5>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Pasirinkite rezervacijos būseną</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="status"
                name="status"
                onChange={SetSelectedInfoData}
                >
                {statusAll.map((status, index) =>
                <MenuItem key={index} value={status}>{status}</MenuItem>
                )}
                </Select>
                </FormControl>
              </Box>
              <label htmlFor="contained-button-file">
                <h5>Sutarties vartotojui įkėlimas</h5>
                <Input accept='application/pdf' id="contained-button-file" type="file" name="file" onChange={changeHandler} />
                <Button variant="contained" component="span">
                Įkelti sutartį
                </Button>
                {isFilePicked ? (
				          <div>
					        <p>Pavadinimas: {selectedFile.name}</p>
				          </div>
			          ) : (
				          <p></p>
			          )}
              </label>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Atšaukti</Button>
              <Button onClick={handleSubmit}>Pateikti duomenis</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    
  }
  