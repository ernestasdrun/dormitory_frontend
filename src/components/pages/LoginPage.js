import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import {useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import '../../App.css'

export default function LoginPage() {

    const navigate = useNavigate();

    const[loginInfo, setLoginInfo] = useState({
        userName: "",
        password: "",
        userType: "",
    }); 

    console.log(loginInfo);

    function SetLoginData(event) {
        setLoginInfo(prevFormData =>  {
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

    const onsubmit = (event) => {
        event.preventDefault()
    }

    //const handleChange = (event) => {
    //    setLoginInfo(event.target.value);
    //  };


    function handleSubmit() {
        const json = JSON.stringify(loginInfo);
        //console.log("registration info" + registerInfo);
        //const json = JSON.stringify(registerInfo);
        //console.log("String reg info" + json);
        /*const res = await axios.post("http://localhost:5000/users/register", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.data.data;
        res.data.headers['Content-Type'];*/
        fetch(`http://localhost:5000/users/login_${loginInfo.userName}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
          .then(response => { return response.json();})
          .then(responseData => {console.log(responseData); return responseData;})
          .then(data => {
              if (data == true) {
                localStorage.setItem('user', loginInfo.userName);
                localStorage.setItem('pass', loginInfo.password);
                localStorage.setItem('userType', loginInfo.userType);
                navigate('/home');
              }
            })
          .catch((error) => {
            console.error("Error:", error);
          });
    }


    return (
        <div className="text-center m-5">
            <h2>Prisijunkite prie sistemos</h2>
            <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Vartotojas</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Vartotojas"
                    name="userType"
                    onChange={SetLoginData}
                >
                <MenuItem value={10}>Gyventojas</MenuItem>
                <MenuItem value={20}>Darbuotojas</MenuItem>
                </Select>
            </FormControl>
                <p>
                    <label>Vartotojo vardas</label><br/>
                    <input type="text" name="userName" required id="test" onChange={SetLoginData}/>
                </p>
                <p>
                    <label>Slaptažodis</label>
                    <Link to="/forget-password"><label className="right-label">Pamiršote slaptažodį?</label></Link>
                    <br/>
                    <input type="password" name="password" required onChange={SetLoginData}/>
                </p>
                <p>
                    <button id="sub_btn" type="submit">Prisijungi</button>
                </p>
            </form>
            <footer>
                <p>Neturiti paskyros? <Link to="/register">Registruotis</Link>.</p>
                <p><Link to="/login_employees">Prisijungimas darbuotojams</Link>.</p>
            </footer>
        </div>
    )
}