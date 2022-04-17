import React from 'react'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { Link } from 'react-router-dom'

export default function UserProfile() {
    return (
        <div className="text-center">
            <ResponsiveAppBar />
            <h1 className="main-title home-page-title">Profilis</h1>
        </div>
    )
}
