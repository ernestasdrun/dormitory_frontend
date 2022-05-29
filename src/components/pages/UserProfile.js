import React, { useEffect } from 'react'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { Link } from 'react-router-dom'
import {useState} from 'react';

import '../../App.css'

export default function UserProfile() {


    const[userInfo, setUserInfo] = useState({
        firstName: "",
        surname: "",
        password: "",
        email: "",
        phoneNumber: ""
    }); 

    const[userPass, setUserPass] = useState({
        password: ""
    }); 

    function SetUserData(event) {
        setUserInfo(prevFormData =>  {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }


    useEffect(() => {
        fetch(`http://localhost:5000/users/info_${localStorage.getItem('user')}`, {
            method: "GET"
          })
          .then(response => {
              return response.json()})
          .then(userInform => {
              setUserInfo(userInform[0]);
            console.log("Success:", userInform[0].firstName);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    }, [])



    function handleSubmit() {
        const json = JSON.stringify(userInfo);

        fetch(`http://localhost:5000/users/update_${localStorage.getItem('user')}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
          .then(response => console.log(response.json()))
          .then(userInform => {
            console.log("Success:", userInform);
            setUserInfo(userInform);
            console.log("new data: " + userInfo);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    }


    function handleSubmitPassword() {
        const json = JSON.stringify(userInfo);

        fetch(`http://localhost:5000/users/update_${localStorage.getItem('user')}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
          .then(response => console.log(response.json()))
          .then(userInform => {
            console.log("Success:", userInform);
            setUserInfo(userInform);
            console.log("new data: " + userInfo);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    }

    //onsubmit = (event) => {
    //    event.preventDefault()
    //}

    return (
        <div className="text-center">
            <ResponsiveAppBar />
            <p> </p>
            <h2>Vartotojo informacijos naujinimas</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Vardas</label>
                    <input type="text" name="firstName" value={userInfo.firstName} required onChange={SetUserData} />
                </p>
                <p>
                    <label>Pavardė</label>
                    <input type="text" name="surname" value={userInfo.surname} required onChange={SetUserData} />
                </p>
                <p>
                    <label>El. paštas</label>
                    <input type="email" name="email" value={userInfo.email} required onChange={SetUserData} />
                </p>
                <p>
                    <label>Telefono numeris</label>
                    <input type="tel" pattern="[0-9]{9}" name="phoneNumber" value={userInfo.phoneNumber} required onChange={SetUserData} />
                </p>
                <p>
                    <button id="sub_btn" type="submit">Keisti duomenis</button>
                </p>
            </form>
            <h2>Slaptažodžio keitimas</h2>
            <form onSubmit={handleSubmitPassword}m>
                <p>
                    <label>Dabartinis slaptažodis</label>
                    <input type="password" name="password" required onChange={setUserPass}/>
                </p>
                <p>
                    <label>Naujas slaptažodis</label>
                    <input type="password" name="password" required onChange={setUserPass}/>
                </p>
                <p>
                    <label>Pakartokite naują slaptažodį</label>
                    <input type="password" name="password" required onChange={setUserPass}/>
                </p>
                <button id="sub_btn" type="submit">Keisti slaptažodį</button>
            </form>
        </div>
    )
}
