import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import {useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function ReservationPage() {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));



    const username = localStorage.getItem('user');

    const[isReserved, setReservedInfo] = useState(false); 

    // save reservation form ingo
    const[reservationInfo, setReservationInfo] = useState({
        dorm: "",
        floor: "",
        maxResidents: "",
        room: ""
    }); 

    function SetReservationData(event) {
        setReservationInfo(prevFormData =>  {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    //Save current dorms from fetch
    const[dormInfo, setDormInfo] = useState([]); 
    function setDormData(newElement) {
        setDormInfo(dormInfo => [...dormInfo, newElement]);
    }

    //Save current floors from fetch
    const[floorInfo, setFloorInfo] = useState([]); 
    function setFloorData(newElement) {
        setFloorInfo(floorInfo => [...floorInfo, newElement]);
    }
    const clearFloorState = () => {
        setFloorInfo({ ...floorInfo });
        setFloorInfo(floorInfo => []);
        //reservationInfo.floor = "";
    };

    //Save current rooms from fetch
    const[roomInfo, setRoomInfo] = useState([]); 
    function setRoomData(newElement) {
        setRoomInfo(roomInfo => [...roomInfo, newElement]);
    }
    const clearRoomState = () => {
        setRoomInfo({ ...roomInfo });
        setRoomInfo(roomInfo => []);
        //reservationInfo.room = "";
    };

    //Get dorms on entering page
    useEffect(() => {
        fetch(`http://localhost:5000/dorms/get`, {
            method: "GET"
          })
          .then(response => {
              return response.json()})
          .then(dormInform => {
              for (var index = 0; index < dormInform.length; index++) {
                setDormData(dormInform[index].dormNumber);
                setReservationInfo(dormInform[index].dormAddress);
              }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    }, []);

    //Get floors after dorm is selected
    useEffect(() => {
        fetch(`http://localhost:5000/floors/get_${reservationInfo.dorm}`, {
            method: "GET"
          })
          .then(response => {
              return response.json()})
          .then(floorInform => {
            clearFloorState();
              for (var index = 0; index < floorInform.length; index++) {
                setFloorData(floorInform[index].floor);
              }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    }, [reservationInfo.dorm]);


        //Get rooms after floor and type is selected
        useEffect(() => {
            console.log("Test: " + reservationInfo.maxResidents);
            fetch(`http://localhost:5000/rooms/get/${reservationInfo.dorm}/${reservationInfo.floor}/${reservationInfo.maxResidents}`, {
                method: "GET"
              })
              .then(response => {
                  return response.json()})
              .then(roomInform => {
                clearRoomState();
                  for (var index = 0; index < roomInform.length; index++) {
                    console.log("Rooms: " + roomInform.length);
                    setRoomData(roomInform[index].number);
                    //console.log("Success:", floorInform[index]);
                  }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
        }, [reservationInfo.maxResidents]);


    //Rendering
    if (localStorage.getItem('userType') == 10) {
            
        fetch(`http://localhost:5000/users/hasRoom_${username}`, {
        method: "GET"
        })
        .then(response => { return response.json();})
        .then(responseData => {console.log(responseData); return responseData;})
        .then(data => {
            if (data == 1) {
                setReservedInfo(isReserved => true)
            } else {
                setReservedInfo(isReserved => false)
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

        onsubmit = (event) => {
            event.preventDefault()
        }


        function handleSubmit() {
            const json = JSON.stringify(reservationInfo);
            fetch("http://localhost:5000/reservations/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: json,
              })
              .then(reservationInfo => {
                console.log("Success:", reservationInfo);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
        }



        if (isReserved) {
            return (
                <div className="text-center">
                    <h1 className="main-title home-page-title">Rezervacija (yra paskyra)</h1>
                </div>
            )
        } else {
            return (
                <div className="text-center">
                    <button onClick={() => {console.log("Array:", floorInfo);}}>click me</button>
                    <form onSubmit={handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                            <label>Pasirinkite norimą bendrabutį</label>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <Box sx={{ minWidth: 100, maxWidth: 160 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Bendrabučio nr.</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                     label="dormNum"
                                     name="dorm"
                                     onChange={SetReservationData}
                                     onClick={dormInfo.sort()}
                                     >
                                    {dormInfo.map((dorm, index) =>
                                    <MenuItem key={index} value={dorm}>{dorm}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <label >{reservationInfo.dormAddress}</label>
                        </Grid>
                        <Grid item xs={4}>
                            <label>Pasirinkite norimą aukštą</label>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <Box sx={{ minWidth: 100, maxWidth: 160 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Pasirinkite aukštą</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                     label="dormFloor"
                                     name="floor"
                                     onChange={SetReservationData}
                                     onClick={floorInfo.sort()}
                                     >
                                    {floorInfo.map((floor, index) =>
                                    <MenuItem key={index} value={floor}>{floor}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Item>9</Item>
                        </Grid>
                        <Grid item xs={4}>
                            <label>Pasirinkite norimą kambario vietų skaičių</label>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <Box sx={{ minWidth: 100, maxWidth: 160 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Pasirinkite tipą</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                     label="dormFloor"
                                     name="maxResidents"
                                     onChange={SetReservationData}
                                     >
                                    <MenuItem value={1}>Vienvietis</MenuItem>
                                    <MenuItem value={2}>Dvivietis</MenuItem>
                                    <MenuItem value={3}>Trivietis</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Item>13</Item>
                        </Grid>
                        <Grid item xs={4}>
                            <label>Pasirinkite norimą kambarį</label>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <Box sx={{ minWidth: 100, maxWidth: 160 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Bendrabučio nr.</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                     label="roomNum"
                                     name="room"
                                     onChange={SetReservationData}
                                     onClick={roomInfo.sort()}
                                     >
                                    {roomInfo.map((room, index) =>
                                    <MenuItem key={index} value={room}>{room}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Item>17</Item>
                        </Grid>
                    </Grid>
                    <p></p>
                    <Button variant="contained" type="submit">Rezervuoti</Button>
                    </form>
                </div>
            )
        }
    }

    if (localStorage.getItem('userType') == 20) {
        if (true) {
            return (
                <div className="text-center">
                    <h1 className="main-title home-page-title">Rezervacijos</h1>
                </div>
            )
        } else {
            return (
                <div className="text-center">
                    <h1 className="main-title home-page-title">Rezervacijos</h1>
                </div>
            )
        }
    } else {
        return (
            <div className="text-center">
                    <h1 className="main-title home-page-title">Rezervacijos</h1>
                </div>
        )
    }
}
