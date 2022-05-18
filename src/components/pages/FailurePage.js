import React from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import Chip from '@mui/material/Chip';
import MaterialTable from "material-table";
import tableIcons from "../MaterialTableIcons";

import '../../App.css'

export default function FailurePage() {
    return (
        <div className="text-center">
            <ResponsiveAppBar />
            <h1 className="main-title home-page-title">Gedimai</h1>
        </div>
    )
}
