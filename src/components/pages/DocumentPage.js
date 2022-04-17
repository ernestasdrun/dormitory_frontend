import React from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';

export default function DocumentPage() {
    return (
        <div className="text-center">
            <ResponsiveAppBar />
            <h1 className="main-title home-page-title">Dokumentai</h1>
        </div>
    )
}
