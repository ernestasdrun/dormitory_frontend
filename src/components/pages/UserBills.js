import React from 'react'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { Link } from 'react-router-dom'

import '../../App.css'

export default function UserBills() {
    return (
        <div className="text-center">
            <ResponsiveAppBar />
            <h1 className="main-title home-page-title">Saskaitos</h1>
        </div>
    )
}
