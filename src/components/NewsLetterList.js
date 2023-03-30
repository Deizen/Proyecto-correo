import React, { Component } from 'react';
import T from 'prop-types';
import {Paper, Container, Typography, Divider,Tooltip,IconButton} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import { SnackbarProvider} from 'notistack';
import SendIcon from '@mui/icons-material/SendOutlined';


// usar tabla normal de material ui
export class NewsLetterList  extends Component{
    // constructor(props) {
    //     super(props);
    // }
    
  render() {
    const {
        listData,
        actionsList: { 
            handleStepperChange, 
            sendEmailList,
        },
      } = this.props
  
  const rows = []
  listData.forEach((item) => {
    const obj = {
      title: item.title,
      category: item.category,
      fileName: item.fileName,
    }
    rows.push(obj)
  })
  
  const columns = [
    { name: 'title', label: 'Tittle' },
    { name: 'category', label: 'Category' },
    { name: 'fileName', label: 'FileName' },
    {
      name: "sendEmail",
      label: "options",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const dataIndex = tableMeta.rowIndex; 
          const rowData = tableMeta.tableData[dataIndex]; 
          const id = rowData.newsLetterId; 
          const send = rowData.sendNewsletter;
          return (
            <>
              {!send ? (
                <Tooltip title="Send Email"> 
                  <IconButton
                    edge="end"
                    aria-label="send"
                    onClick={() => sendEmailList(id)}
                    style={{width:'2em', height:'2em',marginTop:'10px'}}
                  >
                    <SendIcon
                      style={{ color: 'green' }}
                    />
                  </IconButton>
                </Tooltip>
              ) : null
              }
            </>
          );
        }
      }
    }
  ];
  
  
  const options = {
    download : false,
    viewColumns : false,
    print : false,
    selectableRows: 'none',
  };
  
return (
    <Container maxWidth={'md'} style={{padding: 8}}>
    <SnackbarProvider />
    <Paper elevation={3} style={{ padding: '2rem' }}>
      <Typography variant='h2' > App to send newsletters </Typography>
      <Tooltip title=" New Newsletter ">
            <IconButton
              edge="end"
              aria-label="agregar"
              onClick={() => handleStepperChange(1)}
              style={{width:'2em', height:'2em',marginTop:'10px'}}
            >
              <AddIcon
                style={{color: '#28950F',width:'2em', height:'2em'}}
              />
            </IconButton>
          </Tooltip>
      <Divider style={{marginTop:'10px'}} />
      <MUIDataTable
        style={{padding: 8,paddingTop: 16}}
        elevation={0}
        data={listData}
        columns={columns}
        options={options}
      ></MUIDataTable>
    </Paper>
  </Container>
    );
  }
}

NewsLetterList.propTypes = {
  titulo: T.string,
};

export default NewsLetterList;