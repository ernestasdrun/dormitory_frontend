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
import CancelIcon from '@mui/icons-material/Cancel';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SearchBar from "material-ui-search-bar";
import Chip from '@mui/material/Chip';
import MaterialTable from "material-table";
import tableIcons from "../MaterialTableIcons";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import '../../App.css'

const stripePromise = loadStripe("pk_test_51KvQTcDUppirLbInEaeKDbh2PVoJYvpEzklG1S8ohxBNGP9x1h90FZNQH9n97zoF0sY0mZS9maVy4tDIAvtfGuKk00zc6fG0WJ");

  export default function ReservationsListPage() {


    const [openNotification, setOpenNotification] = useState(false);
    const [receivedSuccess, setReceivedSuccess] = useState(false);

    ////////////////////STRIPE payment
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState("");

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
      createdDate: "",
      startingDate: "",
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

    function createData(number, user_id, room_id, _id, firstName, surname, dorm, room, floor, createdDate, startingDate, status) {
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
          createdDate,
          startingDate,
          status,
        };
      }
      
      function createDataTable() {
        for (var index = 0; index <  resListInfo.length; index++) {
          setTableData(createData(index, resListInfo[index].user_id, resListInfo[index].room_id, resListInfo[index]._id, resListInfo[index].firstName, resListInfo[index].surname,  resListInfo[index].dormNum,  resListInfo[index].roomNum,  resListInfo[index].floorNum, resListInfo[index].createdDate, resListInfo[index].startingDate, resListInfo[index].status));
        }
      }

      const[rows, setTableInfo] = useState([]);
      function setTableData(newElement) {
        setTableInfo(rows => [...rows, newElement]);
      }

    const [open, setOpen] = useState(false);

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
        .then(response => {
          if (response.status == 200) {
            console.log("success");
            setReceivedSuccess(true);
            setOpenNotification(true);
          } else {
            console.log("not success")
            setReceivedSuccess(false);
            setOpenNotification(true);
          }
        })
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
      createdDate: "",
      startingDate: "",
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

  function SetSelectedData(user_id, room_id, _id, firstName, surname, dorm, room, floor, createdDate, startingDate, status) {
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
            createdDate: createdDate,
            startingDate: startingDate,
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

        // Create PaymentIntent as soon as the payment section loads
        fetch("http://localhost:5000/bills/depositPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ room_id: selectedInfo.room_id, res_id: selectedInfo._id, user_id: selectedInfo.user_id }] }),
        })
          .then((res) => res.json())
          .then((data) => {
            setClientSecret(data.clientSecret);
            setAmount(data.amount);
            console.log("data: " + data.amount);});
        setOpen(true);
      }
    }, [roomInfo]);


    function cancelReservation(id) {
      const json = JSON.stringify({
        _id: id,
        status: "Atšaukta"
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
  
  
    if (localStorage.getItem('userType') == 10) {
      return (
        <div className="text-center m-0">
        <ResponsiveAppBar />
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialTable
                icons={tableIcons}
                columns={[
                { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                { title: "Vardas", align: "left", field: "firstName" },
                { title: "Pavardė", align: "left", field: "surname" },
                { title: "Bendrabutis", align: "left", field: "dorm" },
                { title: "Kambarys", align: "left", field: "room" },
                { title: "Aukštas", align: "left", field: "floor" },
                { title: "Sukūrimo data", align: "left", field: "createdDate", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                { title: "Apgyvendinimo pradžia", align: "left", field: "startingDate", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                { title: "Būsena", align: "left", field: "status" },
                { title: "", align: "left",  export: false, filtering: false, field: "status", render: rowData => <Button style={{display: rowData.status == "Laukiama depozito" ? 'block' : 'none' }} variant="contained" endIcon={<EuroIcon />} onClick={() => SetSelectedData(rowData.user_id, rowData.room_id, rowData._id, rowData.firstName, rowData.surname, rowData.dorm, rowData.room, rowData.floor, rowData.status)}>Sumokėti depozitą</Button> },
                { title: "", align: "center", export: false, filtering: false, render: rowData => <IconButton style={{display: rowData.status == "Nepatvirtinta" ? 'block' : 'none' }} aria-label="view" size="large" onClick={(event) => cancelReservation(rowData._id)}><CancelIcon /></IconButton>, filtering: false }
                ]}
                data={rows}
                title="Sukurtos rezervacijos"
                options={{
                  search: true,
                  sorting: true,
                  filtering: true,
                  exportButton: true,
                  pageSizeOptions: [20, 50, 100],
                  pageSize: 20,
                  exportFileName: "Dokumentai",
                  showEmptyDataSourceMessage: "Duomenų nėra",
                  padding: "dense"
                }}
              />
          </Paper>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <h4>Mokėtina suma: {Number(amount).toFixed(2)} Eur</h4>
        {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm user_id={selectedInfo.user_id} room_id={selectedInfo.room_id} res_id={selectedInfo._id} amount={amount}/>
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
              <MaterialTable
                icons={tableIcons}
                columns={[
                { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                { title: "Vardas", align: "left", field: "firstName" },
                { title: "Pavardė", align: "left", field: "surname" },
                { title: "Bendrabutis", align: "left", field: "dorm" },
                { title: "Kambarys", align: "left", field: "room" },
                { title: "Aukštas", align: "left", field: "floor" },
                { title: "Sukūrimo data", align: "left", field: "createdDate", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                { title: "Apgyvendinimo pradžia", align: "left", field: "startingDate", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                { title: "Būsena", align: "left", field: "status" },
                { title: "Keisti", align: "center", export: false, render: rowData => <IconButton aria-label="view" size="large" onClick={() => SetSelectedData(rowData.user_id, rowData.room_id, rowData._id, rowData.firstName, rowData.surname, rowData.dorm, rowData.room, rowData.floor, rowData.status)}><EditIcon /></IconButton>, filtering: false }
                ]}
                data={rows}
                title="Sukurtos rezervacijos"
                options={{
                  search: true,
                  sorting: true,
                  filtering: true,
                  exportButton: true,
                  pageSizeOptions: [20, 50, 100],
                  pageSize: 20,
                  exportFileName: "Dokumentai",
                  showEmptyDataSourceMessage: "Duomenų nėra",
                  padding: "dense"
                }}
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
              <Collapse in={openNotification}>
                <Alert
                  severity={receivedSuccess ? "success" : "error"}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenNotification(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                {receivedSuccess ? "Pakeitimai išsaugoti" : "Keitimas nepavyko"}
              </Alert>
            </Collapse>
          </Dialog>
        </div>
      );
    }
    
  }
  