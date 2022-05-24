import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSearchParams, useParams } from "react-router-dom";
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { AppBarEmployee } from '../AppBarEmployee';
import Chip from '@mui/material/Chip';
import MaterialTable from "material-table";
import tableIcons from "../MaterialTableIcons";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import {Buffer} from 'buffer';
import EditIcon from '@mui/icons-material/Edit';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';

import '../../App.css'

export default function FailurePage(props) {

    const { id } = useParams();

    useEffect(() => {
        if (id != undefined) {
            console.log("test " + id);
            fetch(`http://localhost:5000/rooms/getRoosmByFloor/${id}`, {
              method: "GET"
            })
            .then(response => {
                return response.json()})
            .then(resListInform => {
              for (var index = 0; index <  resListInform.length; index++) {
                setResData(resListInform[index]);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
            setWaitingData(false);
        }

    }, [id]);

    const[waiting, setWaitingInfo] = useState(true);
    function setWaitingData(newElement) {
      setWaitingInfo(newElement);
    }


    const handleRowClick = (event, rowData) => {
        console.log(rowData._id);
      };

    const[resListInfo, setResListInfo] = useState([]);
    function setResData(newElement) {
        setResListInfo(resListInfo => [...resListInfo, newElement]);
    }

    useEffect(() => {
      if (waiting == false) {
        console.log(resListInfo);
        createDataTable();
      }
    }, [resListInfo]);

    function createData(number, _id, roomNumber, maxResidents, residents, freeSpace, users) {
        return {
          number,
          _id,
          roomNumber,
          maxResidents,
          residents,
          freeSpace,
          users
        };
      }

      function createDataTable() {
          console.log("gauta " + resListInfo[0]);
          for (var index = 0; index < resListInfo.length; index++) {
            setTableData(createData(index,  resListInfo[index].room._id, resListInfo[index].room.number, resListInfo[index].room.maxResidents, resListInfo[index].room.residents, resListInfo[index].room.maxResidents - resListInfo[index].room.residents,resListInfo[index].users));
          }
      }

      const[rows, setTableInfo] = useState([]);
      function setTableData(newElement) {
        setTableInfo(rows => [...rows, newElement]);
      }


    return (
        <div className="text-center m-0">
        <AppBarEmployee />
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '180%' }}>
        </Box>
            <MaterialTable
              icons={tableIcons}
              columns={[
              { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
              { title: "Kambario nr.", align: "left", field: "roomNumber", defaultSort: "asc" },
              { title: "Vietų skaičius", align: "left", field: "maxResidents" },
              { title: "Užimtos vietos", align: "left", field: "residents" },
              { title: "Užimtumas", align: "left", field: "freeSpace" , lookup: { 0: 'Užimta', 1: '1 laisva vieta', 2: '2 laisvos vietos', 3: '3 laisvos vietos'}, render: rowData => <Chip color={(rowData.maxResidents - rowData.residents) == 0 ? "error" : "success"} label={(rowData.maxResidents - rowData.residents) == 0 ? "Užimta" : "Laisvos vietos"}/> }
              ]}
              data={rows}
              title="Kambariai"
              options={{
                search: true,
                sorting: true,
                filtering: true,
                exportButton: true,
                pageSizeOptions: [20, 50, 100],
                pageSize: 20,
                exportFileName: "Dokumentai",
                showEmptyDataSourceMessage: "Duomenų nėra",
                padding: "dense"
              }}
              detailPanel={rowData => {
                if (rowData.residents > 0)
                return (
                <TableContainer component={Paper} >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Vardas</TableCell>
                        <TableCell align="left">Pavardė</TableCell>
                        <TableCell align="left">Telefono nr.</TableCell>
                        <TableCell align="left">El. paštas</TableCell>
                        <TableCell align="left">Rezervuota iki</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowData.users).map((users, index) => (
                        <TableRow
                          hover
                          //onClick={() => navigate(`/dorm=${rowData.dormNumber}/floor=${floors._id}/rooms`)}
                          key={index}
                        >
                          <TableCell align="left">{users.firstName}</TableCell>
                          <TableCell align="left">{users.surname}</TableCell>
                          <TableCell align="left">{users.phoneNumber}</TableCell>
                          <TableCell align="left">{users.email}</TableCell>
                          <TableCell align="left">{new Date(users.reservedTill).toISOString().split('T')[0]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                )
                else return (
                    <div>
                        <h6>Gyventojų nėra</h6>
                    </div>
                )
              }}
              onRowClick={(event, rowData, togglePanel) => togglePanel()}
            />
          </Paper>
        </Box>
        </div>
    )
}
