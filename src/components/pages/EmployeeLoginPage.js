import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useState} from 'react';

import '../../App.css'

export default function EmployeeLoginPage() {

    var temp;

    const[loginInfo, setLoginInfo] = useState({
        userName: "",
        password: ""
    }); 


    var user;
    var pass;
    var setPass;
    //https://stackoverflow.com/questions/58214510/how-to-store-user-profile-information-and-access-it-globally-in-react-components
    function SetUser(event) {
        //setValue(event.target.value)
        //localStorage.setItem('user', user);
        //localStorage.setItem('pass', pass);
        //console.log(user);
        //console.log(pass);
    }

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

    }, [user])

    return (
        <div className="text-center m-5-auto">
            <h2>Darbuotojų prisijungimas</h2>
            <form action="/home">
                <p>
                    <label>Vartotojo kodas</label><br/>
                    <input type="text" name="userName" required value={user} onChange={SetLoginData} />
                </p>
                <p>
                    <label>Slaptažodis</label>
                    <br/>
                    <input type="password" name="password" required value={pass} onChange={SetLoginData} />
                </p>
                <p>
                    <button id="sub_btn" type="submit" onClick={() => SetUser()}>Prisijungti</button>
                </p>
            </form>
            <footer>
                <p><Link to="/login">Grįžti į vartotojo prisijungimą</Link>.</p>
                <p>{temp}</p>
            </footer>
        </div>
    )
}
