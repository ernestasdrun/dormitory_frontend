import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useState} from 'react';
import { RegistrationSuccessMessage } from '../RegistrationSuccessMessage';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import '../../App.css'

export default function SignUpPage() {

    const navigate = useNavigate();

    const [openNotification, setOpenNotification] = useState(false);
    const [receivedSuccess, setReceivedSuccess] = useState(false);

    const axios = require('axios').default;

    const[registerInfo, setRegistrationInfo] = useState({
        firstName: "",
        surname: "",
        userName: "",
        password: "",
        email: "",
        phoneNumber: ""
    }); 

    function SetRegisterData(event) {
        setRegistrationInfo(prevFormData =>  {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem('user') != null) {
            navigate('/reservations');
        }
    }, []);

    function handleSubmit() {
        const json = JSON.stringify(registerInfo);

        fetch("http://localhost:5000/users/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
          .then(response => {
            if (response.status == 200) {
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

    onsubmit = (event) => {
        event.preventDefault()
    }


    return (
        <div className="text-center m-5-auto">
            <h5>Susikurkite paskyrą</h5>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Vardas</label><br/>
                    <input type="text" name="firstName" required onChange={SetRegisterData} />
                </p>
                <p>
                    <label>Pavardė</label><br/>
                    <input type="text" name="surname" required onChange={SetRegisterData} />
                </p>
                <p>
                    <label>Vartotojo prisijungimo vardas</label><br/>
                    <input type="text" name="userName" required onChange={SetRegisterData} />
                </p>
                <p>
                    <label>Slaptažodis</label><br/>
                    <input type="password" name="password" requiredc onChange={SetRegisterData} />
                </p>
                <p>
                    <label>El. paštas</label><br/>
                    <input type="email" name="email" required onChange={SetRegisterData} />
                </p>
                <p>
                    <label>Telefono numeris</label><br/>
                    <input type="tel" pattern="[0-9]{9}" name="phoneNumber" required onChange={SetRegisterData} />
                </p>
                <p>
                    <input type="checkbox" name="checkbox" id="checkbox" required /> <span>Sutinku su <a href="https://google.com" target="_blank" rel="noopener noreferrer">naudojimo su sąlygomis</a></span>.
                </p>
                <p>
                    <button id="sub_btn" type="submit">Registruotis</button>
                </p>
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
                        {receivedSuccess ? "Registracija sėkminga" : "Registracija nepavyko"}
                        </Alert>
                    </Collapse>
            </form>
            <footer>
                <p><Link to="/login">Grįžti į prisijungimą</Link>.</p>
            </footer>
        </div>
    )

}
