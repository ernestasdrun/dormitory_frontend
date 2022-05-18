import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import NotExisting from './components/pages/NotExisting'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import ForgetPasswordPage from './components/pages/ForgetPasswordPage'
import CustomerHomePage from './components/pages/CustomerHomePage'
import UserProfile from './components/pages/UserProfile'
import UserBills from './components/pages/UserBills'
import ReservationPage from './components/pages/ReservationPage'
import DocumentPage from './components/pages/DocumentPage'
import FailurePage from './components/pages/FailurePage'
import ReservationsListPage from './components/pages/ReservationsListPage'

import './App.css'

export default function App() {

    if (localStorage.getItem('user') == null)
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forget-password" element={<ForgetPasswordPage />} />
                    <Route path="/home" element={<CustomerHomePage />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/bills" element={<UserBills />} />
                    <Route path="/reservations" element={<ReservationPage />} />
                    <Route path="/reservList" element={<ReservationsListPage />} />
                    <Route path="/documents" element={<DocumentPage />} />
                    <Route path="/failures" element={<FailurePage />} />
                    <Route path="*" element={<NotExisting />} />
                </Routes>
            </div>
        </Router>
    )
    else return (
        <Router>
        <div>
            <Routes>
                <Route exact path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forget-password" element={<ForgetPasswordPage />} />
                <Route path="/home" element={<CustomerHomePage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/bills" element={<UserBills />} />
                <Route path="/reservations" element={<ReservationPage />} />
                <Route path="/reservList" element={<ReservationsListPage />} />
                <Route path="/documents" element={<DocumentPage />} />
                <Route path="/failures" element={<FailurePage />} />
                <Route path="*" element={<NotExisting />} />
            </Routes>
        </div>
    </Router>
    )
}