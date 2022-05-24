import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { AppBarEmployee } from '../AppBarEmployee';
import Chip from '@mui/material/Chip';
import MaterialTable from "material-table";
import tableIcons from "../MaterialTableIcons";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import {Buffer} from 'buffer';
import EditIcon from '@mui/icons-material/Edit';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import '../../App.css'

export default function FailurePage() {

    const [openNotification, setOpenNotification] = useState(false);
    const [receivedSuccess, setReceivedSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [preview, setPreview] = useState();
    const [openEdit, setEditOpen] = useState(false);
    const statusAll = ["Vykdoma", "Užbaigta", "Atšaukta"]

    const[selectedInfo, setSelectedInfo] = useState({
      fail_id: "",
      user_id: "",
      room_id: "",
      userName: "",
      userSurname: "",
      room: "",
      floor: "",
      dorm: "",
      dateCreated: "",
      dateResolved: "",
      comment: "",
      type: "",
      fStatus: "",
      value: "",
      feeComment: ""
  }); 

  function SetSelectedInfoData(event) {
    setSelectedInfo(prevFormData =>  {
        return {
            ...prevFormData,
            [event.target.name]: event.target.value
        }
    })
}

  function SetSelectedData(fail_id, user_id, room_id, userName, userSurname, room, floor, dorm, dateCreated, dateResolved, comment, type, fStatus, value, feeComment) {
      setSelectedInfo(prevFormData =>  {
          return {
            fail_id: fail_id,
            user_id: user_id,
            room_id: room_id,
            userName: userName,
            userSurname: userSurname,
            room: room,
            floor: floor,
            dorm: dorm,
            dateCreated: dateCreated,
            dateResolved: dateResolved,
            comment: comment,
            type: type,
            fStatus: fStatus,
            value: value,
            feeComment: feeComment
          }
      })
      setEditOpen(true);
  }




    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
      };

    const [open, setOpen] = useState(false);

    const [failureRegValues, setFailureRegValues] = useState({
        image: "",
        type: "",
        comment: ""
    });

    function SetFailureRegData(event) {
        setFailureRegValues(prevFormData =>  {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        SetFailureRegData(e);
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        setSelectedFile(e.target.files[0])
    }



    function handleChangeSubmit() {
      const json = JSON.stringify(selectedInfo);
        fetch(`http://localhost:5000/failures/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
          .then(regInfo => {
            console.log("Success:", regInfo.status);
            if (regInfo.status == 200) {
                setReceivedSuccess(true);
                setOpenNotification(true);
              } else {
                setReceivedSuccess(false);
                setOpenNotification(true);
              }
          })
          .catch((error) => {
            console.error("Error:", error);
          });

    }



    function handleSubmit() {
        const json = JSON.stringify(failureRegValues);
        fetch(`http://localhost:5000/failures/create/${localStorage.getItem('user')}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
          .then(regInfo => {
            console.log("Success:", regInfo.status);
            if (regInfo.status == 200) {
                setReceivedSuccess(true);
                setOpenNotification(true);
              } else {
                setReceivedSuccess(false);
                setOpenNotification(true);
              }
          })
          .catch((error) => {
            console.error("Error:", error);
          });


    }


    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const Input = styled('input')({
      display: 'none',
    });

    const [fileArrayBuffer, setFileArrayBuffer] = useState();
    function setArrayBufferData(newElement) {
      setFileArrayBuffer(newElement);
  }
    
    useEffect(() => {
      if (localStorage.getItem('userType') == 10) {
        fetch(`http://localhost:5000/failures/getRoomList/${localStorage.getItem('user')}`, {
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
        fetch(`http://localhost:5000/failures/getList`, {
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

    function createData(number, fail_id, user_id, room_id, userName, userSurname, room, floor, dorm, dateCreated, dateResolved, comment, type, fStatus, image) {
        return {
          number,
          fail_id,
          user_id,
          room_id,
          userName,
          userSurname,
          room,
          floor,
          dorm,
          dateCreated,
          dateResolved,
          comment,
          type,
          fStatus,
          image
        };
      }

      function createDataTable() {
        if (localStorage.getItem('userType') == 10) {
          console.log("TEST " + resListInfo[0].dateCreated);
            for (var index = 0; index <  resListInfo.length; index++) {
                let dateC = new Date(resListInfo[index].dateCreated);
                const image = new Blob([resListInfo[index].image], { type: "img/*" });
                if (resListInfo[index].dateResolved == undefined) {
                    setTableData(createData(index,  resListInfo[index]._id, resListInfo[index].user_id, resListInfo[index].room_id, "", "", "", "", "", dateC.toISOString().split('T')[0], null, resListInfo[index].comment, resListInfo[index].type, resListInfo[index].status, URL.createObjectURL(image)));
                } else {
                    let dateR = new Date(resListInfo[index].dateResolved);
                    setTableData(createData(index,  resListInfo[index]._id, resListInfo[index].user_id, resListInfo[index].room_id, "", "", "", "", "", dateC.toISOString().split('T')[0], dateR.toISOString().split('T')[0], resListInfo[index].comment, resListInfo[index].type, resListInfo[index].status, URL.createObjectURL(image)));
                }
            }
        } else {
            //CHANGE TO SHOW MORE DATA
            for (var index = 0; index <  1; index++) {
              for (var i = 0; i <  resListInfo[index].listRes.length; i++) {
                let dateC = new Date(resListInfo[index].listRes[i].dateCreated);
                //const image = new Blob([resListInfo[index].listRes[i].image.data], { type: "img/*" });
                //const imageUrl = URL.createObjectURL(resListInfo[index].listRes[i].image);
                //const img = new Buffer.from(resListInfo[index].listRes[i].image.data).toString("base64");
                //const imageUrl = URL.createObjectURL(img);
                //const base64String = btoa(String.fromCharCode(...new Uint8Array(resListInfo[index].listRes[i].image.data)));
                const base64String = btoa(String.fromCharCode(...new Uint8Array(resListInfo[index].listRes[i].image.data)));
                //const base64String = new Buffer.from(resListInfo[index].listRes[i].image.data, 'base64').toString('base64');
                console.log("TEST " + base64String);
                if (resListInfo[index].listRes[i].dateResolved == undefined) {
                    setTableData(createData(index,  resListInfo[index].listRes[i]._id, resListInfo[index].listRes[i].user_id, resListInfo[index].listRes[i].room_id, resListInfo[index].userName, resListInfo[index].userSurname, resListInfo[index].userRoom, resListInfo[index].userFloor, resListInfo[index].userDorm, dateC.toISOString().split('T')[0], null, resListInfo[index].listRes[i].comment, resListInfo[index].listRes[i].type, resListInfo[index].listRes[i].status, base64String));
                } else {
                    let dateR = new Date(resListInfo[index].listRes[i].dateResolved);
                    setTableData(createData(index,  resListInfo[index].listRes[i]._id, resListInfo[index].listRes[i].user_id, resListInfo[index].listRes[i].room_id, resListInfo[index].userName, resListInfo[index].userSurname, resListInfo[index].userRoom, resListInfo[index].userFloor, resListInfo[index].userDorm, dateC.toISOString().split('T')[0], dateR.toISOString().split('T')[0], resListInfo[index].listRes[i].comment, resListInfo[index].listRes[i].type, resListInfo[index].listRes[i].status, base64String));
                }
              }
            }
        }
      }

      const[rows, setTableInfo] = useState([]);
      function setTableData(newElement) {
        setTableInfo(rows => [...rows, newElement]);
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


    const editHandleClose = () => {
      setEditOpen(false);
    };

    /*useEffect(() => {
      if (fileArrayBuffer != "") {
        console.log(resListInfo);
        const file = new Blob([fileArrayBuffer], { type: "application/pdf" });
        console.log(fileArrayBuffer);
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         window.open(fileURL);
      }
    }, [fileArrayBuffer]);*/


    if (localStorage.getItem('userType') == 10) {
        return (
            <div className="text-center m-0">
            <ResponsiveAppBar />
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ width: '180%' }}>
                <h4>Registruoti gedimą 
                    <IconButton color="primary" aria-label="add failure" component="span" size="large" onClick={handleClickOpen}>
                        <AddIcon />
                    </IconButton>
                </h4>
            </Box>
                <MaterialTable
                  icons={tableIcons}
                  columns={[
                  { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                  { title: "Gedimo tipas", align: "left", field: "type", render: rowData => 
                    <p>{rowData.type == "plumbing_issues" ? 'Santechniniai gedimai' : (
                        rowData.type == "electricity_issues" ? 'Elektros tiekimo gedimai' : (
                          rowData.type == "window_issues" ? 'Nesandarūs langai' : 'Kiti gedimai'
                        ))}</p> },
                  { title: "Sukūrimo data", align: "left", field: "dateCreated", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                  { title: "Užbaigimo data", align: "left", field: "dateResolved", type: "date", emptyValue: "-", dateSetting: {locale: "lt"} },
                  { title: "Būsena", type: "boolean", align: "left", field: "fStatus", lookup: { true: 'Pasirašyta', false: 'Nepasirašyta' }, render: rowData =>  
                    <Chip color={rowData.fStatus == "completed" ? "success" : (rowData.fStatus == "canceled" ? "error" : "warning") } label={rowData.fStatus == "completed" ? "Užbaigta" : (rowData.fStatus == "canceled" ? "Atšaukta" : "Vykdoma")}/> },
                  ]}
                  data={rows}
                  title="Sukurtos gedimų registracijos (kambario gyventojų)"
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
                  detailPanel={rowData => {
                    return (
                        <ul>
                            <b>Komentaras:</b>
                            <a>{rowData.comment}</a>
                            <b>Nuotrauka:</b>
                            <img src={rowData.image} width="500" height="300"/>
                        </ul>
                    )
                  }}
                  onRowClick={(event, rowData, togglePanel) => togglePanel()}
                />
              </Paper>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Naujo gedimo registravimas</DialogTitle>
                <DialogContent>
                <Box sx={{ minWidth: 500, maxWidth: 500 }}>
                    <h5>Gedimo tipas: </h5>
                    <FormControl fullWidth sx={{ maxWidth: 300 }}>
                        <InputLabel id="demo-simple-select-label">Gedimas</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="type"
                        label="Gedimas"
                        onChange={SetFailureRegData}
                        >
                        <MenuItem value={"window_issues"}>Nesandarūs langai</MenuItem>
                        <MenuItem value={"plumbing_issues"}>Santechniniai gedimai</MenuItem>
                        <MenuItem value={"electricity_issues"}>Elektros tiekimo gedimai</MenuItem>
                        <MenuItem value={"other_issues"}>Kiti gedimai</MenuItem>
                        </Select>
                    </FormControl>
                    <h5>Aprašymas: </h5>
                    <TextField sx={{ minWidth: 500 }}
                    id="outlined-multiline-flexible"
                    label="Gedimo aprašymas"
                    multiline
                    maxRows={6}
                    name="comment"
                    onChange={SetFailureRegData}
                    />
                </Box>
                
                <label htmlFor="contained-button-file">
                    <h5>Įkelkite nuotrauką</h5>
                    <Input accept='image/*' id="contained-button-file" type="file" name="image" onChange={onSelectFile} />
                    <Button variant="contained" component="span">
                        Įkelti
                    </Button>
                    <p></p>
                    {<img src={preview} width="500" height="300"/>}
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
                        {receivedSuccess ? "Pavyko!" : "Registravimas nepavyko"}
                    </Alert>
                </Collapse>
            </Dialog>
            </div>
        )
    } else if (localStorage.getItem('userType') == 20) {
        return (
            <div className="text-center m-0">
            <AppBarEmployee />
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ width: '180%' }}>
            </Box>
                <MaterialTable
                  icons={tableIcons}
                  columns={[
                  { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                  { title: "Vardas", align: "left", field: "userName" },
                  { title: "Pavardė", align: "left", field: "userSurname" },
                  { title: "Bendrabutis", align: "left", field: "dorm" },
                  { title: "Aukštas", align: "left", field: "floor" },
                  { title: "Kambarys", align: "left", field: "room" },
                  { title: "Gedimo tipas", align: "left", field: "type", render: rowData => 
                  <p>{rowData.type == "plumbing_issues" ? 'Santechniniai gedimai' : (
                      rowData.type == "electricity_issues" ? 'Elektros tiekimo gedimai' : (
                        rowData.type == "window_issues" ? 'Nesandarūs langai' : 'Kiti gedimai'
                      ))}</p> },
                  { title: "Sukūrimo data", align: "left", field: "dateCreated", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                  { title: "Užbaigimo data", align: "left", field: "dateResolved", type: "date", emptyValue: "-", dateSetting: {locale: "lt"} },
                  { title: "Būsena", type: "boolean", align: "left", field: "fStatus", lookup: { true: 'Pasirašyta', false: 'Nepasirašyta' }, render: rowData =>  
                    <Chip color={rowData.fStatus == "completed" ? "success" : (rowData.fStatus == "canceled" ? "error" : "warning") } label={rowData.fStatus == "completed" ? "Užbaigta" : (rowData.fStatus == "canceled" ? "Atšaukta" : "Vykdoma")}/> },
                  { title: "Redaguoti", align: "left", export: false, render: rowData => <IconButton aria-label="view" size="large" onClick={() => SetSelectedData(rowData.fail_id, rowData.user_id, rowData.room_id, rowData.userName, rowData.userSurname, rowData.room, rowData.floor, rowData.dorm, rowData.dateCreated, rowData.dateResolved, rowData.comment, rowData.type, rowData.fStatus, null, null)}><EditIcon /></IconButton>, filtering: false },
                  ]}
                  data={rows}
                  title="Užregistruoti gedimai"
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
                  detailPanel={rowData => {
                    return (
                        <ul>
                            <b>Komentaras:</b>
                            <a>{rowData.comment}</a>
                            <b>Nuotrauka:</b>
                            <img src={`data:image/png;base64,${rowData.image}`} alt="" width="500" height="300"/>
                            <button onClick={() => console.log(`data:image/jpg;base64,${rowData.image}`)}>TEST</button>
                        </ul>
                    )
                  }}
                  onRowClick={(event, rowData, togglePanel) => togglePanel()}
                />
              </Paper>
            </Box>
              <Dialog open={openEdit} onClose={editHandleClose}>
              <DialogTitle>Gedimo keitimas</DialogTitle>
              <DialogContent>
                <Box sx={{ minWidth: 100, maxWidth: 500 }}>
                  <h5>Gedimą užregistravo: {selectedInfo.userName} {selectedInfo.userSurname}</h5>
                  <h5>Bendrabučio nr: {selectedInfo.dorm}, Kambarys: {selectedInfo.room}</h5>
                  <h5>Gedimo tipas: {selectedInfo.type == "plumbing_issues" ? 'Santechniniai gedimai' : (
                        selectedInfo.type == "electricity_issues" ? 'Elektros tiekimo gedimai' : (
                          selectedInfo.type == "window_issues" ? 'Nesandarūs langai' : 'Kiti gedimai'
                        ))}</h5>
                  <h5>Komentaras: {selectedInfo.comment}</h5>
                  <h6>Pakeisti gedimo būseną</h6>
                  <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Pasirinkite gedimo būseną</InputLabel>
                  <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="fStatus"
                  name="fStatus"
                  onChange={SetSelectedInfoData}
                  >
                  {statusAll.map((status, index) =>
                  <MenuItem key={index} value={status == "Vykdoma" ? "processing" : (status == "Užbaigta" ? "completed" : "canceled")}>{status}</MenuItem>
                  )}
                  </Select>
                  </FormControl>
                  <h6>Pasirinkite mokesčių sumą kambariui (palikti tuščią jei nėra)</h6>
                  <FormControl fullWidth >
                    <InputLabel htmlFor="outlined-adornment-amount">Pasirinkite sumą papildomiem mokesčiam</InputLabel>
                    <OutlinedInput
                      disabled={selectedInfo.fStatus == "completed" ? false : true}
                      id="outlined-adornment-amount"
                      name="value"
                      onChange={SetSelectedInfoData}
                      endAdornment={<InputAdornment position="end">€</InputAdornment>}
                      label="Suma"
                    />
                  </FormControl>
                  <h5>Mokesčių priežastis: </h5>
                    <TextField sx={{ minWidth: 500 }}
                    id="outlined-multiline-flexible"
                    label="Mokesčių priežastis"
                    multiline
                    maxRows={2}
                    name="feeComment"
                    onChange={SetSelectedInfoData}
                    />
                </Box>
              </DialogContent>
              <button onClick={() => console.log(selectedInfo)}>TEST</button>
              <DialogActions>
                <Button onClick={editHandleClose}>Atšaukti</Button>
                <Button onClick={handleChangeSubmit}>Pateikti duomenis</Button>
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
        )
    }
}
