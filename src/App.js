import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import NotExisting from './components/pages/NotExisting'
import LoginPage from './components/pages/LoginPage'
import EmployeeLoginPage from './components/pages/EmployeeLoginPage'
import RegisterPage from './components/pages/RegisterPage'
import ForgetPasswordPage from './components/pages/ForgetPasswordPage'
import CustomerHomePage from './components/pages/CustomerHomePage'
import UserProfile from './components/pages/UserProfile'
import UserBills from './components/pages/UserBills'
import ReservationPage from './components/pages/ReservationPage'
import DocumentPage from './components/pages/DocumentPage'
import FailurePage from './components/pages/FailurePage'

import './App.css'

export default function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login_employees" element={<EmployeeLoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forget-password" element={<ForgetPasswordPage />} />
                    <Route path="/home" element={<CustomerHomePage />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/bills" element={<UserBills />} />
                    <Route path="/reservations" element={<ReservationPage />} />
                    <Route path="/documents" element={<DocumentPage />} />
                    <Route path="/failures" element={<FailurePage />} />
                    <Route path="*" element={<NotExisting />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

const Footer = () => {
    return (
        <p className="text-center" style={ FooterStyle }>Designed & coded by Ernestas</p>
    )
}

const FooterStyle = {
    background: "#222",
    fontSize: ".8rem",
    color: "#fff",
    position: "absolute",
    bottom: 0,
    padding: "1rem",
    margin: 0,
    width: "100%",
    opacity: ".5"
}