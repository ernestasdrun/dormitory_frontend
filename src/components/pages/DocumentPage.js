import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ResponsiveAppBar } from '../ResponsiveAppBar';
import { AppBarEmployee } from '../AppBarEmployee';
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
import Chip from '@mui/material/Chip';
import MaterialTable from "material-table";
import tableIcons from "../MaterialTableIcons";
import { lt } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import '../../App.css'
import { LocalizationProvider } from '@mui/x-date-pickers';

  
  export default function DocumentPage() {

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const Input = styled('input')({
      display: 'none',
    });

    const [fileArrayBuffer, setFileArrayBuffer] = useState();
    function setArrayBufferData(newElement) {
      setFileArrayBuffer(newElement);
  }
    
    useEffect(() => {
      if (localStorage.getItem('userType') == 10) {
        fetch(`http://localhost:5000/documents/getList/${localStorage.getItem('user')}`, {
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
      }
      else if (localStorage.getItem('userType') == 20) {
        fetch(`http://localhost:5000/documents/getFiles`, {
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

    function createData(number, user_id, reservation_id, _id, userName, userSurname, fileName, isSigned, dateUploaded) {
        return {
          user_id,
          reservation_id,
          number,
          _id,
          userName,
          userSurname,
          fileName,
          isSigned,
          dateUploaded
        };
      }
      
      function createDataTable() {
        for (var index = 0; index <  resListInfo.length; index++) {
          let date = new Date(resListInfo[index].dateUploaded);
          // DELETE IF STATEMENT AND ELSE AFTER TEST VALUES ARE DELETED FROM DB
          if (resListInfo[index].dateUploaded != null && resListInfo[index].dateUploaded != undefined && resListInfo[index].dateUploaded != "")
          setTableData(createData(index, resListInfo[index].user_id, resListInfo[index].reservation_id, resListInfo[index]._id, resListInfo[index].userName, resListInfo[index].userSurname, resListInfo[index].fileName, resListInfo[index].isSigned, date.toISOString().split('T')[0]));
          else setTableData(createData(index, resListInfo[index].user_id, resListInfo[index].reservation_id, resListInfo[index]._id, resListInfo[index].userName, resListInfo[index].userSurname, resListInfo[index].fileName, resListInfo[index].isSigned, resListInfo[index].dateUploaded));
        }
      }

      const[rows, setTableInfo] = useState([]);
      function setTableData(newElement) {
        setTableInfo(rows => [...rows, newElement]);
      }
      
      
      const headCells = [
        {
          id: 'view',
          numeric: false,
          disablePadding: true,
          label: '',
        },
        {
          id: 'number',
          numeric: false,
          disablePadding: true,
          label: 'Nr',
        },
        {
          id: 'userName',
          numeric: false,
          disablePadding: true,
          label: 'Vardas',
        },
        {
          id: 'userSurname',
          numeric: true,
          disablePadding: false,
          label: 'Pavardė',
        },
        {
          id: 'fileName',
          numeric: true,
          disablePadding: false,
          label: 'Dokumentas',
        },
        {
          id: 'isSigned',
          numeric: true,
          disablePadding: false,
          label: 'Būsena',
        }
      ];
      
      function EnhancedTableHead(props) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
          props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };
      
        return (
          <TableHead>
            <TableRow>
      
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      }
      
      EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
      };
      
      const EnhancedTableToolbar = (props) => {
        const { numSelected } = props;

      
        return (
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(numSelected > 0 && {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              }),
            }}
          >
              <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Įkelti dokumentai
              </Typography>

              <Tooltip title="Filtruoti">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
          </Toolbar>
        );
      };
      
      EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
      };

    const showFile = async (id) => {
      await axios
      .get(`http://localhost:5000/documents/getFullFile/${id}`, {
        responseType: 'blob'

      })
      .then(response => {
        //console.log("response: " + response[0]._id);
        setArrayBufferData(response.data);
        //Create a Blob from the PDF Stream
        //const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        //const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         //window.open(fileURL);
         //pdfWindow.location.href = fileURL;            
      })
      .catch((error) => {
        console.log(error);
      });

    }

    const submitSigning = (doc_id, res_id) => {
      console.log(res_id);

      const jsonDoc = JSON.stringify({
        _id: doc_id,
        isSigned: true
    });
      fetch(`http://localhost:5000/documents/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonDoc,
        })
        .then(response => console.log(response.json()))
        .catch((error) => {
          console.error("Error:", error);
        });

      const json = JSON.stringify({
        _id: res_id,
        status: "Laukiama depozito"
    });
      fetch(`http://localhost:5000/reservations/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        })
        .then(response => console.log(response.json()))
        .catch((error) => {
          console.error("Error:", error);
        });

    }

    useEffect(() => {
      if (fileArrayBuffer != "") {
        console.log(resListInfo);
        const file = new Blob([fileArrayBuffer], { type: "application/pdf" });
        console.log(fileArrayBuffer);
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         window.open(fileURL);
      }
    }, [fileArrayBuffer]);


      if (localStorage.getItem('userType') == 10) {
        return (
          <div className="text-center m-0">
          <ResponsiveAppBar />
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '70%', mb: 2, position: 'absolute', top: 130, left: 375, right: 0, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialTable
                icons={tableIcons}
                columns={[
                { title: "Peržiūrėti", align: "center", export: false, render: rowData => <IconButton aria-label="view" size="large" onClick={() => showFile(rowData._id)}><RemoveRedEyeIcon /></IconButton>, filtering: false },
                { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                { title: "Vardas", align: "left", field: "userName" },
                { title: "Pavardė", align: "left", field: "userSurname" },
                { title: "Dokumentas", align: "left", field: "fileName" },
                { title: "Įkėlimo data", align: "left", field: "dateUploaded", defaultSort: "desc", type: "date", dateSetting: {locale: "lt"} },
                { title: "Būsena", type: "boolean", align: "left", field: "isSigned", lookup: { true: 'Pasirašyta', false: 'Nepasirašyta' }, render: rowData =>  <Chip color={rowData.isSigned ? "success" : "error"} label={rowData.isSigned ? "Pasirašyta" : "Nepasirašyta"}/> },
                { title: "Pasirašyti", align: "left", export: false, searchable: false, field: "isSigned", filtering: false, render: rowData => <Button variant="contained" style={{display: rowData.isSigned ? 'none' : 'block' }} endIcon={<BorderColorIcon />} onClick={() => {submitSigning(rowData._id, rowData.reservation_id)}}>Pasirašyti</Button> },
                ]}
                data={rows}
                title="Įkelti dokumentai"
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
              />
            </Paper>
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
                { title: "Peržiūrėti", align: "center", export: false, render: rowData => <IconButton aria-label="view" size="large" onClick={() => showFile(rowData._id)}><RemoveRedEyeIcon /></IconButton>, filtering: false },
                { title: "Nr.", align: "left", type: "numeric", field: "number", filtering: false, hidden: true },
                { title: "Vardas", align: "left", field: "userName" },
                { title: "Pavardė", align: "left", field: "userSurname" },
                { title: "Dokumentas", align: "left", field: "fileName" },
                { title: "Įkėlimo data", align: "left", field: "dateUploaded", defaultSort: "desc", dateSetting: {locale: "lt"} },
                { title: "Būsena", type: "boolean", align: "left", field: "isSigned", lookup: { true: 'Pasirašyta', false: 'Nepasirašyta' }, render: rowData =>  <Chip color={rowData.isSigned ? "success" : "error"} label={rowData.isSigned ? "Pasirašyta" : "Nepasirašyta"}/> },
                ]}
                data={rows}
                title="Įkelti dokumentai"
              />
            </Paper>
          </Box>
          </div>
        );
      }
    
  }
  