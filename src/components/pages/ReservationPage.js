import React from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import {useState} from 'react';

export default function ReservationPage() {

    const[isReserved, setReservedInfo] = useState(false); 

    const[reservationInfo, setReservationInfo] = useState({
        surname: "",
        userName: "",
        password: "",
        email: "",
        phoneNumber: ""
    }); 

    function SetReservationData(event) {
        setReservationInfo(prevFormData =>  {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }


    const username = localStorage.getItem('user');

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


        if (isReserved) {
            return (
                <div className="text-center">
                    <ResponsiveAppBar />
                    <h1 className="main-title home-page-title">Rezervacija (yra paskyra)</h1>
                </div>
            )
        } else {
            return (
                <div className="text-center">
                    <ResponsiveAppBar />
                    <form >
                        <p>
                            <label>Pasirinkite norimą bendrabutį</label>
                        </p>
                        <p>
                            <label>Pasirinkite norimą aukštą</label>
                        </p>
                        <p>
                            <label>Pasirinkite norimą kambario vietų skaičių</label>
                        </p>
                        <p>
                            <label>Pasirinkite norimą kambarį</label>
                        </p>
                        
                    </form>
                </div>
            )
        }
    }

    if (localStorage.getItem('userType') == 20) {
        if (true) {
            return (
                <div className="text-center">
                    <ResponsiveAppBar />
                    <h1 className="main-title home-page-title">Rezervacijos</h1>
                </div>
            )
        } else {
            return (
                <div className="text-center">
                    <ResponsiveAppBar />
                    <h1 className="main-title home-page-title">Rezervacijos</h1>
                </div>
            )
        }
    } else {
        return (
            <div className="text-center">
                    <ResponsiveAppBar />
                    <h1 className="main-title home-page-title">Rezervacijos</h1>
                </div>
        )
    }
}
