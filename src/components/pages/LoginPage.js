import React from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import {useState} from 'react';

import '../../App.css'

export default function LoginPage() {

    const[loginInfo, setLoginInfo] = useState({
        userName: "",
        password: ""
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


    return (
        <div className="text-center m-0">
            <ResponsiveAppBar />
            <h2>Prisijunkite prie sistemos</h2>
            <form action="/home">
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