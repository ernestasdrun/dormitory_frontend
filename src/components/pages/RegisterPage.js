import React from 'react'
import { Link } from 'react-router-dom'
import {useState} from 'react';
import { RegistrationSuccessMessage } from '../RegistrationSuccessMessage';

import '../../App.css'

export default function SignUpPage() {

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


    function handleSubmit() {
        fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Connection': 'keep-alive',
            },
            body: JSON.stringify(registerInfo),
          })
          .then(response => console.log(response.json()))
          .then(registerInfo => {
            console.log('Success:', registerInfo);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
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
                    <input type="text" name="phoneNumber" required onChange={SetRegisterData} />
                </p>
                <p>
                    <input type="checkbox" name="checkbox" id="checkbox" required /> <span>Sutinku su <a href="https://google.com" target="_blank" rel="noopener noreferrer">naudojimo su sąlygomis</a></span>.
                </p>
                <p>
                    <button id="sub_btn" type="submit">Registruotis</button>
                </p>
            </form>
            <footer>
                <p><Link to="/login">Grįžti į prisijungimą</Link>.</p>
            </footer>
        </div>
    )

}
