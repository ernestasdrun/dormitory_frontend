import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { AppBarEmployee } from '../AppBarEmployee';
import { BillCheckout } from '../BillCheckout';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import EuroIcon from '@mui/icons-material/Euro';
import Chip from '@mui/material/Chip';
import MaterialTable from "material-table";
import tableIcons from "../MaterialTableIcons";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import '../../App.css'

const stripePromise = loadStripe("pk_test_51KvQTcDUppirLbInEaeKDbh2PVoJYvpEzklG1S8ohxBNGP9x1h90FZNQH9n97zoF0sY0mZS9maVy4tDIAvtfGuKk00zc6fG0WJ");
  
  export default function UserBills() {

    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState("");

    const appearance = {
      theme: 'stripe',
    };
    const options = {
      clientSecret,
      appearance,
    };

    
    useEffect(() => {
      if (localStorage.getItem('userType') == 10) {
        fetch(`http://localhost:5000/bills/getList/${localStorage.getItem('user')}`, {
          method: "GET"
        })
        .then(response => {
            return response.json()})
        .then(resListInform => {
          for (var index = 0; index <  resListInform.result.length; index++) {
            setResData([resListInform.roomNumber, resListInform.dormAddress, resListInform.user, resListInform.result[index]]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      else if (localStorage.getItem('userType') == 20) {
        fetch(`http://localhost:5000/bills/getList`, {
          method: "GET"
        })
        .then(response => {
            return response.json()})
        .then(resListInform => {
          for (var i = 0; i <  resListInform.length; i++) {
            
            for (var index = 0; index <  resListInform[i].result.length; index++) {
              setResData([resListInform[i].roomNumber, resListInform[i].dormAddress, resListInform[i].user, resListInform[i].result[index]]);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      setWaitingData(false);
    }, []);

    const[waiting, setWaitingInfo] = useState(true);
    function setWaitingData(newElement) {
      setWaitingInfo(newElement);
    }

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

    function createData(number, user_id, userName, userSurname, _id, dormAddress, roomNumber, dateCreated, deadlineDate, totalAmount, isPaid, fees) {
        return {
          number,
          user_id,
          userName,
          userSurname,
          _id,
          dormAddress,
          roomNumber,
          dateCreated,
          deadlineDate,
          totalAmount,
          isPaid,
          fees
        };
      }
      
      function createDataTable() {
        for (var index = resListInfo.length - 1; index >= 0; index--) {
          console.log(resListInfo[index][3].fees);
            let date = new Date(resListInfo[index][3].dateCreated);
            let dateLast = new Date(resListInfo[index][3].deadlineDate);
            setTableData(createData(index, resListInfo[index][3].user_id, resListInfo[index][2][0].firstName, resListInfo[index][2][0].surname, resListInfo[index][3]._id, resListInfo[index][1], resListInfo[index][0], date.toISOString().split('T')[0], dateLast.toISOString().split('T')[0], resListInfo[index][3].totalAmount, resListInfo[index][3].isPaid, resListInfo[index][3].fees));
        }
      }


      const[selectedInfo, setSelectedInfo] = useState({
        user_id: "",
        _id: "",
        totalAmount: "",
        isPaid: ""
    }); 
  
    function SetSelectedData(user_id, _id, totalAmount, isPaid) {
        setSelectedInfo(prevFormData =>  {
            return {
              user_id: user_id,
              _id: _id,
              totalAmount: totalAmount,
              isPaid: isPaid
            }
        })
    }


      const[rows, setTableInfo] = useState([]);
      function setTableData(newElement) {
        setTableInfo(rows => [...rows, newElement]);
      }
      

    useEffect(() => {
      console.log("selected: " + selectedInfo.totalAmount);
      if (selectedInfo.totalAmount != "") {
        fetch("http://localhost:5000/bills/billPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ totalAmount: selectedInfo.totalAmount }] }),
        })
          .then((res) => res.json())
          .then((data) => {
            setClientSecret(data.clientSecret);
            setAmount(data.amount);
            console.log("data: " + data.amount);});
        setOpen(true);
      }
    }, [selectedInfo.totalAmount]);

    const handleClose = () => {
      setOpen(false);
    };

    const [open, setOpen] = useState(false);

      if (localStorage.getItem('userType') == 10) {
        return (
          <div className="text-center m-0">
          <ResponsiveAppBar />
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialTable
                icons={tableIcons}
                columns={[
                { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                { title: "Vardas", align: "left", field: "userName" },
                { title: "Pavardė", align: "left", field: "userSurname" },
                { title: "Bendrabutis", align: "left", field: "dormAddress" },
                { title: "Kambarys", align: "left", field: "roomNumber" },
                { title: "Sąskaitos data", align: "left", field: "dateCreated", defaultSort: "desc" },
                { title: "Sumokėti iki", align: "left", field: "deadlineDate" },
                { title: "Iš viso (Eur)", align: "left", field: "totalAmount", type: "currency", currencySetting:{ locale: "lt", currencyCode:'EUR', minimumFractionDigits:2, maximumFractionDigits:2} },
                { title: "Būsena", type: "boolean", align: "left", field: "isPaid", lookup: { true: 'Sumokėta', false: 'Nesumokėta' }, render: rowData =>  <Chip color={rowData.isPaid ? "success" : "error"} label={rowData.isPaid ? "Sumokėta" : "Nesumokėta"}/> },
                { title: "Mokėjimas", align: "left", export: false, searchable: false, field: "isPaid", filtering: false, render: rowData => <Button variant="contained" style={{display: rowData.isPaid ? 'none' : 'block' }} endIcon={<EuroIcon />} onClick={() => {SetSelectedData(rowData.user_id, rowData._id, rowData.totalAmount, rowData.isPaid)}}>Sumokėti</Button> },
                ]}
                data={rows}
                title="Turimos sąskaitos"
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
                  return (
                    <TableContainer component={Paper}>
                    <Table sx={{ maxWidth: 450 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Paslauga</TableCell>
                          <TableCell align="center">Suma (Eur)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowData.fees).map((fees, index) => (
                          <TableRow
                            key={index}
                          >
                            <TableCell align="center">{fees.description}</TableCell>
                            <TableCell align="center">{fees.amount.toFixed(2)}</TableCell>
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
            <Dialog open={open} onClose={handleClose}>
              <h4>Mokėtina suma: {Number(selectedInfo.totalAmount).toFixed(2)} Eur</h4>
              {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <BillCheckout user_id={selectedInfo.user_id} _id={selectedInfo._id} totalAmount={selectedInfo.totalAmount}/>
              </Elements>
              )}
            </Dialog>
          </Box>
          </div>
        );
      } else {
        return (
          <div className="text-center m-0">
          <AppBarEmployee />
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialTable
                icons={tableIcons}
                columns={[
                { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                { title: "Vardas", align: "left", field: "userName" },
                { title: "Pavardė", align: "left", field: "userSurname" },
                { title: "Bendrabutis", align: "left", field: "dormAddress" },
                { title: "Kambarys", align: "left", field: "roomNumber" },
                { title: "Sąskaitos data", align: "left", field: "dateCreated", defaultSort: "desc" },
                { title: "Sumokėti iki", align: "left", field: "deadlineDate" },
                { title: "Iš viso (Eur)", align: "left", field: "totalAmount", type: "currency", currencySetting:{ locale: "lt", currencyCode:'EUR', minimumFractionDigits:2, maximumFractionDigits:2} },
                { title: "Būsena", type: "boolean", align: "left", field: "isPaid", lookup: { true: 'Sumokėta', false: 'Nesumokėta' }, render: rowData =>  <Chip color={rowData.isPaid ? "success" : "error"} label={rowData.isPaid ? "Sumokėta" : "Nesumokėta"}/> },
                ]}
                data={rows}
                parentChildData={(row, rows) => rows.find(a => a._id === row.parentId)}
                title="Turimos sąskaitos"
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
                  return (
                    <TableContainer component={Paper}>
                    <Table sx={{ maxWidth: 450 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Paslauga</TableCell>
                          <TableCell align="center">Suma (Eur)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowData.fees).map((fees, index) => (
                          <TableRow
                            key={index}
                          >
                            <TableCell align="center">{fees.description}</TableCell>
                            <TableCell align="center">{fees.amount.toFixed(2)}</TableCell>
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
        );
      }
    
  }
  