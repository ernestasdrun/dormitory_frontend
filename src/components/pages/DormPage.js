import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

export default function FailurePage() {

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/dorms/getWithFloors`, {
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
    }, []);

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

    function createData(number, _id, dormNumber, dormAddress, dormFloors, floor) {
        return {
          number,
          _id,
          dormNumber,
          dormAddress,
          dormFloors,
          floor
        };
      }

      function createDataTable() {
        console.log(JSON.stringify(resListInfo[0].floors[0]._id));
          for (var index = 0; index < resListInfo.length; index++) {
            setTableData(createData(index,  resListInfo[index].dorm._id, resListInfo[index].dorm.dormNumber, resListInfo[index].dorm.dormAddress, resListInfo[index].dorm.dormFloors, resListInfo[index].floors));
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
              { title: "Bendrabutis", align: "left", field: "dormNumber", defaultSort: "asc" },
              { title: "Adresas", align: "left", field: "dormAddress" },
              { title: "Aukštai", align: "left", field: "dormFloors" },
              { title: "Darbuotojas", align: "left", field: "dormFloors", hidden: true },
              ]}
              data={rows}
              title="Užregistruoti gedimai"
              options={{
                search: true,
                sorting: true,
                filtering: true,
                exportButton: true,
                pageSizeOptions: [10, 20, 50],
                pageSize: 10,
                exportFileName: "Dokumentai",
                showEmptyDataSourceMessage: "Duomenų nėra",
                padding: "dense"
              }}
              detailPanel={rowData => {
                return (


                <TableContainer component={Paper} >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Aukštas</TableCell>
                        <TableCell align="left">Kambarių skaičius</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowData.floor).map((floors, index) => (
                        <TableRow
                          hover
                          onClick={() => navigate(`/dorm=${rowData.dormNumber}/floor=${floors._id}/rooms`)}
                          key={index}
                        >
                          <TableCell align="left">{floors.floor}</TableCell>
                          <TableCell align="left">{floors.floorRooms}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>



                )
              }}
              onRowClick={(event, rowData, togglePanel) => togglePanel()}
            />
          </Paper>
        </Box>
        </div>
    )
}
